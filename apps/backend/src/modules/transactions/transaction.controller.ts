import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { TransactionService } from './transaction.service';

export class TransactionController {
  /**
   * Endpoint: POST /api/v1/transactions
   */
  static async create(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      const clerkId = auth.userId;

      if (!clerkId) {
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
        userId: clerkId,
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
      console.error('[TransactionController] Erro no create:', error);
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
      const auth = getAuth(req);
      const clerkId = auth.userId;

      if (!clerkId) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      const transactions = await TransactionService.listByUser(clerkId);
      res.status(200).json({ data: transactions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
