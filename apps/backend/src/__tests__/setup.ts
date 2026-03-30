// Mock do Prisma Client
jest.mock('../config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    goal: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((callback: (prisma: any) => any) => callback({
      user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      category: { findMany: jest.fn(), create: jest.fn() },
      transaction: { findMany: jest.fn(), aggregate: jest.fn() },
      goal: { findMany: jest.fn() },
    })),
  },
}));

// Mock do Clerk
jest.mock('../config/clerk', () => ({
  clerk: {
    users: {
      getUser: jest.fn(),
      getUserList: jest.fn(),
      createUser: jest.fn(),
      verifyPassword: jest.fn(),
    },
    signInTokens: {
      createSignInToken: jest.fn(),
    },
  },
}));

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
