import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Registra um novo usuário.
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'E-mail e senha são obrigatórios.',
          },
        });
        return;
      }

      const result = await AuthService.signUp({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({ data: result });
    } catch (error: any) {
      console.error('[AuthController] Erro no registro:', error);
      res.status(400).json({
        error: {
          code: 'REGISTRATION_FAILED',
          message: error.message || 'Falha no registro.',
        },
      });
    }
  }

  /**
   * POST /api/v1/auth/login
   * Autentica um usuário existente.
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'E-mail e senha são obrigatórios.',
          },
        });
        return;
      }

      const result = await AuthService.signIn({ email, password });

      res.json({ data: result });
    } catch (error: any) {
      console.error('[AuthController] Erro no login:', error);

      const status = error.message === 'Credenciais inválidas.' ? 401 : 400;

      res.status(status).json({
        error: {
          code: 'AUTH_FAILED',
          message: error.message || 'Falha na autenticação.',
        },
      });
    }
  }

  /**
   * GET /api/v1/auth/me
   * Retorna os dados do usuário autenticado.
   * Requer token Bearer válido.
   */
  static async me(req: Request, res: Response): Promise<void> {
    try {
      const clerkId = (req as AuthenticatedRequest).auth?.clerkId;

      if (!clerkId) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token de autenticação inválido ou ausente.',
          },
        });
        return;
      }

      const user = await AuthService.getMe(clerkId);

      res.json({ data: user });
    } catch (error: any) {
      console.error('[AuthController] Erro ao buscar perfil:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Erro interno.',
        },
      });
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   * Solicita recuperação de senha.
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'E-mail é obrigatório.',
          },
        });
        return;
      }

      await AuthService.forgotPassword(email);

      // Sempre retorna sucesso por segurança (não revela se email existe)
      res.json({
        data: {
          message: 'Se o email existir em nossa base, você receberá um link para redefinir sua senha.',
        },
      });
    } catch (error: any) {
      console.error('[AuthController] Erro na recuperação de senha:', error);
      // Mesmo em caso de erro, retornamos sucesso por segurança
      res.json({
        data: {
          message: 'Se o email existir em nossa base, você receberá um link para redefinir sua senha.',
        },
      });
    }
  }
}
