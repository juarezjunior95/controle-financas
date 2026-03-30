import { prisma } from '../../config/prisma';

type TransactionType = 'income' | 'expense';

export interface CreateTransactionDto {
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface CreateTransactionInput {
  userId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  occurredOn: Date;
  description?: string;
}

interface UpdateTransactionInput {
  categoryId?: string;
  type?: TransactionType;
  amount?: number;
  occurredOn?: Date;
  description?: string | null;
}

interface TransactionFilters {
  userId: string;
  month?: number;
  year?: number;
  type?: TransactionType;
}

export class TransactionService {
  /**
   * Cria uma transação aceitando nome de categoria como string (upsert).
   * Usado pelo formulário de novo lançamento.
   */
  static async create(data: CreateTransactionDto) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: data.userId },
      });

      if (!user) {
        throw new Error('Usuário não sincronizado no banco local.');
      }

      const category = await prisma.category.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: data.category,
          },
        },
        update: {},
        create: {
          userId: user.id,
          name: data.category,
        },
      });

      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          type: data.type,
          amount: data.amount,
          occurredOn: new Date(data.date),
          description: data.description,
        },
        include: {
          category: true,
        },
      });

      console.log(`[TransactionService] Transação criada: ${transaction.id} para o usuário ${user.id}`);
      return transaction;
    } catch (error: any) {
      console.error('[TransactionService] Erro ao criar transação:', error);
      throw error;
    }
  }

  /**
   * Cria uma transação usando categoryId diretamente.
   * Usado pelo controller REST com validação de ownership.
   */
  static async createById(input: CreateTransactionInput) {
    try {
      const category = await prisma.category.findFirst({
        where: { id: input.categoryId, userId: input.userId },
      });

      if (!category) {
        throw new Error('Categoria não encontrada ou não pertence ao usuário.');
      }

      if (input.amount < 0) {
        throw new Error('O valor do lançamento deve ser maior ou igual a zero.');
      }

      return await prisma.transaction.create({
        data: {
          userId: input.userId,
          categoryId: input.categoryId,
          type: input.type,
          amount: input.amount,
          occurredOn: input.occurredOn,
          description: input.description,
        },
        include: {
          category: true,
        },
      });
    } catch (error: any) {
      if (
        error?.message === 'Categoria não encontrada ou não pertence ao usuário.' ||
        error?.message === 'O valor do lançamento deve ser maior ou igual a zero.'
      ) {
        throw error;
      }
      console.error('[TransactionService] Erro ao criar lançamento:', error);
      throw new Error('Falha ao criar lançamento.');
    }
  }

  /**
   * Lista transações de um usuário pelo clerkId (compatibilidade).
   */
  static async listByUser(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) return [];

    return await prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { occurredOn: 'desc' },
    });
  }

  static async findAllByUser(filters: TransactionFilters) {
    try {
      const where: any = { userId: filters.userId };

      if (filters.month && filters.year) {
        const startDate = new Date(filters.year, filters.month - 1, 1);
        const endDate = new Date(filters.year, filters.month, 0);
        where.occurredOn = {
          gte: startDate,
          lte: endDate,
        };
      }

      if (filters.type) {
        where.type = filters.type;
      }

      return await prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { occurredOn: 'desc' },
      });
    } catch (error) {
      console.error('[TransactionService] Erro ao listar lançamentos:', error);
      throw new Error('Falha ao listar lançamentos.');
    }
  }

  static async findById(id: string, userId: string) {
    try {
      return await prisma.transaction.findFirst({
        where: { id, userId },
        include: { category: true },
      });
    } catch (error) {
      console.error('[TransactionService] Erro ao buscar lançamento:', error);
      throw new Error('Falha ao buscar lançamento.');
    }
  }

  static async update(id: string, userId: string, input: UpdateTransactionInput) {
    try {
      const transaction = await this.findById(id, userId);
      if (!transaction) {
        throw new Error('Lançamento não encontrado.');
      }

      if (input.categoryId) {
        const category = await prisma.category.findFirst({
          where: { id: input.categoryId, userId },
        });
        if (!category) {
          throw new Error('Categoria não encontrada ou não pertence ao usuário.');
        }
      }

      if (input.amount !== undefined && input.amount < 0) {
        throw new Error('O valor do lançamento deve ser maior ou igual a zero.');
      }

      return await prisma.transaction.update({
        where: { id },
        data: input,
        include: { category: true },
      });
    } catch (error: any) {
      if (
        error?.message === 'Lançamento não encontrado.' ||
        error?.message === 'Categoria não encontrada ou não pertence ao usuário.' ||
        error?.message === 'O valor do lançamento deve ser maior ou igual a zero.'
      ) {
        throw error;
      }
      console.error('[TransactionService] Erro ao atualizar lançamento:', error);
      throw new Error('Falha ao atualizar lançamento.');
    }
  }

  static async delete(id: string, userId: string) {
    try {
      const transaction = await this.findById(id, userId);
      if (!transaction) {
        throw new Error('Lançamento não encontrado.');
      }

      return await prisma.transaction.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error?.message === 'Lançamento não encontrado.') {
        throw error;
      }
      console.error('[TransactionService] Erro ao excluir lançamento:', error);
      throw new Error('Falha ao excluir lançamento.');
    }
  }

  static async getMonthlySummary(userId: string, month: number, year: number) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          occurredOn: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: { category: true },
      });

      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const balance = income - expense;

      const byCategory = transactions.reduce((acc, t) => {
        const categoryName = t.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
          acc[categoryName].income += Number(t.amount);
        } else {
          acc[categoryName].expense += Number(t.amount);
        }
        return acc;
      }, {} as Record<string, { income: number; expense: number }>);

      return {
        month,
        year,
        income,
        expense,
        balance,
        byCategory,
        transactionCount: transactions.length,
      };
    } catch (error) {
      console.error('[TransactionService] Erro ao calcular resumo mensal:', error);
      throw new Error('Falha ao calcular resumo mensal.');
    }
  }
}
