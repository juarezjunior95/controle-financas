/**
 * TESTES UNITÁRIOS — GoalService.calculateProgress (método privado exposto via listByUser)
 *
 * Valida a lógica de cálculo de progresso e atualização de status sem tocar no banco.
 * Os métodos do Prisma são totalmente mockados via src/__mocks__/prisma.ts.
 */

import { prisma, resetPrismaMocks } from '../../__mocks__/prisma';

// Importa o serviço DEPOIS do mock estar configurado
import { GoalService } from './goal.service';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 'uuid-user-001',
  clerkId: 'user_test_clerk_id',
  email: 'lucas@test.com',
  displayName: 'Lucas',
  initialBalance: '0',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const makeGoal = (overrides = {}) => ({
  id: 'uuid-goal-001',
  userId: MOCK_USER.id,
  title: 'Viagem para Europa',
  targetAmount: '10000.00',
  currentAmount: '0.00',
  deadline: null,
  status: 'active',
  icon: 'savings',
  color: '#b0c6ff',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─── Setup e Teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  resetPrismaMocks();
});

// ─── Testes Unitários ────────────────────────────────────────────────────────

describe('[UNIT] GoalService — Cálculo de Progresso', () => {
  it('deve retornar 0% quando currentAmount é zero', async () => {
    const goal = makeGoal({ currentAmount: '0.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findMany as jest.Mock).mockResolvedValue([goal]);

    const result = await GoalService.listByUser(MOCK_USER.clerkId, {});

    expect(result[0].progress).toBe(0);
  });

  it('deve retornar 100% quando currentAmount atinge o targetAmount', async () => {
    const goal = makeGoal({ currentAmount: '1000.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findMany as jest.Mock).mockResolvedValue([goal]);

    const result = await GoalService.listByUser(MOCK_USER.clerkId, {});

    expect(result[0].progress).toBe(100);
  });

  it('deve calcular progresso intermediário corretamente (50%)', async () => {
    const goal = makeGoal({ currentAmount: '500.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findMany as jest.Mock).mockResolvedValue([goal]);

    const result = await GoalService.listByUser(MOCK_USER.clerkId, {});

    expect(result[0].progress).toBe(50);
  });

  it('deve retornar 0 se targetAmount for zero (evitar divisão por zero)', async () => {
    const goal = makeGoal({ currentAmount: '0.00', targetAmount: '0.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findMany as jest.Mock).mockResolvedValue([goal]);

    const result = await GoalService.listByUser(MOCK_USER.clerkId, {});

    expect(result[0].progress).toBe(0);
  });
});

describe('[UNIT] GoalService — updateProgress: modo increment', () => {
  it('deve incrementar o valor atual corretamente', async () => {
    const goal = makeGoal({ currentAmount: '300.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findUnique as jest.Mock).mockResolvedValue(goal);
    (prisma.goal.update as jest.Mock).mockResolvedValue({
      ...goal,
      currentAmount: '500.00',
      status: 'active',
    });

    const result = await GoalService.updateProgress(MOCK_USER.clerkId, goal.id, 200);

    expect(prisma.goal.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ currentAmount: 500, status: 'active' }),
      })
    );
    expect(result.progress).toBe(50);
  });

  it('deve setar status como "completed" quando atinge o target', async () => {
    const goal = makeGoal({ currentAmount: '900.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findUnique as jest.Mock).mockResolvedValue(goal);
    (prisma.goal.update as jest.Mock).mockResolvedValue({
      ...goal,
      currentAmount: '1000.00',
      status: 'completed',
    });

    const result = await GoalService.updateProgress(MOCK_USER.clerkId, goal.id, 100);

    expect(prisma.goal.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'completed' }),
      })
    );
    expect(result.status).toBe('completed');
  });

  it('deve lançar erro se o saldo ficar negativo', async () => {
    const goal = makeGoal({ currentAmount: '50.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findUnique as jest.Mock).mockResolvedValue(goal);

    await expect(
      GoalService.updateProgress(MOCK_USER.clerkId, goal.id, -200)
    ).rejects.toThrow('não pode ser negativo');
  });
});

describe('[UNIT] GoalService — updateProgress: modo set', () => {
  it('deve definir valor absoluto ignorando o valor atual', async () => {
    const goal = makeGoal({ currentAmount: '800.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findUnique as jest.Mock).mockResolvedValue(goal);
    (prisma.goal.update as jest.Mock).mockResolvedValue({
      ...goal,
      currentAmount: '300.00',
      status: 'active',
    });

    await GoalService.updateProgress(MOCK_USER.clerkId, goal.id, 300, 'set');

    expect(prisma.goal.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ currentAmount: 300 }),
      })
    );
  });

  it('deve rejeitar valor negativo no modo set', async () => {
    const goal = makeGoal({ currentAmount: '100.00', targetAmount: '1000.00' });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.goal.findUnique as jest.Mock).mockResolvedValue(goal);

    await expect(
      GoalService.updateProgress(MOCK_USER.clerkId, goal.id, -1, 'set')
    ).rejects.toThrow('não pode ser negativo');
  });
});
