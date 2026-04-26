/**
 * TESTES DE INTEGRAÇÃO — DashboardService
 *
 * Verifica o cálculo de saldo total e resumo mensal que envolve
 * múltiplas consultas ao Prisma (groupBy + user lookup).
 * O Prisma é mockado mas todos os caminhos de lógica são exercitados.
 */

import { prisma, resetPrismaMocks } from '../../__mocks__/prisma';
import { DashboardService } from './dashboard.service';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 'uuid-user-001',
  clerkId: 'user_test_clerk_id',
  email: 'lucas@test.com',
  displayName: 'Lucas',
  initialBalance: '500.00',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  resetPrismaMocks();
});

// ─── Testes de Integração ─────────────────────────────────────────────────────

describe('[INTEGRATION] DashboardService.getSummary', () => {
  it('deve retornar saldo correto considerando saldo inicial + histórico', async () => {
    // Saldo inicial: R$ 500
    // Receitas históricas: R$ 2.000
    // Despesas históricas: R$ 1.200
    // Saldo total esperado: 500 + 2000 - 1200 = R$ 1.300
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.transaction.groupBy as jest.Mock)
      .mockResolvedValueOnce([
        // Primeira chamada: histórico total
        { type: 'income', _sum: { amount: '2000.00' } },
        { type: 'expense', _sum: { amount: '1200.00' } },
      ])
      .mockResolvedValueOnce([
        // Segunda chamada: resumo mensal atual
        { type: 'income', _sum: { amount: '800.00' } },
        { type: 'expense', _sum: { amount: '350.00' } },
      ])
      .mockResolvedValueOnce([
        // Terceira chamada: resumo do mês anterior
        { type: 'income', _sum: { amount: '500.00' } },
        { type: 'expense', _sum: { amount: '200.00' } },
      ]);

    const result = await DashboardService.getSummary(MOCK_USER.clerkId);

    expect(result.totalBalance).toBe(1300); // 500 + 2000 - 1200
    expect(result.initialBalance).toBe(500);
    expect(result.monthlyIncome).toBe(800);
    expect(result.monthlyExpenses).toBe(350);
    expect(result.monthlyBalance).toBe(450); // 800 - 350
  });

  it('deve retornar zeros quando usuário não possui transações', async () => {
    const userSemTransacoes = { ...MOCK_USER, initialBalance: '0.00' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userSemTransacoes);
    (prisma.transaction.groupBy as jest.Mock)
      .mockResolvedValueOnce([]) // nenhuma transação histórica
      .mockResolvedValueOnce([]) // nenhuma transação no mês atual
      .mockResolvedValueOnce([]); // nenhuma transação no mês anterior

    const result = await DashboardService.getSummary(MOCK_USER.clerkId);

    expect(result.totalBalance).toBe(0);
    expect(result.monthlyIncome).toBe(0);
    expect(result.monthlyExpenses).toBe(0);
    expect(result.monthlyBalance).toBe(0);
  });

  it('deve lançar erro se o usuário não estiver sincronizado no banco', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(DashboardService.getSummary('ghost_clerk_id')).rejects.toThrow(
      'Usuário não sincronizado'
    );
    // Não deve ter chamado groupBy desnecessariamente
    expect(prisma.transaction.groupBy).not.toHaveBeenCalled();
  });

  it('deve calcular saldo negativo quando despesas superam receitas + saldo inicial', async () => {
    const userComSaldoZerado = { ...MOCK_USER, initialBalance: '0.00' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userComSaldoZerado);
    (prisma.transaction.groupBy as jest.Mock)
      .mockResolvedValueOnce([
        { type: 'income', _sum: { amount: '500.00' } },
        { type: 'expense', _sum: { amount: '1500.00' } },
      ])
      .mockResolvedValueOnce([
        { type: 'expense', _sum: { amount: '500.00' } },
      ])
      .mockResolvedValueOnce([]); // mês anterior zerado

    const result = await DashboardService.getSummary(MOCK_USER.clerkId);

    expect(result.totalBalance).toBe(-1000); // 0 + 500 - 1500
    expect(result.monthlyBalance).toBe(-500); // 0 - 500
  });

  it('deve chamar groupBy com o userId correto (isolamento de dados)', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.transaction.groupBy as jest.Mock).mockResolvedValue([]);

    await DashboardService.getSummary(MOCK_USER.clerkId);

    // Verifica que todas as 3 chamadas ao groupBy usam o userId correto
    const calls = (prisma.transaction.groupBy as jest.Mock).mock.calls;
    expect(calls.length).toBe(3);
    calls.forEach((call: any[]) => {
      expect(call[0]).toMatchObject({
        where: expect.objectContaining({ userId: MOCK_USER.id }),
      });
    });
  });

  it('deve calcular resumo mensal baseado nos filtros de mês e ano', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.transaction.groupBy as jest.Mock)
      .mockResolvedValueOnce([
        { type: 'income', _sum: { amount: '1000.00' } },
        { type: 'expense', _sum: { amount: '200.00' } },
      ])
      .mockResolvedValueOnce([
        { type: 'expense', _sum: { amount: '50.00' } },
      ])
      .mockResolvedValueOnce([]);

    const result = await DashboardService.getSummary(MOCK_USER.clerkId, { month: 4, year: 2026 });

    expect(result.monthlyExpenses).toBe(50);
    
    // Verifica se a chamada do Prisma usou o range correto para mês 4 (Abril) -> índice 3
    const calls = (prisma.transaction.groupBy as jest.Mock).mock.calls;
    expect(calls[1][0]).toMatchObject({
      where: expect.objectContaining({
        occurredOn: {
          gte: new Date(2026, 3, 1),
          lte: new Date(2026, 4, 0, 23, 59, 59, 999),
        }
      }),
    });
  });
});
