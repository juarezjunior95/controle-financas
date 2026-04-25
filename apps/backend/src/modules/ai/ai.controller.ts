import { Request, Response } from 'express';
import { AiService } from './ai.service';

export class AiController {
  static async getInsights(req: Request, res: Response) {
    try {
      const { userId } = (req as any).auth;
      if (!userId) {
        return res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' },
        });
      }

      const insights = await AiService.getFinancialInsights(userId);

      return res.status(200).json({
        message: 'Insights gerados com sucesso',
        data: insights,
      });
    } catch (error: any) {
      console.error('[AiController] Erro ao buscar insights:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Sincronize sua conta primeiro' },
        });
      }

      return res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'Erro ao processar insights de IA' },
      });
    }
  }
}
