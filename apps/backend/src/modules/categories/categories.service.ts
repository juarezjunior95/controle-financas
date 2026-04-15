import { prisma } from '../../config/prisma';
import { clerk } from '../../config/clerk';


function ensureClerkConfigured() {
    if (!clerk) {
        throw new Error('Serviço de autenticação não configurado para o servico de categoria. Verifique CLERK_SECRET_KEY.');
    }
    return clerk;
}

export class CategoryService {
    /**
     * Buscar usuário local pelo clerkId
     */
    private static async getUserByClerkId(clerkId: string) {
        return prisma.user.findUnique({
            where: { clerkId },
        });
    }

    /**
     * Criar categoria
     */
    static async create(clerkId: string, name: string) {
        const user = await this.getUserByClerkId(clerkId);

        if (!user) {
            throw new Error('Usuário não encontrado no banco local.');
        }

        const category = await prisma.category.create({
            data: {
                name,
                userId: user.id,
                isSystem: false,
            },
        });

        return category;
    }

    /**
     * Listar categorias (usuário + sistema)
     */
    static async list(clerkId: string) {
        const user = await this.getUserByClerkId(clerkId);

        if (!user) {
            throw new Error('Usuário não encontrado no banco local.');
        }

        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { userId: user.id },
                    { isSystem: true },
                ],
            },
            orderBy: {
                name: 'asc',
            },
        });

        return categories;
    }
}

export { prisma };

