import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';

const isClerkConfigured = !!process.env.CLERK_SECRET_KEY;

/**
 * Middleware global do Clerk.
 * Se Clerk não estiver configurado, passa direto (permite health check).
 */
export const clerkAuth = isClerkConfigured 
  ? clerkMiddleware()
  : (_req: Request, _res: Response, next: NextFunction) => next();

/**
 * Middleware que exige autenticação.
 * Retorna 401 se o usuário não estiver autenticado.
 * Retorna 503 se Clerk não estiver configurado.
 */
export const requireAuthentication = (req: Request, res: Response, next: NextFunction): void => {
  if (!isClerkConfigured) {
    res.status(503).json({
      error: {
        code: 'AUTH_NOT_CONFIGURED',
        message: 'Serviço de autenticação não configurado.',
      },
    });
    return;
  }

  const auth = getAuth(req);

  if (!auth?.userId) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Autenticação é obrigatória para acessar este recurso.',
      },
    });
    return;
  }

  next();
};
