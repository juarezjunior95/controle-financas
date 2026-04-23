import { prisma } from '../../config/prisma';

// Paleta padrão de cores para as categorias (conforme acordado no plano)
const CATEGORY_COLORS = [
  '#b0c6ff', // Azul claro
  '#ffb59b', // Laranja claro
  '#a1b4eb', // Roxo claro
  '#424654', // Cinza escuro
  '#81c784', // Verde claro
  '#ffd54f', // Amarelo
];

export class DashboardService {
  static async getSummary(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Busca todas as transações do usuário incluindo dados da categoria
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
    });

    let receitas = 0;
    let despesas = 0;
    const categoriasMap = new Map<string, { amount: number; name: string }>();

    for (const t of transactions) {
      const amount = Number(t.amount);
      if (t.type === 'income') {
        receitas += amount;
      } else if (t.type === 'expense') {
        despesas += amount;
        
        const catName = t.category?.name || 'Outros';
        const existing = categoriasMap.get(catName);
        if (existing) {
          existing.amount += amount;
        } else {
          categoriasMap.set(catName, { amount, name: catName });
        }
      }
    }

    const saldoAtual = receitas - despesas;

    // Converte map para array e ordena pelo maior gasto
    const categoriasArray = Array.from(categoriasMap.values());
    categoriasArray.sort((a, b) => b.amount - a.amount);

    // Mapeia e injeta a cor da paleta
    const categorias = categoriasArray.map((cat, index) => ({
      name: cat.name,
      amount: cat.amount,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

    return {
      saldoAtual,
      receitas,
      despesas,
      categorias,
    };
  }
}
