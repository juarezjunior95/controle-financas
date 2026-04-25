/**
 * TESTES DE ACEITE (E2E) — Fluxo completo: Transações -> Dashboard
 *
 * Simula requisições HTTP reais usando supertest no Express app (isolado de porta).
 * Usa Clerk e Prisma mockados para focar apenas nos endpoints e status HTTP.
 */

import request from 'supertest';
import app from '../../index'; // A importação vai processar as rotas
import { prisma, resetPrismaMocks } from '../../__mocks__/prisma';
import { setMockUserId } from '../../__mocks__/clerk';

// Mock do usuário e categoria para usar nos retornos do Prisma
const MOCK_USER = {
  id: 'uuid-user-001',
  clerkId: 'user_test_clerk_id',
  email: 'teste@exemplo.com',
  displayName: 'Teste',
  initialBalance: '0.00',
};

const MOCK_CATEGORY = {
  id: 'uuid-cat-001',
  userId: MOCK_USER.id,
  name: 'Lazer',
};

// Precisamos remover o fallback de erro que o index.ts registra
// se ocorrer algum erro na inicialização global
beforeAll(() => {
  // Configuração global se necessária
});

beforeEach(() => {
  resetPrismaMocks();
  // Estado padrão: usuário autenticado
  setMockUserId('user_test_clerk_id');
});

describe('[ACCEPTANCE] Fluxo Ponta-a-Ponta: Transações -> Dashboard', () => {
  
  it('deve retornar 401 se o usuário não estiver autenticado (Cenário Negativo)', async () => {
    setMockUserId(null); // Simula deslogado

    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        type: 'expense',
        amount: 50,
        description: 'Teste sem auth',
        date: '2026-05-01',
        category: 'Lazer'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('deve retornar 400 se faltarem campos na criação de transação (Cenário Negativo)', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        type: 'expense',
        // missing amount
        // missing date
        category: 'Lazer'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('BAD_REQUEST');
  });

  it('deve criar uma transação com sucesso e retornar 201 (Caminho Feliz)', async () => {
    // 1. Configura mocks do DB
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.category.upsert as jest.Mock).mockResolvedValue(MOCK_CATEGORY);
    (prisma.transaction.create as jest.Mock).mockResolvedValue({
      id: 'uuid-tx-001',
      userId: MOCK_USER.id,
      categoryId: MOCK_CATEGORY.id,
      type: 'expense',
      amount: '150.00',
      occurredOn: new Date('2026-05-01'),
      description: 'Ingresso Cinema',
      category: MOCK_CATEGORY,
    });

    // 2. Faz requisição HTTP simulada
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        type: 'expense',
        amount: 150.00,
        description: 'Ingresso Cinema',
        date: '2026-05-01',
        category: 'Lazer'
      });

    // 3. Valida HTTP status e Payload
    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/sucesso/);
    expect(response.body.data).toHaveProperty('id', 'uuid-tx-001');
    expect(response.body.data.amount).toBe('150.00');
  });

  it('deve retornar o resumo do dashboard atualizado com HTTP 200 (Caminho Feliz)', async () => {
    // 1. Configura mocks do DB para a agregação
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      initialBalance: '500.00' // mock do banco (decimal em string)
    });
    
    (prisma.transaction.groupBy as jest.Mock)
      .mockResolvedValueOnce([
        { type: 'income', _sum: { amount: '1000.00' } },
        { type: 'expense', _sum: { amount: '200.00' } },
      ])
      .mockResolvedValueOnce([
        { type: 'income', _sum: { amount: '500.00' } },
        { type: 'expense', _sum: { amount: '150.00' } },
      ]);

    // 2. Faz requisição HTTP simulada
    const response = await request(app).get('/api/v1/dashboard/summary');

    // 3. Valida resultado
    expect(response.status).toBe(200);
    expect(response.body.data.totalBalance).toBe(1300); // 500 (inicial) + 1000 - 200
    expect(response.body.data.monthlyBalance).toBe(350); // 500 - 150
  });

  it('deve retornar o resumo do dashboard atualizado com filtros usando HTTP 200', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      initialBalance: '500.00'
    });
    
    (prisma.transaction.groupBy as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { type: 'income', _sum: { amount: '300.00' } },
      ]);

    const response = await request(app).get('/api/v1/dashboard/summary?month=4&year=2026');

    expect(response.status).toBe(200);
    expect(response.body.data.monthlyIncome).toBe(300);
  });

});
