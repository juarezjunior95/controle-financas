import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';

/**
 * Middleware global do Clerk.
 * Deve ser registrado ANTES de qualquer outro middleware de rota.
 * Anexa o objeto `auth` ao request para todas as rotas.
 */
export const clerkAuth = clerkMiddleware();

/**
 * Middleware que exige autenticação.
 * Retorna 401 se o usuário não estiver autenticado.
 * Usado em rotas protegidas (CRUD de recursos).
 */
export const requireAuthentication = (req: Request, res: Response, next: NextFunction): void => {
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
