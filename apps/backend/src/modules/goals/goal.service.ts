import { prisma } from '../../config/prisma';

export interface CreateGoalDto {
  userId: string; // clerkId
  title: string;
  targetAmount: number;
  deadline?: string;
  icon?: string;
  color?: string;
}

export interface UpdateGoalDto {
  title?: string;
  targetAmount?: number;
  deadline?: string;
  status?: string;
  icon?: string;
  color?: string;
}

export class GoalService {
  /**
   * Cria uma nova meta financeira
   */
  static async create(data: CreateGoalDto) {
    const user = await prisma.user.findUnique({
      where: { clerkId: data.userId },
    });

    if (!user) throw new Error('Usuário não encontrado.');

    return await prisma.goal.create({
      data: {
        userId: user.id,
        title: data.title,
        targetAmount: data.targetAmount,
        deadline: data.deadline ? new Date(data.deadline) : null,
        status: 'active',
        icon: data.icon || 'savings',
        color: data.color || '#b0c6ff',
      },
    });
  }

  /**
   * Lista as metas de um usuário com filtros e paginação
   */
  static async listByUser(userId: string, filters: { status?: string; limit?: number; offset?: number }) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return [];

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        ...(filters.status && { status: filters.status }),
      },
      take: filters.limit ? Number(filters.limit) : undefined,
      skip: filters.offset ? Number(filters.offset) : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return goals.map(goal => ({
      ...goal,
      progress: this.calculateProgress(Number(goal.currentAmount), Number(goal.targetAmount)),
    }));
  }

  /**
   * Busca uma meta específica por ID
   */
  static async getById(userId: string, id: string) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não encontrado.');

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== user.id) {
      throw new Error('Meta não encontrada.');
    }

    return {
      ...goal,
      progress: this.calculateProgress(Number(goal.currentAmount), Number(goal.targetAmount)),
    };
  }

  /**
   * Atualiza os dados de uma meta
   */
  static async update(userId: string, id: string, data: UpdateGoalDto) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não encontrado.');

    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== user.id) throw new Error('Meta não encontrada.');

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.targetAmount && { targetAmount: data.targetAmount }),
        ...(data.deadline && { deadline: new Date(data.deadline) }),
        ...(data.status && { status: data.status }),
        ...(data.icon && { icon: data.icon }),
        ...(data.color && { color: data.color }),
      },
    });

    // Se o valor de destino mudou, revalida o status
    if (data.targetAmount) {
      const current = Number(updated.currentAmount);
      const target = Number(updated.targetAmount);
      const newStatus = current >= target ? 'completed' : 'active';
      if (newStatus !== updated.status) {
        return await prisma.goal.update({
          where: { id },
          data: { status: newStatus },
        });
      }
    }

    return updated;
  }

  /**
   * Remove uma meta (Hard delete para manter consistência com o projeto)
   */
  static async delete(userId: string, id: string) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não encontrado.');

    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== user.id) throw new Error('Meta não encontrada.');

    await prisma.goal.delete({ where: { id } });
    return { id };
  }

  /**
   * Atualiza o progresso da meta (soma ou subtrai valor)
   */
  static async updateProgress(userId: string, id: string, amount: number) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não encontrado.');

    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== user.id) throw new Error('Meta não encontrada.');

    let newAmount = Number(goal.currentAmount) + amount;

    if (newAmount < 0) {
      throw new Error('O saldo da meta não pode ser negativo.');
    }

    // Define comportamento: current_amount nunca pode ser maior que target_amount
    const target = Number(goal.targetAmount);
    if (newAmount > target) {
      newAmount = target;
    }

    const status = newAmount >= target ? 'completed' : 'active';

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        status,
      },
    });

    return {
      ...updated,
      progress: this.calculateProgress(newAmount, Number(goal.targetAmount)),
    };
  }

  /**
   * Helper para calcular o progresso
   */
  private static calculateProgress(current: number, target: number): number {
    if (target <= 0) return 0;
    const progress = (current / target) * 100;
    return Number(progress.toFixed(1));
  }
}
