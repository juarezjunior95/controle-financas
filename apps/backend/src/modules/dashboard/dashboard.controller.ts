import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  /**
   * Endpoint GET /api/v1/dashboard/summary
   */
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      // O clerkId é injetado pelo middleware de autenticação (auth.middleware)
      const clerkId = (req as any).auth?.userId;

      if (!clerkId) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Usuário não autenticado.',
          },
        });
      }

      const { month, year } = req.query;

      const summary = await DashboardService.getSummary(clerkId, {
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
      });

      return res.status(200).json({ data: summary });
    } catch (error: any) {
      console.error('[DashboardController] Erro no endpoint summary:', error);
      
      // Encaminha para o error handler global
      next(error);
    }
  }
}
