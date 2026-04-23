import { Request, Response } from 'express';
import { GoalService } from './goal.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class GoalController {
  /**
   * Endpoint: POST /api/v1/goals
   * Cria uma nova meta financeira
   */
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Autenticação obrigatória.' });
      }

      const { title, target_amount, deadline, icon, color } = req.body;
      console.log('[GoalController] Dados recebidos:', { title, target_amount, icon, color });

      // Validações básicas
      if (!title || title.trim().length < 3 || title.trim().length > 100) {
        return res.status(400).json({ 
          error: 'ValidationError', 
          message: 'O título é obrigatório e deve ter entre 3 e 100 caracteres.' 
        });
      }

      if (!target_amount || Number(target_amount) <= 0) {
        return res.status(400).json({ 
          error: 'ValidationError', 
          message: 'O campo target_amount deve ser um número positivo.' 
        });
      }

      if (deadline && new Date(deadline).toString() === 'Invalid Date') {
        return res.status(400).json({ 
          error: 'ValidationError', 
          message: 'A data de deadline fornecida é inválida.' 
        });
      }

      const goal = await GoalService.create({
        userId,
        title: title.trim(),
        targetAmount: Number(target_amount),
        deadline,
        icon,
        color
      });

      res.status(201).json({
        data: { id: goal.id },
        message: 'Meta criada com sucesso'
      });
    } catch (error: any) {
      console.error('[GoalController] Erro no create:', error);
      res.status(500).json({ error: 'InternalError', message: 'Falha ao criar meta.' });
    }
  }

  /**
   * Endpoint: GET /api/v1/goals
   * Lista as metas do usuário logado
   */
  static async list(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { status, limit, offset } = req.query;

      const goals = await GoalService.listByUser(userId, {
        status: status as string,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined
      });

      // Mapeamento para garantir snake_case conforme requisitos
      const mappedGoals = goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        target_amount: Number(goal.targetAmount),
        current_amount: Number(goal.currentAmount),
        progress: goal.progress,
        status: goal.status,
        deadline: goal.deadline,
        icon: goal.icon,
        color: goal.color
      }));

      res.status(200).json({ data: mappedGoals });
    } catch (error: any) {
      console.error('[GoalController] Erro no list:', error);
      res.status(500).json({ error: 'InternalError', message: error.message });
    }
  }

  /**
   * Endpoint: GET /api/v1/goals/:id
   * Busca detalhes de uma meta específica
   */
  static async getById(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      const { id } = req.params;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const goal = await GoalService.getById(userId, id);

      res.status(200).json({
        data: {
          id: goal.id,
          title: goal.title,
          target_amount: Number(goal.targetAmount),
          current_amount: Number(goal.currentAmount),
          deadline: goal.deadline,
          status: goal.status,
          icon: goal.icon,
          color: goal.color
        }
      });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: 'NotFound', message: error.message });
      }
      res.status(500).json({ error: 'InternalError', message: error.message });
    }
  }

  /**
   * Endpoint: PUT /api/v1/goals/:id
   * Atualiza dados de uma meta (total ou parcial)
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      const { id } = req.params;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { title, target_amount, deadline, status, icon, color } = req.body;

      const updated = await GoalService.update(userId, id, {
        title,
        targetAmount: target_amount ? Number(target_amount) : undefined,
        deadline,
        status,
        icon,
        color
      });

      res.status(200).json({
        message: 'Meta atualizada com sucesso',
        data: {
          id: updated.id,
          title: updated.title,
          target_amount: Number(updated.targetAmount),
          status: updated.status
        }
      });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: 'NotFound', message: error.message });
      }
      res.status(500).json({ error: 'InternalError', message: error.message });
    }
  }

  /**
   * Endpoint: DELETE /api/v1/goals/:id
   * Remove uma meta
   */
  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      const { id } = req.params;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await GoalService.delete(userId, id);
      res.status(200).json({ message: 'Meta removida com sucesso' });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: 'NotFound', message: error.message });
      }
      res.status(500).json({ error: 'InternalError', message: error.message });
    }
  }

  /**
   * Endpoint: PATCH /api/v1/goals/:id/progress
   * Incrementa ou decrementa o valor atual da meta
   */
  static async updateProgress(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      const { id } = req.params;
      const { amount, mode } = req.body;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (amount === undefined || typeof amount !== 'number') {
        return res.status(400).json({ 
          error: 'ValidationError', 
          message: 'O campo "amount" deve ser um número.' 
        });
      }

      const updateMode = mode === 'set' ? 'set' : 'increment';
      const updated = await GoalService.updateProgress(userId, id, amount, updateMode);

      res.status(200).json({
        message: 'Progresso atualizado com sucesso',
        data: {
          current_amount: Number(updated.currentAmount),
          progress: updated.progress,
          status: updated.status
        }
      });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: 'NotFound', message: error.message });
      }
      if (error.message.includes('negativo')) {
        return res.status(400).json({ error: 'ValidationError', message: error.message });
      }
      res.status(500).json({ error: 'InternalError', message: error.message });
    }
  }
}
