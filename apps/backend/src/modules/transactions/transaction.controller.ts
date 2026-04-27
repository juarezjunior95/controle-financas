import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class TransactionController {
  /**
   * Endpoint: POST /api/v1/transactions
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

      const { type, amount, description, date, category } = req.body;

      // Validação básica
      if (!type || amount === undefined || !date || !category) {
        res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: 'Campos obrigatórios: type, amount, date, category.',
          },
        });
        return;
      }

      // Validar tipo
      if (type !== 'income' && type !== 'expense') {
        res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: "O campo 'type' deve ser 'income' ou 'expense'.",
          },
        });
        return;
      }

      const transaction = await TransactionService.create({
        userId: userId,
        type,
        amount: Number(amount),
        description: description || '',
        date,
        category,
      });

      res.status(201).json({
        data: transaction,
        message: 'Transação criada com sucesso.',
      });
    } catch (error: any) {
      (req as any).log.error({ err: error }, '[TransactionController] Erro no create');
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Falha ao processar transação.',
          details: error.message,
        },
      });
    }
  }

  /**
   * Endpoint: GET /api/v1/transactions
   */
  static async list(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      const { month, year, type, categoryId } = req.query;

      const transactions = await TransactionService.listByUser(userId, {
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
        type: type as 'income' | 'expense' | undefined,
        categoryId: categoryId as string | undefined,
      });

      res.status(200).json({ data: transactions });
    } catch (error: any) {
      (req as any).log.error({ err: error }, '[TransactionController] Erro no list');
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Endpoint: PUT /api/v1/transactions/:id
   */
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      const transaction = await TransactionService.update(userId, id, req.body);
      res.status(200).json({ data: transaction, message: 'Transação atualizada.' });
    } catch (error: any) {
      (req as any).log.error({ err: error, transactionId: id }, '[TransactionController] Erro no update');
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Endpoint: DELETE /api/v1/transactions/:id
   */
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      await TransactionService.delete(userId, id);
      res.status(200).json({ message: 'Transação excluída com sucesso.' });
    } catch (error: any) {
      (req as any).log.error({ err: error, transactionId: id }, '[TransactionController] Erro no delete');
      res.status(500).json({ error: error.message });
    }
  }
}
