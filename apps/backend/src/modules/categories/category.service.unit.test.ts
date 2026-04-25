/**
 * TESTES UNITÁRIOS — CategoryService
 *
 * Foco especial na validação de categorias e transações vinculadas.
 */

import { prisma, resetPrismaMocks } from '../../__mocks__/prisma';
import { CategoryService } from './category.service';

const MOCK_USER = {
  id: 'uuid-user-001',
  clerkId: 'user_test_clerk_id',
};

beforeEach(() => {
  resetPrismaMocks();
});

describe('[UNIT] CategoryService', () => {
  it('não deve deletar categoria de sistema', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    // Mock categoria como isSystem = true
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: 'uuid-cat-system',
      userId: MOCK_USER.id,
      name: 'Salário',
      isSystem: true,
    });

    await expect(CategoryService.delete(MOCK_USER.clerkId, 'uuid-cat-system')).rejects.toThrow(
      'Categorias do sistema não podem ser apagadas.'
    );
  });

  it('deve deletar categoria que não tem transações vinculadas', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: 'uuid-cat-custom',
      userId: MOCK_USER.id,
      name: 'Viagem',
      isSystem: false,
    });
    // Nenhuma transação associada
    (prisma.transaction.count as jest.Mock).mockResolvedValue(0);
    (prisma.category.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    const result = await CategoryService.delete(MOCK_USER.clerkId, 'uuid-cat-custom');

    expect(result.id).toBe('uuid-cat-custom');
    expect(prisma.category.deleteMany).toHaveBeenCalledWith({
      where: { id: 'uuid-cat-custom', userId: MOCK_USER.id },
    });
  });

  it('deve lançar erro ao tentar deletar categoria com transações vinculadas', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.category.findUnique as jest.Mock).mockResolvedValue({
      id: 'uuid-cat-custom',
      userId: MOCK_USER.id,
      name: 'Viagem',
      isSystem: false,
    });
    // Existe uma transação vinculada a essa categoria
    (prisma.transaction.count as jest.Mock).mockResolvedValue(1);

    await expect(CategoryService.delete(MOCK_USER.clerkId, 'uuid-cat-custom')).rejects.toThrow(
      'Não é possível excluir esta categoria porque existem transações vinculadas a ela.'
    );
    expect(prisma.category.deleteMany).not.toHaveBeenCalled();
  });
});
