import { prisma } from '../../config/prisma';
import { clerk } from '../../config/clerk';
import { CategoryService } from '../categories/category.service';

interface SyncUserData {
  clerkId: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

function ensureClerkConfigured() {
  if (!clerk) {
    throw new Error('Serviço de autenticação não configurado. Verifique CLERK_SECRET_KEY.');
  }
  return clerk;
}

export class ClientService {
  /**
   * Sincroniza um usuário Clerk com a tabela de usuários local.
   * Usa upsert: cria se não existir, atualiza se já existir.
   * Chave de integração: email do usuário.
   */
  static async syncClient(data: SyncUserData) {
    try {
      console.log('[ClientService] Tentando sincronizar usuário:', data.email);
      
      const user = await prisma.user.upsert({
        where: { email: data.email },
        update: {
          clerkId: data.clerkId,
          displayName: data.displayName,
          avatarUrl: data.avatarUrl,
        },
        create: {
          clerkId: data.clerkId,
          email: data.email,
          displayName: data.displayName,
          avatarUrl: data.avatarUrl,
        },
      });

      console.log('[ClientService] Usuário sincronizado com sucesso:', user.id);

      // Seed das categorias padrão assim que o usuário é sincronizado (criado ou atualizado)
      await CategoryService.seedDefaultCategories(user.id);

      return user;
    } catch (error: any) {
      console.error('[ClientService] Erro ao sincronizar usuário:', JSON.stringify({
        message: error?.message,
        code: error?.code,
        meta: error?.meta,
        name: error?.name,
      }, null, 2));
      
      // Verificar se é erro de tabela não existente
      if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
        throw new Error('Tabela de usuários não existe. Execute as migrations do Prisma.');
      }
      
      const msg = error?.message || 'Erro desconhecido';
      const unreachable =
        typeof msg === 'string' &&
        (msg.includes("Can't reach database server") || msg.includes('P1001'));
      if (unreachable) {
        throw new Error(
          'Falha na sincronização: não foi possível conectar ao banco. Confira se o projeto Supabase está ' +
            'ativo (não pausado), se DATABASE_URL está correta e se a string inclui SSL (ex.: ?sslmode=require). ' +
            `Detalhe: ${msg}`
        );
      }
      throw new Error(`Falha na sincronização: ${msg}`);
    }
  }

  /**
   * Busca um usuário pelo clerkId.
   */
  static async getByClerkId(clerkId: string) {
    try {
      return await prisma.user.findUnique({
        where: { clerkId },
      });
    } catch (error) {
      console.error('[ClientService] Erro ao buscar usuário por clerkId:', error);
      throw new Error('Falha ao buscar dados do usuário.');
    }
  }

  /**
   * Atualiza o nome de exibição do usuário.
   * O clerkId é usado para identificar o usuário.
   */
  static async updateDisplayName(clerkId: string, displayName: string) {
    try {
      const trimmed = displayName.trim();

      if (!trimmed) {
        throw new Error('O nome não pode estar vazio.');
      }

      if (trimmed.length < 2) {
        throw new Error('O nome deve ter pelo menos 2 caracteres.');
      }

      if (trimmed.length > 50) {
        throw new Error('O nome não pode ter mais de 50 caracteres.');
      }

      const user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      const updated = await prisma.user.update({
        where: { clerkId },
        data: { displayName: trimmed },
      });

      console.log('[ClientService] Display name atualizado:', updated.id, '->', trimmed);
      return updated;
    } catch (error: any) {
      console.error('[ClientService] Erro ao atualizar display name:', error);
      throw error;
    }
  }

  /**
   * Busca o saldo inicial do usuário.
   */
  static async getInitialBalance(clerkId: string): Promise<number> {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error('Usuário não encontrado.');
    return Number(user.initialBalance);
  }

  /**
   * Atualiza o saldo inicial do usuário.
   */
  static async updateInitialBalance(clerkId: string, initialBalance: number): Promise<number> {
    if (typeof initialBalance !== 'number' || isNaN(initialBalance)) {
      throw new Error('O saldo inicial deve ser um número válido.');
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error('Usuário não encontrado.');

    const updated = await prisma.user.update({
      where: { clerkId },
      data: { initialBalance },
    });

    return Number(updated.initialBalance);
  }

  /**
   * Sincroniza um usuário com base nos dados retornados pelo Clerk.
   * Busca o user completo no Clerk e faz upsert local.
   */
  static async syncFromClerk(clerkUserId: string) {
    const clerkClient = ensureClerkConfigured();
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      );

      if (!primaryEmail) {
        throw new Error('Usuário Clerk não possui email primário definido.');
      }

      const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ');

      return await this.syncClient({
        clerkId: clerkUser.id,
        email: primaryEmail.emailAddress,
        displayName: fullName || null,
        avatarUrl: clerkUser.imageUrl,
      });
    } catch (error) {
      console.error('[ClientService] Erro ao sincronizar do Clerk:', error);
      throw error;
    }
  }
}
