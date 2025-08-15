import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '../../modules/auth/auth.service';
import { AppException } from '../../shared/exceptions';

export function authGuard() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new AppException('No token provided', HttpStatusCode.Unauthorized);
      }

      const [type, token] = authHeader.split(' ');

      if (type !== 'Bearer' || !token) {
        throw new AppException('Invalid token format', HttpStatusCode.Unauthorized);
      }

      // Validar o token
      const authService = container.resolve(AuthService);
      const decoded = authService.validateToken(token);

      // Adicionar os dados do usuário ao request para uso posterior
      (req as any).user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
}
