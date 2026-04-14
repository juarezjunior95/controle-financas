import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { verifyJwt, JwtPayload } from '../config/jwt';

const isClerkConfigured = !!process.env.CLERK_SECRET_KEY;

export interface AuthenticatedRequest extends Request {
  auth?: JwtPayload;
}

/**
 * Middleware global do Clerk.
 * Mantido para compatibilidade com o SDK, mas a autenticação de rotas
 * é feita via JWT próprio pelo requireAuthentication.
 */
export const clerkAuth = isClerkConfigured
  ? clerkMiddleware()
  : (_req: Request, _res: Response, next: NextFunction) => next();

/**
 * Middleware que exige autenticação via JWT próprio.
 * Extrai e valida o Bearer token do header Authorization.
 */
export const requireAuthentication = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Autenticação é obrigatória para acessar este recurso.',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token);

  if (!payload) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token inválido ou expirado.',
      },
    });
    return;
  }

  req.auth = payload;
  next();
};
