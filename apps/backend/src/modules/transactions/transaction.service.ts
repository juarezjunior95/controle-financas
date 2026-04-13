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
   * Lista transações de um usuário.
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
}
