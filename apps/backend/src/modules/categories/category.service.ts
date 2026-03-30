import { prisma } from '../../config/prisma';

interface CreateCategoryInput {
  userId: string;
  name: string;
  isSystem?: boolean;
}

interface UpdateCategoryInput {
  name?: string;
}

export class CategoryService {
  static async create(input: CreateCategoryInput) {
    try {
      return await prisma.category.create({
        data: {
          userId: input.userId,
          name: input.name,
          isSystem: input.isSystem ?? false,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new Error('Categoria com este nome já existe para este usuário.');
      }
      console.error('[CategoryService] Erro ao criar categoria:', error);
      throw new Error('Falha ao criar categoria.');
    }
  }

  static async findAllByUser(userId: string) {
    try {
      return await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      console.error('[CategoryService] Erro ao listar categorias:', error);
      throw new Error('Falha ao listar categorias.');
    }
  }

  static async findById(id: string, userId: string) {
    try {
      return await prisma.category.findFirst({
        where: { id, userId },
      });
    } catch (error) {
      console.error('[CategoryService] Erro ao buscar categoria:', error);
      throw new Error('Falha ao buscar categoria.');
    }
  }

  static async update(id: string, userId: string, input: UpdateCategoryInput) {
    try {
      const category = await this.findById(id, userId);
      if (!category) {
        throw new Error('Categoria não encontrada.');
      }

      return await prisma.category.update({
        where: { id },
        data: input,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new Error('Categoria com este nome já existe para este usuário.');
      }
      if (error?.message === 'Categoria não encontrada.') {
        throw error;
      }
      console.error('[CategoryService] Erro ao atualizar categoria:', error);
      throw new Error('Falha ao atualizar categoria.');
    }
  }

  static async delete(id: string, userId: string) {
    try {
      const category = await this.findById(id, userId);
      if (!category) {
        throw new Error('Categoria não encontrada.');
      }

      // Verificar se existem transações vinculadas
      const transactionCount = await prisma.transaction.count({
        where: { categoryId: id },
      });

      if (transactionCount > 0) {
        throw new Error('Não é possível excluir categoria com lançamentos vinculados.');
      }

      return await prisma.category.delete({
        where: { id },
      });
    } catch (error: any) {
      if (
        error?.message === 'Categoria não encontrada.' ||
        error?.message === 'Não é possível excluir categoria com lançamentos vinculados.'
      ) {
        throw error;
      }
      console.error('[CategoryService] Erro ao excluir categoria:', error);
      throw new Error('Falha ao excluir categoria.');
    }
  }

  static async createDefaultCategories(userId: string) {
    const defaultCategories = [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
      'Lazer',
      'Estudos e trabalho',
      'Outros',
    ];

    try {
      const categories = await Promise.all(
        defaultCategories.map((name) =>
          prisma.category.create({
            data: {
              userId,
              name,
              isSystem: true,
            },
          })
        )
      );
      return categories;
    } catch (error) {
      console.error('[CategoryService] Erro ao criar categorias padrão:', error);
      throw new Error('Falha ao criar categorias padrão.');
    }
  }
}
