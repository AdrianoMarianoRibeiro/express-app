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

  async logout(): Promise<void> {
    // Em uma implementação stateless, não podemos realmente "revogar" tokens
    // Uma opção seria manter uma pequena blacklist de tokens revogados em cache (Redis)
    // Por enquanto, vamos simplesmente retornar (os tokens expirarão por si só)
    return;
  }

  async refreshToken(request: Request): Promise<any> {
    try {
      // Correção: usar o método .get() em vez de notação de colchetes
      const authHeader = request.headers.get('authorization');
      const token = authHeader && authHeader.split(' ')[1];

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
