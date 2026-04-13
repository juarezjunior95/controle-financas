import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { ClientService } from '../clients/client.service';
import { TransactionService } from './transaction.service';

export class TransactionController {
  /**
   * GET /api/v1/transactions
   * Lista transações do usuário autenticado, com filtros opcionais de mês/ano/tipo.
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth?.userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const user = await ClientService.getByClerkId(auth.userId);
      if (!user) {
        res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' } });
        return;
      }

      const month = req.query.month ? parseInt(req.query.month as string) : undefined;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const type = req.query.type as 'income' | 'expense' | undefined;

      const transactions = await TransactionService.findAllByUser({
        userId: user.id,
        month,
        year,
        type,
      });

      res.json({ data: transactions });
    } catch (error) {
      console.error('[TransactionController] Erro ao listar:', error);
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao listar transações.' } });
    }
  }

  /**
   * POST /api/v1/transactions
   * Cria uma nova transação. Aceita `category` (nome) com upsert automático de categoria.
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth?.userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Autenticação obrigatória.' } });
        return;
      }

      const { type, amount, description, date, category } = req.body;

      if (!type || amount === undefined || !date || !category) {
        res.status(400).json({
          error: { code: 'BAD_REQUEST', message: 'Campos obrigatórios: type, amount, date, category.' },
        });
        return;
      }

      if (type !== 'income' && type !== 'expense') {
        res.status(400).json({
          error: { code: 'BAD_REQUEST', message: "O campo 'type' deve ser 'income' ou 'expense'." },
        });
        return;
      }

      const transaction = await TransactionService.create({
        userId: auth.userId,
        type,
        amount: Number(amount),
        description: description || '',
        date,
        category,
      });

      res.status(201).json({ data: transaction, message: 'Transação criada com sucesso.' });
    } catch (error: any) {
      console.error('[TransactionController] Erro ao criar:', error);
      res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Falha ao processar transação.', details: error.message },
      });
    }
  }

  /**
   * GET /api/v1/transactions/:id
   * Busca uma transação específica do usuário autenticado.
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth?.userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const user = await ClientService.getByClerkId(auth.userId);
      if (!user) {
        res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' } });
        return;
      }

      const transaction = await TransactionService.findById(req.params.id, user.id);
      if (!transaction) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Transação não encontrada.' } });
        return;
      }

      res.json({ data: transaction });
    } catch (error) {
      console.error('[TransactionController] Erro ao buscar:', error);
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao buscar transação.' } });
    }
  }

  /**
   * PUT /api/v1/transactions/:id
   * Atualiza uma transação do usuário autenticado.
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth?.userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const user = await ClientService.getByClerkId(auth.userId);
      if (!user) {
        res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' } });
        return;
      }

      const { categoryId, type, amount, occurredOn, description } = req.body;

      const updated = await TransactionService.update(req.params.id, user.id, {
        categoryId,
        type,
        amount: amount !== undefined ? Number(amount) : undefined,
        occurredOn: occurredOn ? new Date(occurredOn) : undefined,
        description,
      });

      res.json({ data: updated });
    } catch (error: any) {
      if (
        error?.message === 'Lançamento não encontrado.' ||
        error?.message === 'Categoria não encontrada ou não pertence ao usuário.' ||
        error?.message === 'O valor do lançamento deve ser maior ou igual a zero.'
      ) {
        const status = error.message === 'Lançamento não encontrado.' ? 404 : 422;
        res.status(status).json({ error: { code: 'VALIDATION_ERROR', message: error.message } });
        return;
      }
      console.error('[TransactionController] Erro ao atualizar:', error);
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao atualizar transação.' } });
    }
  }

  /**
   * DELETE /api/v1/transactions/:id
   * Remove uma transação do usuário autenticado.
   */
  static async remove(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth?.userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const user = await ClientService.getByClerkId(auth.userId);
      if (!user) {
        res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' } });
        return;
      }

      await TransactionService.delete(req.params.id, user.id);
      res.status(204).send();
    } catch (error: any) {
      if (error?.message === 'Lançamento não encontrado.') {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: error.message } });
        return;
      }
      console.error('[TransactionController] Erro ao excluir:', error);
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao excluir transação.' } });
    }
  }

  /**
   * GET /api/v1/transactions/summary
   * Retorna o resumo mensal (totais de receita, despesa e balanço).
   */
  static async summary(req: Request, res: Response): Promise<void> {
    try {
      const auth = getAuth(req);
      if (!auth?.userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const user = await ClientService.getByClerkId(auth.userId);
      if (!user) {
        res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' } });
        return;
      }

      const now = new Date();
      const month = req.query.month ? parseInt(req.query.month as string) : now.getMonth() + 1;
      const year = req.query.year ? parseInt(req.query.year as string) : now.getFullYear();

      const summaryData = await TransactionService.getMonthlySummary(user.id, month, year);
      res.json({ data: summaryData });
    } catch (error) {
      console.error('[TransactionController] Erro ao calcular resumo:', error);
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao calcular resumo.' } });
    }
  }
}
