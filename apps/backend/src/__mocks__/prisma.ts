/**
 * Mock do Prisma Client para testes.
 * Substitui o cliente real por funções jest.fn() que podem ser
 * configuradas em cada teste via mockResolvedValue / mockRejectedValue.
 */
const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  category: {
    upsert: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
    groupBy: jest.fn(),
  },
  goal: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const prisma = prismaMock;

// Helper para resetar todos os mocks entre testes
export function resetPrismaMocks() {
  Object.values(prismaMock).forEach((model) => {
    Object.values(model).forEach((fn: any) => fn.mockReset());
  });
}
