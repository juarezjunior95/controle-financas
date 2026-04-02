import { prisma } from '../../config/prisma';
import { clerk } from '../../config/clerk';

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
      
      throw new Error(`Falha na sincronização: ${error?.message || 'Erro desconhecido'}`);
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
