import { TransactionService } from '../modules/transactions/transaction.service';
import { prisma } from '../config/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('TransactionService', () => {
  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Alimentação',
    isSystem: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    categoryId: mockCategory.id,
    type: 'expense',
    amount: 150.5,
    occurredOn: new Date('2026-03-15'),
    description: 'Almoço',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategory,
  };

  describe('create', () => {
    it('deve criar um novo lançamento de despesa', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (mockPrisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await TransactionService.create({
        userId: mockTransaction.userId,
        categoryId: mockTransaction.categoryId,
        type: 'expense',
        amount: 150.5,
        occurredOn: new Date('2026-03-15'),
        description: 'Almoço',
      });

      expect(mockPrisma.transaction.create).toHaveBeenCalled();
      expect(result).toEqual(mockTransaction);
    });

    it('deve criar um lançamento de receita', async () => {
      const incomeTransaction = { ...mockTransaction, type: 'income', amount: 3000 };
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (mockPrisma.transaction.create as jest.Mock).mockResolvedValue(incomeTransaction);

      const result = await TransactionService.create({
        userId: mockTransaction.userId,
        categoryId: mockTransaction.categoryId,
        type: 'income',
        amount: 3000,
        occurredOn: new Date('2026-03-01'),
      });

      expect(result.type).toBe('income');
    });

    it('deve lançar erro quando categoria não pertence ao usuário', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.create({
          userId: mockTransaction.userId,
          categoryId: 'invalid-category',
          type: 'expense',
          amount: 100,
          occurredOn: new Date(),
        })
      ).rejects.toThrow('Categoria não encontrada ou não pertence ao usuário.');
    });

    it('deve lançar erro quando valor é negativo', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);

      await expect(
        TransactionService.create({
          userId: mockTransaction.userId,
          categoryId: mockTransaction.categoryId,
          type: 'expense',
          amount: -100,
          occurredOn: new Date(),
        })
      ).rejects.toThrow('O valor do lançamento deve ser maior ou igual a zero.');
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar todos os lançamentos do usuário', async () => {
      const transactions = [mockTransaction, { ...mockTransaction, id: '2' }];
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(transactions);

      const result = await TransactionService.findAllByUser({
        userId: mockTransaction.userId,
      });

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockTransaction.userId },
        include: { category: true },
        orderBy: { occurredOn: 'desc' },
      });
      expect(result).toHaveLength(2);
    });

    it('deve filtrar por mês e ano', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([mockTransaction]);

      await TransactionService.findAllByUser({
        userId: mockTransaction.userId,
        month: 3,
        year: 2026,
      });

      const call = (mockPrisma.transaction.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.occurredOn).toBeDefined();
      expect(call.where.occurredOn.gte).toEqual(new Date(2026, 2, 1));
      expect(call.where.occurredOn.lte).toEqual(new Date(2026, 3, 0));
    });

    it('deve filtrar por tipo', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([mockTransaction]);

      await TransactionService.findAllByUser({
        userId: mockTransaction.userId,
        type: 'expense',
      });

      const call = (mockPrisma.transaction.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.type).toBe('expense');
    });
  });

  describe('update', () => {
    it('deve atualizar o lançamento', async () => {
      const updatedTransaction = { ...mockTransaction, amount: 200 };
      (mockPrisma.transaction.findFirst as jest.Mock).mockResolvedValue(mockTransaction);
      (mockPrisma.transaction.update as jest.Mock).mockResolvedValue(updatedTransaction);

      const result = await TransactionService.update(
        mockTransaction.id,
        mockTransaction.userId,
        { amount: 200 }
      );

      expect(result.amount).toBe(200);
    });

    it('deve lançar erro quando lançamento não encontrado', async () => {
      (mockPrisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.update('nonexistent', mockTransaction.userId, { amount: 200 })
      ).rejects.toThrow('Lançamento não encontrado.');
    });

    it('deve validar categoria ao atualizar', async () => {
      (mockPrisma.transaction.findFirst as jest.Mock).mockResolvedValue(mockTransaction);
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.update(mockTransaction.id, mockTransaction.userId, {
          categoryId: 'invalid-category',
        })
      ).rejects.toThrow('Categoria não encontrada ou não pertence ao usuário.');
    });
  });

  describe('delete', () => {
    it('deve excluir o lançamento', async () => {
      (mockPrisma.transaction.findFirst as jest.Mock).mockResolvedValue(mockTransaction);
      (mockPrisma.transaction.delete as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await TransactionService.delete(
        mockTransaction.id,
        mockTransaction.userId
      );

      expect(mockPrisma.transaction.delete).toHaveBeenCalledWith({
        where: { id: mockTransaction.id },
      });
      expect(result).toEqual(mockTransaction);
    });

    it('deve lançar erro quando lançamento não encontrado', async () => {
      (mockPrisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        TransactionService.delete('nonexistent', mockTransaction.userId)
      ).rejects.toThrow('Lançamento não encontrado.');
    });
  });

  describe('getMonthlySummary', () => {
    it('deve calcular o resumo mensal corretamente', async () => {
      const transactions = [
        { ...mockTransaction, type: 'income', amount: 3000, category: { name: 'Salário' } },
        { ...mockTransaction, type: 'expense', amount: 500, category: { name: 'Alimentação' } },
        { ...mockTransaction, type: 'expense', amount: 200, category: { name: 'Transporte' } },
      ];
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue(transactions);

      const result = await TransactionService.getMonthlySummary(
        mockTransaction.userId,
        3,
        2026
      );

      expect(result.income).toBe(3000);
      expect(result.expense).toBe(700);
      expect(result.balance).toBe(2300);
      expect(result.transactionCount).toBe(3);
      expect(result.byCategory['Alimentação'].expense).toBe(500);
      expect(result.byCategory['Transporte'].expense).toBe(200);
    });

    it('deve retornar zeros quando não há lançamentos', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);

      const result = await TransactionService.getMonthlySummary(
        mockTransaction.userId,
        3,
        2026
      );

      expect(result.income).toBe(0);
      expect(result.expense).toBe(0);
      expect(result.balance).toBe(0);
      expect(result.transactionCount).toBe(0);
    });
  });
});
