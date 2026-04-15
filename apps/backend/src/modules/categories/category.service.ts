import { prisma } from '../../config/prisma';

export interface CreateCategoryDto {
  userId: string; // clerkId
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}

export class CategoryService {
  /** Lista canônica das categorias padrão do sistema */
  static readonly DEFAULT_CATEGORIES = [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Salário',
    'Investimentos',
    'Outros',
  ];

  /**
   * Garante que TODAS as categorias padrão existam para o usuário.
   * Compara por nome e só insere as que estão faltando.
   */
  static async seedDefaultCategories(userId: string) {
    try {
      // Busca os nomes das categorias que o usuário já possui
      const existing = await prisma.category.findMany({
        where: { userId },
        select: { name: true },
      });

      const existingNames = new Set(existing.map((c) => c.name));

      // Filtra apenas as que estão faltando
      const missing = this.DEFAULT_CATEGORIES.filter(
        (name) => !existingNames.has(name)
      );

      if (missing.length === 0) {
        console.log(`[CategoryService] Todas as categorias padrão já existem para o usuário ${userId}`);
        return;
      }

      const data = missing.map((name) => ({
        name,
        userId,
        isSystem: true,
      }));

      await prisma.category.createMany({
        data,
        skipDuplicates: true,
      });

      // Marca como isSystem as que já existiam com nome igual mas sem a flag
      await prisma.category.updateMany({
        where: {
          userId,
          name: { in: this.DEFAULT_CATEGORIES },
          isSystem: false,
        },
        data: { isSystem: true },
      });

      console.log(`[CategoryService] Categorias padrão sincronizadas para o usuário ${userId} (inseridas: ${missing.join(', ')})`);
    } catch (error) {
      console.error('[CategoryService] Erro ao criar categorias padrão:', error);
    }
  }

  /**
   * Cria uma nova categoria
   */
  static async create(data: CreateCategoryDto) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: data.userId },
      });

      if (!user) {
        throw new Error('Usuário não sincronizado no banco local.');
      }

      // Tenta criar apenas se não existir a categoria com o mesmo nome para o usuário
      const exists = await prisma.category.findUnique({
        where: {
          userId_name: {
            userId: user.id,
            name: data.name,
          },
        },
      });

      if (exists) {
        throw new Error('Já existe uma categoria com este nome.');
      }

      const category = await prisma.category.create({
        data: {
          name: data.name,
          userId: user.id,
          ...(data.color && { color: data.color }),
          ...(data.icon && { icon: data.icon }),
        },
      });

      return category;
    } catch (error: any) {
      console.error('[CategoryService] Erro ao criar categoria:', error);
      throw error;
    }
  }

  /**
   * Lista categorias de um usuário.
   * Garante que categorias padrão faltantes sejam criadas automaticamente (Lazy Seeding).
   */
  static async listByUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return [];
    }

    // Verifica se todas as categorias padrão existem comparando por nome
    const existingNames = (
      await prisma.category.findMany({
        where: { userId: user.id },
        select: { name: true },
      })
    ).map((c) => c.name);

    const hasMissing = this.DEFAULT_CATEGORIES.some(
      (name) => !existingNames.includes(name)
    );

    if (hasMissing) {
      await this.seedDefaultCategories(user.id);
    }

    return await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Atualiza o nome de uma categoria
   */
  static async update(userId: string, id: string, data: UpdateCategoryDto) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não sincronizado.');

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Categoria não encontrada.');
    }

    if (category.userId !== user.id) {
       throw new Error('Permissão negada.');
    }

    // Categorias do sistema: permite alterar cor e ícone, mas não o nome
    if (category.isSystem && data.name && data.name !== category.name) {
      throw new Error('O nome de categorias do sistema não pode ser alterado.');
    }

    const updateData: Record<string, string> = {};
    if (data.name) updateData.name = data.name;
    if (data.color) updateData.color = data.color;
    if (data.icon) updateData.icon = data.icon;

    if (Object.keys(updateData).length === 0) {
      throw new Error('Nenhum campo para atualizar.');
    }

    const result = await prisma.category.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: updateData,
    });

    if (result.count === 0) {
      throw new Error('Categoria não encontrada ou permissão negada.');
    }

    return await prisma.category.findUnique({ where: { id } });
  }

  /**
   * Remove uma categoria
   */
  static async delete(userId: string, id: string) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error('Usuário não sincronizado.');

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Categoria não encontrada.');
    }

    if (category.userId !== user.id) {
       throw new Error('Permissão negada.');
    }

    if (category.isSystem) {
      throw new Error('Categorias do sistema não podem ser apagadas.');
    }

    const result = await prisma.category.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      throw new Error('Categoria não encontrada ou permissão negada.');
    }

    return { id };
  }
}
