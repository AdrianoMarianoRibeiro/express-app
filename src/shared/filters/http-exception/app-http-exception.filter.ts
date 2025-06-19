import { NextFunction, Request, Response } from 'express';
import { AppException } from '../../exceptions';

export class AppExceptionFilter {
  static catch() {
    return (error: Error, req: Request, res: Response, next: NextFunction) => {
      // Verificar se a resposta já foi enviada
      if (res.headersSent) {
        return next(error);
      }

      // Marcar a resposta como sendo de erro para evitar interceptação
      (res as any).__isErrorResponse = true;

      // Se for uma AppException, trata de forma específica
      if (error instanceof AppException) {
        const status = error.getStatus();

        return res.status(status).json({
          code: status,
          data: error.data || error.message || null,
        });
      }

      // Erro genérico
      return res.status(500).json({
        code: 500,
        data: 'Internal Server Error',
      });
    };
  }
}
