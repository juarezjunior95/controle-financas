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
      const existing = await prisma.category.findMany({
        where: { userId },
        select: { name: true },
      });

      const existingNames = new Set(existing.map((c) => c.name));

      const missing = this.DEFAULT_CATEGORIES.filter(
        (name) => !existingNames.has(name)
      );

      if (missing.length === 0) {
        return;
      }

      const getDefaults = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('alimentação')) return { icon: 'restaurant', color: '#ffb59b' };
        if (n.includes('moradia')) return { icon: 'home', color: '#ffe082' };
        if (n.includes('transporte')) return { icon: 'directions_car', color: '#82f9d8' };
        if (n.includes('lazer')) return { icon: 'sports_esports', color: '#f8b0ff' };
        if (n.includes('saúde')) return { icon: 'medical_services', color: '#ff8a80' };
        if (n.includes('educação')) return { icon: 'school', color: '#b39ddb' };
        if (n.includes('salário')) return { icon: 'payments', color: '#82f9d8' };
        if (n.includes('investimentos')) return { icon: 'show_chart', color: '#b0c6ff' };
        return { icon: 'label', color: '#b0c6ff' };
      };

      const data = missing.map((name) => {
        const defaults = getDefaults(name);
        return {
          name,
          userId,
          isSystem: true,
          icon: defaults.icon,
          color: defaults.color,
        };
      });

      await prisma.category.createMany({
        data,
        skipDuplicates: true,
      });

      // Atualiza ícone e cor de categorias do sistema que já existem mas estão sem esses dados
      for (const name of this.DEFAULT_CATEGORIES) {
        const defaults = getDefaults(name);
        await prisma.category.updateMany({
          where: {
            userId,
            name,
            OR: [
              { icon: 'label' },
              { icon: null },
              { color: '#b0c6ff' },
              { color: null }
            ]
          },
          data: {
            icon: defaults.icon,
            color: defaults.color,
            isSystem: true
          }
        });
      }

      console.log(`[CategoryService] Categorias padrão sincronizadas para o usuário ${userId}`);
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

    const linkedTransactions = await prisma.transaction.count({
      where: { categoryId: id },
    });

    if (linkedTransactions > 0) {
      throw new Error('Não é possível excluir esta categoria porque existem transações vinculadas a ela.');
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
