import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  /**
   * GET /api/v1/dashboard/summary
   * Retorna os dados resumidos do dashboard para o usuário autenticado
   */
  static async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);

      if (!auth?.userId) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' },
        });
        return;
      }

      const summary = await DashboardService.getSummary(auth.userId);

      res.json({ data: summary });
    } catch (error: any) {
      console.error('[DashboardController] Erro ao buscar resumo:', error);
      res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: error.message || 'Erro interno ao buscar resumo do dashboard.' },
      });
    }
  }
}
