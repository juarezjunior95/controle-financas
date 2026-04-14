import { prisma } from '../../config/prisma';

export class DashboardService {
  /**
   * Calcula o sumário financeiro do usuário (Saldo Total, Receitas e Despesas do mês).
   */
  static async getSummary(clerkId: string) {
    try {
      // 1. Encontrar o usuário local pelo clerkId
      const user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        throw new Error('Usuário não sincronizado no banco local.');
      }

      const now = new Date();
      // Início do mês atual (Ano, Mês, Dia 1)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      // Fim do mês atual (Ano, Próximo Mês, Dia 0 -> último dia do mês atual)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // 2. Cálculo do Saldo Total (Acumulado Histórico)
      const totalSummary = await prisma.transaction.groupBy({
        by: ['type'],
        where: { userId: user.id },
        _sum: { amount: true },
      });

      const totalIncomeAllTime = Number(totalSummary.find((t: any) => t.type === 'income')?._sum.amount || 0);
      const totalExpenseAllTime = Number(totalSummary.find((t: any) => t.type === 'expense')?._sum.amount || 0);
      const totalBalance = totalIncomeAllTime - totalExpenseAllTime;

      // 3. Cálculo do Mês Atual
      const monthlySummary = await prisma.transaction.groupBy({
        by: ['type'],
        where: {
          userId: user.id,
          occurredOn: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { amount: true },
      });

      const monthlyIncome = Number(monthlySummary.find((t: any) => t.type === 'income')?._sum.amount || 0);
      const monthlyExpenses = Number(monthlySummary.find((t: any) => t.type === 'expense')?._sum.amount || 0);
      const monthlyBalance = monthlyIncome - monthlyExpenses;

      return {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance,
      };
    } catch (error: any) {
      console.error('[DashboardService] Erro ao calcular sumário:', error);
      throw error;
    }
  }
}
