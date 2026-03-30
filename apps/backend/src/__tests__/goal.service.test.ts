import { GoalService } from '../modules/goals/goal.service';
import { prisma } from '../config/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('GoalService', () => {
  const mockGoal = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Viagem de férias',
    targetAmount: 5000,
    currentAmount: 1500,
    dueDate: new Date('2026-12-31'),
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('deve criar uma nova meta', async () => {
      (mockPrisma.goal.create as jest.Mock).mockResolvedValue(mockGoal);

      const result = await GoalService.create({
        userId: mockGoal.userId,
        name: 'Viagem de férias',
        targetAmount: 5000,
        currentAmount: 1500,
        dueDate: new Date('2026-12-31'),
      });

      expect(mockPrisma.goal.create).toHaveBeenCalledWith({
        data: {
          userId: mockGoal.userId,
          name: 'Viagem de férias',
          targetAmount: 5000,
          currentAmount: 1500,
          dueDate: new Date('2026-12-31'),
          status: 'active',
        },
      });
      expect(result).toEqual(mockGoal);
    });

    it('deve criar meta com currentAmount padrão 0', async () => {
      const goalWithZero = { ...mockGoal, currentAmount: 0 };
      (mockPrisma.goal.create as jest.Mock).mockResolvedValue(goalWithZero);

      await GoalService.create({
        userId: mockGoal.userId,
        name: 'Nova meta',
        targetAmount: 1000,
      });

      const call = (mockPrisma.goal.create as jest.Mock).mock.calls[0][0];
      expect(call.data.currentAmount).toBe(0);
    });

    it('deve lançar erro quando targetAmount é zero ou negativo', async () => {
      await expect(
        GoalService.create({
          userId: mockGoal.userId,
          name: 'Meta inválida',
          targetAmount: 0,
        })
      ).rejects.toThrow('O valor alvo deve ser maior que zero.');

      await expect(
        GoalService.create({
          userId: mockGoal.userId,
          name: 'Meta inválida',
          targetAmount: -100,
        })
      ).rejects.toThrow('O valor alvo deve ser maior que zero.');
    });

    it('deve lançar erro quando currentAmount é negativo', async () => {
      await expect(
        GoalService.create({
          userId: mockGoal.userId,
          name: 'Meta inválida',
          targetAmount: 1000,
          currentAmount: -50,
        })
      ).rejects.toThrow('O valor atual não pode ser negativo.');
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar todas as metas do usuário', async () => {
      const goals = [mockGoal, { ...mockGoal, id: '2', name: 'Outra meta' }];
      (mockPrisma.goal.findMany as jest.Mock).mockResolvedValue(goals);

      const result = await GoalService.findAllByUser(mockGoal.userId);

      expect(mockPrisma.goal.findMany).toHaveBeenCalledWith({
        where: { userId: mockGoal.userId },
        orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
      });
      expect(result).toHaveLength(2);
    });

    it('deve filtrar por status', async () => {
      (mockPrisma.goal.findMany as jest.Mock).mockResolvedValue([mockGoal]);

      await GoalService.findAllByUser(mockGoal.userId, 'active');

      const call = (mockPrisma.goal.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.status).toBe('active');
    });
  });

  describe('update', () => {
    it('deve atualizar a meta', async () => {
      const updatedGoal = { ...mockGoal, currentAmount: 2000 };
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(mockGoal);
      (mockPrisma.goal.update as jest.Mock).mockResolvedValue(updatedGoal);

      const result = await GoalService.update(mockGoal.id, mockGoal.userId, {
        currentAmount: 2000,
      });

      expect(result.currentAmount).toBe(2000);
    });

    it('deve auto-completar quando currentAmount >= targetAmount', async () => {
      const completedGoal = { ...mockGoal, currentAmount: 5000, status: 'completed' };
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(mockGoal);
      (mockPrisma.goal.update as jest.Mock).mockResolvedValue(completedGoal);

      await GoalService.update(mockGoal.id, mockGoal.userId, {
        currentAmount: 5000,
      });

      const call = (mockPrisma.goal.update as jest.Mock).mock.calls[0][0];
      expect(call.data.status).toBe('completed');
    });

    it('deve lançar erro quando meta não encontrada', async () => {
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        GoalService.update('nonexistent', mockGoal.userId, { currentAmount: 2000 })
      ).rejects.toThrow('Meta não encontrada.');
    });

    it('deve validar targetAmount ao atualizar', async () => {
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(mockGoal);

      await expect(
        GoalService.update(mockGoal.id, mockGoal.userId, { targetAmount: 0 })
      ).rejects.toThrow('O valor alvo deve ser maior que zero.');
    });
  });

  describe('delete', () => {
    it('deve excluir a meta', async () => {
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(mockGoal);
      (mockPrisma.goal.delete as jest.Mock).mockResolvedValue(mockGoal);

      const result = await GoalService.delete(mockGoal.id, mockGoal.userId);

      expect(mockPrisma.goal.delete).toHaveBeenCalledWith({
        where: { id: mockGoal.id },
      });
      expect(result).toEqual(mockGoal);
    });

    it('deve lançar erro quando meta não encontrada', async () => {
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(GoalService.delete('nonexistent', mockGoal.userId)).rejects.toThrow(
        'Meta não encontrada.'
      );
    });
  });

  describe('updateProgress', () => {
    it('deve incrementar o progresso', async () => {
      const updatedGoal = { ...mockGoal, currentAmount: 2000 };
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(mockGoal);
      (mockPrisma.goal.update as jest.Mock).mockResolvedValue(updatedGoal);

      const result = await GoalService.updateProgress(mockGoal.id, mockGoal.userId, 500);

      expect(result.currentAmount).toBe(2000);
    });

    it('deve lançar erro se o resultado ficar negativo', async () => {
      (mockPrisma.goal.findFirst as jest.Mock).mockResolvedValue(mockGoal);

      await expect(
        GoalService.updateProgress(mockGoal.id, mockGoal.userId, -2000)
      ).rejects.toThrow('O valor atual não pode ficar negativo.');
    });
  });

  describe('getProgressPercentage', () => {
    it('deve calcular porcentagem corretamente', () => {
      expect(GoalService.getProgressPercentage(1500, 5000)).toBe(30);
      expect(GoalService.getProgressPercentage(2500, 5000)).toBe(50);
      expect(GoalService.getProgressPercentage(5000, 5000)).toBe(100);
    });

    it('deve limitar em 100%', () => {
      expect(GoalService.getProgressPercentage(6000, 5000)).toBe(100);
    });

    it('deve retornar 0 quando targetAmount é zero', () => {
      expect(GoalService.getProgressPercentage(100, 0)).toBe(0);
    });
  });

  describe('getRemainingAmount', () => {
    it('deve calcular valor restante corretamente', () => {
      expect(GoalService.getRemainingAmount(1500, 5000)).toBe(3500);
      expect(GoalService.getRemainingAmount(5000, 5000)).toBe(0);
    });

    it('deve retornar 0 quando já atingiu a meta', () => {
      expect(GoalService.getRemainingAmount(6000, 5000)).toBe(0);
    });
  });
});
