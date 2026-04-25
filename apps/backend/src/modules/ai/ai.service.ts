import { GoogleGenAI } from '@google/genai';
import { prisma } from '../../config/prisma';

export class AiService {
  /**
   * Gera insights financeiros com base nas transações dos últimos 30 dias usando o Gemini.
   */
  static async getFinancialInsights(clerkId: string) {
    // 1. Validar a chave de API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[AiService] GEMINI_API_KEY não configurada. Usando mock.');
      return this.getMockInsights();
    }

    // 2. Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // 3. Buscar transações dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        occurredOn: { gte: thirtyDaysAgo },
      },
      include: {
        category: true,
      },
      orderBy: {
        occurredOn: 'desc',
      },
    });

    if (transactions.length === 0) {
      return [
        'Você ainda não registrou nenhuma transação nos últimos 30 dias.',
        'Comece a registrar seus gastos para que possamos fornecer análises.',
        'Manter o controle diário ajuda a evitar surpresas no fim do mês.'
      ];
    }

    // 4. Preparar os dados para o LLM
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      expensesByCategory: {} as Record<string, number>,
      latestTransactions: transactions.slice(0, 50).map(t => ({
        date: t.occurredOn.toISOString().split('T')[0],
        type: t.type === 'expense' ? 'Despesa' : 'Receita',
        amount: Number(t.amount),
        category: t.category.name,
        description: t.description,
      }))
    };

    transactions.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'income') {
        summary.totalIncome += amount;
      } else {
        summary.totalExpense += amount;
        const catName = t.category.name;
        summary.expensesByCategory[catName] = (summary.expensesByCategory[catName] || 0) + amount;
      }
    });

    // 5. Chamar o modelo
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Atue como um consultor financeiro pessoal experiente e objetivo.
        Abaixo estão os dados financeiros do usuário referentes aos últimos 30 dias.
        
        Resumo:
        - Receitas Totais: R$ ${summary.totalIncome.toFixed(2)}
        - Despesas Totais: R$ ${summary.totalExpense.toFixed(2)}
        - Despesas por Categoria: ${JSON.stringify(summary.expensesByCategory)}
        
        Histórico Recente (Amostra):
        ${JSON.stringify(summary.latestTransactions)}
        
        Gere exatamente 3 insights curtos (máximo de 2 frases cada) baseados nesses dados.
        Concentre-se em tendências, maiores gastos e conselhos práticos.
        O seu retorno DEVE SER SOMENTE um JSON Array de strings, sem formatação markdown ou blocos de código (\`\`\`).
        Exemplo de saída esperada:
        ["Você gastou a maior parte de seu dinheiro (40%) em Alimentação.", "Sua receita superou suas despesas, excelente trabalho economizando.", "Cuidado com pequenos gastos recorrentes em Lazer."]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text || '[]';
      try {
        const insights = JSON.parse(responseText.trim());
        if (Array.isArray(insights)) {
          return insights.slice(0, 3);
        }
      } catch (parseError) {
        console.error('[AiService] Erro ao fazer parse do JSON retornado pelo Gemini:', responseText);
      }
      
      return this.getFallbackInsights(summary.totalIncome, summary.totalExpense);
      
    } catch (error) {
      console.error('[AiService] Erro ao chamar Google Gen AI:', error);
      return this.getFallbackInsights(summary.totalIncome, summary.totalExpense);
    }
  }

  private static getMockInsights() {
    return [
      "A API do Gemini não está configurada no ambiente atual.",
      "Para obter insights reais, configure a variável GEMINI_API_KEY no arquivo .env.",
      "Isso demonstra o funcionamento básico do card de insights."
    ];
  }

  private static getFallbackInsights(income: number, expense: number) {
    if (income > expense) {
      return [
        `Você economizou R$ ${(income - expense).toFixed(2)} este mês.`,
        "Mantenha os gastos abaixo das receitas para construir patrimônio.",
        "Considere investir a diferença acumulada."
      ];
    } else {
      return [
        `Cuidado, suas despesas ultrapassaram as receitas em R$ ${(expense - income).toFixed(2)}.`,
        "Revise seus gastos e corte custos não essenciais.",
        "Tente criar um orçamento e segui-lo mais de perto."
      ];
    }
  }
}
