import { CategoryService } from '../modules/categories/category.service';
import { prisma } from '../config/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('CategoryService', () => {
  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Alimentação',
    isSystem: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('deve criar uma nova categoria', async () => {
      (mockPrisma.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await CategoryService.create({
        userId: mockCategory.userId,
        name: 'Alimentação',
      });

      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: {
          userId: mockCategory.userId,
          name: 'Alimentação',
          isSystem: false,
        },
      });
      expect(result).toEqual(mockCategory);
    });

    it('deve criar categoria com isSystem true', async () => {
      const systemCategory = { ...mockCategory, isSystem: true };
      (mockPrisma.category.create as jest.Mock).mockResolvedValue(systemCategory);

      const result = await CategoryService.create({
        userId: mockCategory.userId,
        name: 'Alimentação',
        isSystem: true,
      });

      expect(result.isSystem).toBe(true);
    });

    it('deve lançar erro quando categoria duplicada', async () => {
      const error = new Error('Unique constraint') as any;
      error.code = 'P2002';
      (mockPrisma.category.create as jest.Mock).mockRejectedValue(error);

      await expect(
        CategoryService.create({
          userId: mockCategory.userId,
          name: 'Alimentação',
        })
      ).rejects.toThrow('Categoria com este nome já existe para este usuário.');
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar todas as categorias do usuário ordenadas', async () => {
      const categories = [
        { ...mockCategory, name: 'Alimentação' },
        { ...mockCategory, id: '2', name: 'Transporte' },
      ];
      (mockPrisma.category.findMany as jest.Mock).mockResolvedValue(categories);

      const result = await CategoryService.findAllByUser(mockCategory.userId);

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { userId: mockCategory.userId },
        orderBy: { name: 'asc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('deve retornar a categoria quando encontrada', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);

      const result = await CategoryService.findById(mockCategory.id, mockCategory.userId);

      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategory.id, userId: mockCategory.userId },
      });
      expect(result).toEqual(mockCategory);
    });

    it('deve retornar null quando categoria não existe', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await CategoryService.findById('nonexistent', mockCategory.userId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar o nome da categoria', async () => {
      const updatedCategory = { ...mockCategory, name: 'Novo Nome' };
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (mockPrisma.category.update as jest.Mock).mockResolvedValue(updatedCategory);

      const result = await CategoryService.update(mockCategory.id, mockCategory.userId, {
        name: 'Novo Nome',
      });

      expect(result.name).toBe('Novo Nome');
    });

    it('deve lançar erro quando categoria não encontrada', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        CategoryService.update('nonexistent', mockCategory.userId, { name: 'Novo Nome' })
      ).rejects.toThrow('Categoria não encontrada.');
    });
  });

  describe('delete', () => {
    it('deve excluir categoria sem lançamentos', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(0);
      (mockPrisma.category.delete as jest.Mock).mockResolvedValue(mockCategory);

      const result = await CategoryService.delete(mockCategory.id, mockCategory.userId);

      expect(mockPrisma.category.delete).toHaveBeenCalledWith({
        where: { id: mockCategory.id },
      });
      expect(result).toEqual(mockCategory);
    });

    it('deve lançar erro quando categoria tem lançamentos', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(mockCategory);
      (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(5);

      await expect(
        CategoryService.delete(mockCategory.id, mockCategory.userId)
      ).rejects.toThrow('Não é possível excluir categoria com lançamentos vinculados.');
    });

    it('deve lançar erro quando categoria não encontrada', async () => {
      (mockPrisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        CategoryService.delete('nonexistent', mockCategory.userId)
      ).rejects.toThrow('Categoria não encontrada.');
    });
  });

  describe('createDefaultCategories', () => {
    it('deve criar as 7 categorias padrão', async () => {
      const defaultCategories = [
        'Alimentação',
        'Transporte',
        'Moradia',
        'Saúde',
        'Lazer',
        'Estudos e trabalho',
        'Outros',
      ];

      (mockPrisma.category.create as jest.Mock).mockImplementation(({ data }) =>
        Promise.resolve({ ...mockCategory, name: data.name, isSystem: true })
      );

      const result = await CategoryService.createDefaultCategories(mockCategory.userId);

      expect(mockPrisma.category.create).toHaveBeenCalledTimes(7);
      expect(result).toHaveLength(7);
    });
  });
});
