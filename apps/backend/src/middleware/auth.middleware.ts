import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { ClientService } from '../modules/clients/client.service';

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
export const requireAuthentication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  (req as AuthenticatedRequest).auth = auth;

  // Garantir que o usuário exista no banco local: sincroniza do Clerk via upsert.
  try {
    await ClientService.syncFromClerk(auth.userId);
  } catch (err) {
    // Se falhar por problemas de DB/Clerk, encaminha o erro ao handler global
    return next(err);
  }

  next();
};

/**
 * Middleware global do Clerk que injeta o estado de autenticação no Request.
 */
export const clerkAuth = clerkMiddleware();
