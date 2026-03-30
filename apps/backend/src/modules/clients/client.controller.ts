import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { ClientService } from './client.service';

export class ClientController {
  /**
   * GET /api/v1/clients/me
   * Retorna o perfil do cliente autenticado.
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);

      if (!auth?.userId) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' },
        });
        return;
      }

      const cliente = await ClientService.getByClerkId(auth.userId);

      if (!cliente) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Perfil do cliente não encontrado.' },
        });
        return;
      }

      res.json({ data: cliente });
    } catch (error) {
      console.error('[ClientController] Erro ao buscar perfil:', error);
      res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao buscar perfil.' },
      });
    }
  }
}
