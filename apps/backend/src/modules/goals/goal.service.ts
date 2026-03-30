import { prisma } from '../../config/prisma';

type GoalStatus = 'active' | 'completed' | 'archived';

interface CreateGoalInput {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount?: number;
  dueDate?: Date | null;
}

interface UpdateGoalInput {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  dueDate?: Date | null;
  status?: GoalStatus;
}

export class GoalService {
  static async create(input: CreateGoalInput) {
    try {
      if (input.targetAmount <= 0) {
        throw new Error('O valor alvo deve ser maior que zero.');
      }

      if (input.currentAmount !== undefined && input.currentAmount < 0) {
        throw new Error('O valor atual não pode ser negativo.');
      }

      return await prisma.goal.create({
        data: {
          userId: input.userId,
          name: input.name,
          targetAmount: input.targetAmount,
          currentAmount: input.currentAmount ?? 0,
          dueDate: input.dueDate,
          status: 'active',
        },
      });
    } catch (error: any) {
      if (
        error?.message === 'O valor alvo deve ser maior que zero.' ||
        error?.message === 'O valor atual não pode ser negativo.'
      ) {
        throw error;
      }
      console.error('[GoalService] Erro ao criar meta:', error);
      throw new Error('Falha ao criar meta.');
    }
  }

  static async findAllByUser(userId: string, status?: GoalStatus) {
    try {
      const where: any = { userId };
      if (status) {
        where.status = status;
      }

      return await prisma.goal.findMany({
        where,
        orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
      });
    } catch (error) {
      console.error('[GoalService] Erro ao listar metas:', error);
      throw new Error('Falha ao listar metas.');
    }
  }

  static async findById(id: string, userId: string) {
    try {
      return await prisma.goal.findFirst({
        where: { id, userId },
      });
    } catch (error) {
      console.error('[GoalService] Erro ao buscar meta:', error);
      throw new Error('Falha ao buscar meta.');
    }
  }

  static async update(id: string, userId: string, input: UpdateGoalInput) {
    try {
      const goal = await this.findById(id, userId);
      if (!goal) {
        throw new Error('Meta não encontrada.');
      }

      if (input.targetAmount !== undefined && input.targetAmount <= 0) {
        throw new Error('O valor alvo deve ser maior que zero.');
      }

      if (input.currentAmount !== undefined && input.currentAmount < 0) {
        throw new Error('O valor atual não pode ser negativo.');
      }

      // Auto-completar se currentAmount >= targetAmount
      const newCurrentAmount = input.currentAmount ?? Number(goal.currentAmount);
      const newTargetAmount = input.targetAmount ?? Number(goal.targetAmount);

      let newStatus = input.status ?? goal.status;
      if (newCurrentAmount >= newTargetAmount && newStatus === 'active') {
        newStatus = 'completed';
      }

      return await prisma.goal.update({
        where: { id },
        data: {
          ...input,
          status: newStatus,
        },
      });
    } catch (error: any) {
      if (
        error?.message === 'Meta não encontrada.' ||
        error?.message === 'O valor alvo deve ser maior que zero.' ||
        error?.message === 'O valor atual não pode ser negativo.'
      ) {
        throw error;
      }
      console.error('[GoalService] Erro ao atualizar meta:', error);
      throw new Error('Falha ao atualizar meta.');
    }
  }

  static async delete(id: string, userId: string) {
    try {
      const goal = await this.findById(id, userId);
      if (!goal) {
        throw new Error('Meta não encontrada.');
      }

      return await prisma.goal.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error?.message === 'Meta não encontrada.') {
        throw error;
      }
      console.error('[GoalService] Erro ao excluir meta:', error);
      throw new Error('Falha ao excluir meta.');
    }
  }

  static async updateProgress(id: string, userId: string, amount: number) {
    try {
      const goal = await this.findById(id, userId);
      if (!goal) {
        throw new Error('Meta não encontrada.');
      }

      const newCurrentAmount = Number(goal.currentAmount) + amount;
      if (newCurrentAmount < 0) {
        throw new Error('O valor atual não pode ficar negativo.');
      }

      return await this.update(id, userId, { currentAmount: newCurrentAmount });
    } catch (error: any) {
      if (
        error?.message === 'Meta não encontrada.' ||
        error?.message === 'O valor atual não pode ficar negativo.'
      ) {
        throw error;
      }
      console.error('[GoalService] Erro ao atualizar progresso:', error);
      throw new Error('Falha ao atualizar progresso da meta.');
    }
  }

  static getProgressPercentage(currentAmount: number, targetAmount: number): number {
    if (targetAmount <= 0) return 0;
    const percentage = (currentAmount / targetAmount) * 100;
    return Math.min(100, Math.round(percentage * 100) / 100);
  }

  static getRemainingAmount(currentAmount: number, targetAmount: number): number {
    return Math.max(0, targetAmount - currentAmount);
  }
}
