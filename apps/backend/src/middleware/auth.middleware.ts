import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';

/**
 * Interface estendida do Request para incluir os dados do Clerk.
 */
export interface AuthenticatedRequest extends Request {
  auth: ReturnType<typeof getAuth>;
}

/**
 * Middleware que exige autenticação via Clerk.
 * Retorna 401 se o usuário não estiver autenticado.
 */
export const requireAuthentication = (req: Request, res: Response, next: NextFunction): void => {
  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Autenticação é obrigatória para acessar este recurso (Clerk).',
      },
    });
    return;
  }

  // Anexa o objeto de autenticação ao request para uso nos controllers
  // IMPORTANTE: Isso sobrescreve a função interna req.auth do Clerk.
  // Use (req as any).auth nos controllers em vez de getAuth(req) para evitar conflitos.
  (req as AuthenticatedRequest).auth = auth;

  next();
};

/**
 * Middleware global do Clerk que injeta o estado de autenticação no Request.
 */
export const clerkAuth = clerkMiddleware();
