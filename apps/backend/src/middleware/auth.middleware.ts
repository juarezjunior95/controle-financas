import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '../config/jwt';

/**
 * Interface estendida do Request do Express para incluir os dados de autenticação.
 */
export interface AuthenticatedRequest extends Request {
  auth: JwtPayload;
}

/**
 * Middleware que exige autenticação via JWT customizado.
 * Retorna 401 se o token não for fornecido, for inválido ou estiver expirado.
 */
export const requireAuthentication = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
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
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token inválido ou expirado. Por favor, faça login novamente.',
      },
    });
    return;
  }

  // Adiciona o payload do JWT ao request para uso nos controllers
  (req as AuthenticatedRequest).auth = payload;
  
  next();
};

/**
 * Middleware placeholder para manter compatibilidade com o index.ts se necessário.
 * Não utiliza mais o Clerk diretamente.
 */
export const clerkAuth = (_req: Request, _res: Response, next: NextFunction) => next();
