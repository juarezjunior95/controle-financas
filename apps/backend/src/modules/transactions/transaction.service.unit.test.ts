/**
 * TESTES UNITÁRIOS — TransactionService: validação e lógica de negócio
 *
 * Testa o comportamento do serviço em cenários normais e de erro,
 * mockando completamente o Prisma para isolar a lógica do código.
 */

import { prisma, resetPrismaMocks } from '../../__mocks__/prisma';
import { TransactionService, CreateTransactionDto } from './transaction.service';

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

const MOCK_CATEGORY = {
  id: 'uuid-cat-001',
  userId: MOCK_USER.id,
  name: 'Alimentação',
  isSystem: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const makeTransaction = (overrides = {}) => ({
  id: 'uuid-tx-001',
  userId: MOCK_USER.id,
  categoryId: MOCK_CATEGORY.id,
  type: 'expense',
  amount: '35.00',
  occurredOn: new Date('2026-04-25'),
  description: 'Almoço',
  createdAt: new Date(),
  updatedAt: new Date(),
  category: MOCK_CATEGORY,
  ...overrides,
});

const VALID_CREATE_DTO: CreateTransactionDto = {
  userId: MOCK_USER.clerkId,
  type: 'expense',
  amount: 35,
  description: 'Almoço no restaurante',
  date: '2026-04-25',
  category: 'Alimentação',
};

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  resetPrismaMocks();
});

// ─── Testes: create ───────────────────────────────────────────────────────────

describe('[UNIT] TransactionService.create', () => {
  it('deve criar uma transação com sucesso', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.category.upsert as jest.Mock).mockResolvedValue(MOCK_CATEGORY);
    (prisma.transaction.create as jest.Mock).mockResolvedValue(makeTransaction());

    const result = await TransactionService.create(VALID_CREATE_DTO);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { clerkId: MOCK_USER.clerkId },
    });
    expect(prisma.category.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_name: { userId: MOCK_USER.id, name: 'Alimentação' },
        },
      })
    );
    expect(prisma.transaction.create).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('id', 'uuid-tx-001');
    expect(result).toHaveProperty('category');
  });

  it('deve lançar erro se o usuário não existir no banco', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(TransactionService.create(VALID_CREATE_DTO)).rejects.toThrow(
      'Usuário não sincronizado'
    );
    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });

  it('deve criar ou reutilizar categoria via upsert', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.category.upsert as jest.Mock).mockResolvedValue(MOCK_CATEGORY);
    (prisma.transaction.create as jest.Mock).mockResolvedValue(makeTransaction());

    // Primeira transação com a mesma categoria
    await TransactionService.create(VALID_CREATE_DTO);
    // Segunda transação com a mesma categoria
    await TransactionService.create(VALID_CREATE_DTO);

    expect(prisma.category.upsert).toHaveBeenCalledTimes(2);
    // O upsert não cria duplicata — comportamento gerenciado pelo Prisma
  });
});

// ─── Testes: listByUser ──────────────────────────────────────────────────────

describe('[UNIT] TransactionService.listByUser', () => {
  it('deve retornar lista de transações do usuário', async () => {
    const transactions = [makeTransaction(), makeTransaction({ id: 'uuid-tx-002', amount: '120.00' })];

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(transactions);

    const result = await TransactionService.listByUser(MOCK_USER.clerkId);

    expect(result).toHaveLength(2);
    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: MOCK_USER.id },
      })
    );
  });

  it('deve retornar lista vazia se o usuário não existir', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await TransactionService.listByUser('ghost_user_id');

    expect(result).toEqual([]);
    expect(prisma.transaction.findMany).not.toHaveBeenCalled();
  });

  it('deve filtrar transações pelo mês/ano corretamente', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);

    await TransactionService.listByUser(MOCK_USER.clerkId, { month: 3, year: 2026 });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          occurredOn: expect.objectContaining({
            gte: new Date(2026, 3, 1),    // mês 3 = abril (0-indexed)
            lte: new Date(2026, 4, 0, 23, 59, 59),
          }),
        }),
      })
    );
  });
});

// ─── Testes: delete ──────────────────────────────────────────────────────────

describe('[UNIT] TransactionService.delete', () => {
  it('deve deletar transação do usuário com sucesso', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.transaction.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    const result = await TransactionService.delete(MOCK_USER.clerkId, 'uuid-tx-001');

    expect(result).toEqual({ id: 'uuid-tx-001' });
    expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({
      where: { id: 'uuid-tx-001', userId: MOCK_USER.id },
    });
  });

  it('deve lançar erro se a transação não pertencer ao usuário', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.transaction.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

    await expect(
      TransactionService.delete(MOCK_USER.clerkId, 'uuid-outra-pessoa')
    ).rejects.toThrow('não encontrada ou permissão negada');
  });
});
