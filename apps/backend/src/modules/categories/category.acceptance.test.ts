import request from 'supertest';
import app from '../../index';
import { prisma, resetPrismaMocks } from '../../__mocks__/prisma';
import { setMockUserId } from '../../__mocks__/clerk';

const MOCK_USER = {
  id: 'uuid-user-001',
  clerkId: 'user_test_clerk_id',
};

beforeEach(() => {
  resetPrismaMocks();
  setMockUserId('user_test_clerk_id');
});

describe('[ACCEPTANCE] Fluxo de Categorias HTTP', () => {
  it('deve listar categorias do usuário retornando HTTP 200', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.category.findMany as jest.Mock).mockResolvedValue([
      { id: 'cat-1', name: 'Alimentação', isSystem: true },
      { id: 'cat-2', name: 'Lazer', isSystem: false },
    ]);

    const response = await request(app).get('/api/v1/categories');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].name).toBe('Alimentação');
  });

  it('deve retornar erro 400 ao tentar deletar categoria com transações vinculadas', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: 'cat-custom',
      userId: MOCK_USER.id,
      name: 'Viagem',
      isSystem: false,
    });
    // Simula que existe transação vinculada
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([
      { id: 'tx-001', categoryId: 'cat-custom' }
    ]);

    const response = await request(app).delete('/api/v1/categories/cat-custom');

    expect(response.status).toBe(400);
    expect(response.body.error.message).toMatch(/transações vinculadas/);
  });
});
