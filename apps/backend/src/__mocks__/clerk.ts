/**
 * Mock do @clerk/express para testes de aceite (acceptance).
 * Permite simular requests autenticados sem depender da chave do Clerk.
 */

// Estado controlável pelo teste
let _mockUserId: string | null = 'user_test_clerk_id';

export function setMockUserId(id: string | null) {
  _mockUserId = id;
}

export const clerkMiddleware = () => {
  return (_req: any, _res: any, next: any) => next();
};

export const getAuth = (_req: any) => ({
  userId: _mockUserId,
  sessionId: _mockUserId ? 'session_test' : null,
});
