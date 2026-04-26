import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class CategoryController {
  /**
   * Endpoint: POST /api/v1/categories
   */
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;

      if (!userId) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Autenticação obrigatória.',
          },
        });
        return;
      }

      const { name, color, icon } = req.body;

      if (!name || name.trim() === '') {
        res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: 'O campo "name" é obrigatório.',
          },
        });
        return;
      }

      const category = await CategoryService.create({
        userId,
        name: name.trim(),
        ...(color && { color }),
        ...(icon && { icon }),
      });

      res.status(201).json({
        data: category,
        message: 'Categoria criada com sucesso.',
      });
    } catch (error: any) {
      console.error('[CategoryController] Erro no create:', error);
      
      // Checar erro de duplicidade
      if (error.message === 'Já existe uma categoria com este nome.') {
        res.status(409).json({
          error: {
            code: 'CONFLICT',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Falha ao processar categoria.',
          details: error.message,
        },
      });
    }
  }

  /**
   * Endpoint: GET /api/v1/categories
   */
  static async list(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      const categories = await CategoryService.listByUser(userId);

      res.status(200).json({ data: categories });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Endpoint: PUT /api/v1/categories/:id
   */
  static async update(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      const { name, color, icon } = req.body;

      if (!name && !color && !icon) {
        res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: 'Pelo menos um campo (name, color, icon) é obrigatório para atualização.',
          },
        });
        return;
      }

      const updateData: { name?: string; color?: string; icon?: string } = {};
      if (name && name.trim() !== '') updateData.name = name.trim();
      if (color) updateData.color = color;
      if (icon) updateData.icon = icon;

      const category = await CategoryService.update(userId, id, updateData);
      
      res.status(200).json({ data: category, message: 'Categoria atualizada.' });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: error.message } });
        return;
      }
      if (error.message.includes('sistema não podem ser')) {
        res.status(403).json({ error: { code: 'FORBIDDEN', message: error.message } });
        return;
      }
      res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: error.message } });
    }
  }

  /**
   * Endpoint: DELETE /api/v1/categories/:id
   */
  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      await CategoryService.delete(userId, id);
      res.status(200).json({ message: 'Categoria excluída com sucesso.' });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: error.message } });
        return;
      }
      if (error.message.includes('sistema não podem ser')) {
        res.status(403).json({ error: { code: 'FORBIDDEN', message: error.message } });
        return;
      }
      if (error.message.includes('transações vinculadas')) {
        res.status(400).json({ error: { code: 'BAD_REQUEST', message: error.message } });
        return;
      }
      // Outros erros como violação de constraint genérica
      res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: error.message } });
    }
  }

  /**
   * Endpoint: GET /api/v1/categories/stats
   */
  static async listWithStats(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      const { month, year } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      const stats = await CategoryService.listWithStats(
        userId,
        month ? Number(month) : undefined,
        year ? Number(year) : undefined
      );

      res.status(200).json({ data: stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
