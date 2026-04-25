import { prisma } from '../../config/prisma';

export interface CreateTransactionDto {
  userId: string; // clerkId from auth middleware
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string; // ISO string or YYYY-MM-DD
  category: string; // Category name
}

export class TransactionService {
  /**
   * Cria uma nova transação associada a uma categoria (existente ou nova).
   */
  static async create(data: CreateTransactionDto) {
    try {
      // 1. Encontrar o usuário local pelo clerkId
      const user = await prisma.user.findUnique({
        where: { clerkId: data.userId },
      });

      if (!user) {
        throw new Error('Usuário não sincronizado no banco local.');
      }

      // 2. Encontrar ou criar a categoria para este usuário
      // O Prisma vai garantir a unicidade pelo composite key [userId, name]
      const category = await prisma.category.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: data.category,
          },
        },
        update: {}, // Não altera nada se já existir
        create: {
          userId: user.id,
          name: data.category,
        },
      });

      // 3. Criar a transação
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
   * Lista transações de um usuário com filtros opcionais.
   */
  static async listByUser(userId: string, filters?: { month?: number; year?: number; type?: 'income' | 'expense' }) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return [];

    const where: any = { userId: user.id };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.month !== undefined && filters?.year !== undefined) {
      const monthIndex = filters.month - 1;
      const startDate = new Date(filters.year, monthIndex, 1);
      const endDate = new Date(filters.year, monthIndex + 1, 0, 23, 59, 59);
      
      where.occurredOn = {
        gte: startDate,
        lte: endDate,
      };
    }

    return await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { occurredOn: 'desc' },
    });
  }

  /**
   * Atualiza uma transação existente.
   */
  static async update(userId: string, id: string, data: Partial<CreateTransactionDto>) {
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não sincronizado.');

    // 2. Se a categoria mudar, fazer o upsert dela
    let categoryId = undefined;
    if (data.category) {
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
      categoryId = category.id;
    }

    // 3. Atualizar a transação
    // Usamos updateMany para garantir que a transação pertence ao usuário (id + userId)
    // já que o Prisma 'update' só aceita campos únicos no 'where'.
    const result = await prisma.transaction.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        occurredOn: data.date ? new Date(data.date) : undefined,
        categoryId: categoryId,
      },
    });

    if (result.count === 0) {
      throw new Error('Transação não encontrada ou permissão negada.');
    }

    // Retornamos a transação atualizada
    return await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  /**
   * Remove uma transação.
   */
  static async delete(userId: string, id: string) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não sincronizado.');

    const result = await prisma.transaction.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      throw new Error('Transação não encontrada ou permissão negada.');
    }

    return { id };
  }
}
