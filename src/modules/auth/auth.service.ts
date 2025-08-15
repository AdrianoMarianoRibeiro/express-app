import { HttpStatusCode } from 'axios';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { AppException } from '../../shared/exceptions';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UserService } from '../user/user.service';
import { AuthDto } from './dtos';
import { LoginResponse, RefreshTokenPayload, TokenPayload } from './interfaces';

@injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    @inject(UserService) private readonly userService: UserService,
    @inject(BcryptService) private readonly bcryptService: BcryptService,
  ) {}

  async login(authDto: AuthDto): Promise<LoginResponse> {
    // Encontrar usuário pelo email
    const user = await this.userService.findByEmail(authDto.email);

    if (!user) {
      throw new AppException('Invalid credentials', HttpStatusCode.Unauthorized);
    }

    // Verificar se o usuário está ativo
    if (!user.status) {
      throw new AppException('User is inactive', HttpStatusCode.Unauthorized);
    }

    // Obter a entidade do usuário para acessar a senha
    const userEntity = await this.userService.findById(user.id);

    if (!userEntity) {
      throw new AppException('User not found', HttpStatusCode.NotFound);
    }

    // Verificar senha
    const isPasswordValid = await this.bcryptService.compare(authDto.password, userEntity.password);

    if (!isPasswordValid) {
      throw new AppException('Invalid credentials', HttpStatusCode.Unauthorized);
    }

    // Gerar tokens JWT (stateless)
    const { accessToken } = this.generateTokens(user.id, user.email, user.name);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logout(request: Request): Promise<{ message: string }> {
    try {
      // Extrair token do header Authorization no formato Express
      const authHeader = request.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        throw new AppException('No token provided', HttpStatusCode.Unauthorized);
      }

      // Verificar se o token é válido antes de adicionar à blacklist
      const decoded = this.validateToken(token);

      // Adicionar o JTI (token ID) à blacklist (se existir)
      if (decoded.jti) {
        this.blacklistedTokens.add(decoded.jti);
      }

      // Opcional: também invalidar o refresh token se fornecido
      const refreshToken = request.headers['x-refresh-token'] as string;
      if (refreshToken) {
        try {
          const refreshSecret =
            process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production';
          const decodedRefresh = verify(refreshToken, refreshSecret) as RefreshTokenPayload;
          if (decodedRefresh.jti) {
            this.blacklistedTokens.add(decodedRefresh.jti);
          }
        } catch (error: any) {
          console.error('Error processing refresh token:', error.message);
        }
      }

      return { message: 'Logout successful' };
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException('Logout failed', HttpStatusCode.BadRequest);
    }
  }

  async refreshToken(request: Request): Promise<any> {
    try {
      // Obter token do header ou do body
      let token: string | undefined;

      // Tentar obter do header Authorization
      const authHeader = request.headers.authorization;
      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
        }
      }

      // Se não encontrou no header, tentar no body
      if (!token && request.body && request.body.refreshToken) {
        token = request.body.refreshToken;
      }

      if (!token) {
        throw new AppException('No refresh token provided', HttpStatusCode.Unauthorized);
      }

      // Verificar a assinatura do token
      const refreshSecret =
        process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production';
      const decoded = verify(token, refreshSecret) as RefreshTokenPayload;

      // Obter usuário
      const user = await this.userService.find(decoded.sub as any);

      if (!user) {
        throw new AppException('User not found', HttpStatusCode.NotFound);
      }

      // Verificar se o usuário está ativo
      if (!user.status) {
        throw new AppException('User is inactive', HttpStatusCode.Unauthorized);
      }

      // Gerar novos tokens
      return this.generateTokens(user.id, user.email, user.name);
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException('Invalid refresh token', HttpStatusCode.Unauthorized);
    }
  }

  validateToken(token: string): TokenPayload {
    try {
      const secret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
      const decoded = verify(token, secret) as TokenPayload;
      return decoded;
    } catch (error: any) {
      throw new AppException('Invalid token', HttpStatusCode.Unauthorized, error.message);
    }
  }

  // Método para limpar tokens expirados da blacklist (opcional)
  cleanupBlacklist(): void {
    // Esta implementação simples limpa todos os tokens
    // Em produção, você deveria verificar os timestamps de expiração
    this.blacklistedTokens.clear();
  }

  // Método para verificar se um token está na blacklist
  isTokenBlacklisted(jti: string): boolean {
    return this.blacklistedTokens.has(jti);
  }

  private generateTokens(
    userId: string,
    email: string,
    name: string,
  ): { accessToken: string; refreshToken: string } {
    // Gerar access token
    const accessPayload: TokenPayload = {
      sub: userId,
      jti: uuidv4(),
      email,
      name,
    };

    const accessSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    const accessExpires = process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 3600; // 1 hora por padrão

    const accessOptions: SignOptions = { expiresIn: accessExpires };
    const accessToken = sign(accessPayload, accessSecret, accessOptions);

    // Gerar refresh token (stateless)
    const jti = uuidv4(); // ID único para o token
    const refreshPayload: RefreshTokenPayload = {
      sub: userId,
      jti,
      // Incluir mais dados se necessário
      // version: 1, // Útil se precisar invalidar todos os tokens
    };

    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production';
    const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN
      ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
      : 3600;

    const refreshOptions: SignOptions = { expiresIn: refreshExpires };
    const refreshToken = sign(refreshPayload, refreshSecret, refreshOptions);

    return {
      accessToken,
      refreshToken,
    };
  }
}
