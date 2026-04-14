import { Response } from 'express';
import { ClientService } from './client.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ClientController {
  /**
   * GET /api/v1/clients/me
   * Retorna o perfil do cliente autenticado.
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const cliente = await ClientService.getByClerkId(req.auth!.clerkId);

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
