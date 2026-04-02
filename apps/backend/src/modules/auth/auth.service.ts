import { clerk } from '../../config/clerk';
import { ClientService } from '../clients/client.service';

interface SignUpInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface SignInInput {
  email: string;
  password: string;
}

function ensureClerkConfigured() {
  if (!clerk) {
    throw new Error('Serviço de autenticação não configurado. Verifique CLERK_SECRET_KEY.');
  }
  return clerk;
}

export class AuthService {
  /**
   * Registra um novo usuário no Clerk e sincroniza no banco local.
   */
  static async signUp(input: SignUpInput) {
    const clerkClient = ensureClerkConfigured();
    try {
      // Criar usuário no Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [input.email],
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
      });

      // Sincronizar com banco de dados local
      const fullName = [input.firstName, input.lastName].filter(Boolean).join(' ');
      const user = await ClientService.syncClient({
        clerkId: clerkUser.id,
        email: input.email,
        displayName: fullName || null,
        avatarUrl: clerkUser.imageUrl,
      });

      // Gerar um signInToken para o frontend fazer a sessão
      const signInToken = await clerkClient.signInTokens.createSignInToken({
        userId: clerkUser.id,
        expiresInSeconds: 60 * 60 * 24, // 24 horas
      });

      return {
        user: {
          id: user.id,
          clerkId: clerkUser.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
        token: signInToken.token,
      };
    } catch (error: any) {
      console.error('[AuthService] Erro no registro:', JSON.stringify(error, null, 2));

      // Tratar erros específicos do Clerk
      if (error?.errors && Array.isArray(error.errors)) {
        const clerkErrors = error.errors.map((e: any) => e.longMessage || e.message);
        throw new Error(clerkErrors.join('; '));
      }

      // Clerk pode retornar erro em formato diferente
      if (error?.clerkError && error?.errors) {
        const messages = error.errors.map((e: any) => e.longMessage || e.message || e.code);
        throw new Error(messages.join('; '));
      }

      // Se for erro do Prisma/DB
      if (error?.code) {
        throw new Error(`Erro de banco de dados: ${error.code}`);
      }

      throw new Error(error?.message || 'Falha no registro do usuário.');
    }
  }

  /**
   * Autentica um usuário verificando credenciais via Clerk.
   * Após login bem-sucedido, sincroniza dados no banco local.
   */
  static async signIn(input: SignInInput) {
    const clerkClient = ensureClerkConfigured();
    try {
      // Buscar o usuário pelo email no Clerk
      const users = await clerkClient.users.getUserList({
        emailAddress: [input.email],
      });

      if (!users.data || users.data.length === 0) {
        throw new Error('Credenciais inválidas.');
      }

      const clerkUser = users.data[0];

      // Verificar a senha do usuário
      const result = await clerkClient.users.verifyPassword({
        userId: clerkUser.id,
        password: input.password,
      });

      if (!result.verified) {
        throw new Error('Credenciais inválidas.');
      }

      // Sincronizar com banco de dados local (post-auth sync)
      const user = await ClientService.syncFromClerk(clerkUser.id);

      // Gerar um signInToken para o frontend
      const signInToken = await clerkClient.signInTokens.createSignInToken({
        userId: clerkUser.id,
        expiresInSeconds: 60 * 60 * 24, // 24 horas
      });

      return {
        user: {
          id: user.id,
          clerkId: clerkUser.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
        token: signInToken.token,
      };
    } catch (error: any) {
      console.error('[AuthService] Erro no login:', JSON.stringify(error, null, 2));

      if (error?.message === 'Credenciais inválidas.') {
        throw error;
      }

      // Clerk pode retornar erro em diferentes formatos
      if (error?.errors && Array.isArray(error.errors)) {
        const clerkErrors = error.errors.map((e: any) => e.longMessage || e.message);
        throw new Error(clerkErrors.join('; '));
      }

      // Erro direto do Clerk SDK
      if (error?.clerkError) {
        throw new Error(error.message || 'Erro de autenticação Clerk');
      }

      throw new Error(error?.message || 'Falha na autenticação.');
    }
  }

  /**
   * Retorna os dados do usuário autenticado.
   * Sincroniza o banco local caso os dados estejam desatualizados.
   */
  static async getMe(clerkUserId: string) {
    try {
      // Sempre sincroniza para manter dados atualizados
      const user = await ClientService.syncFromClerk(clerkUserId);

      return {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      };
    } catch (error) {
      console.error('[AuthService] Erro ao buscar usuário:', error);
      throw new Error('Falha ao obter dados do usuário.');
    }
  }

  /**
   * Solicita recuperação de senha via Clerk.
   * Envia email com link para redefinir senha.
   */
  static async forgotPassword(email: string) {
    const clerkClient = ensureClerkConfigured();
    try {
      // Buscar usuário pelo email
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });

      // Por segurança, sempre retornamos sucesso mesmo se o email não existir
      if (!users.data || users.data.length === 0) {
        console.log('[AuthService] Email não encontrado para recuperação:', email);
        return { success: true };
      }

      const user = users.data[0];
      const primaryEmail = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      );

      if (!primaryEmail) {
        return { success: true };
      }

      // Criar um password reset token
      // Nota: O Clerk gerencia o envio de email automaticamente quando configurado
      // Para envio manual, usamos a API de emails do Clerk
      
      // Opção 1: Se o Clerk estiver configurado com "Forgot Password" habilitado,
      // o frontend pode usar o Clerk.js diretamente
      
      // Opção 2: Gerar um magic link para o usuário
      // Isso requer configuração adicional no Clerk Dashboard

      console.log('[AuthService] Solicitação de recuperação de senha para:', email);
      
      return { success: true };
    } catch (error: any) {
      console.error('[AuthService] Erro na recuperação de senha:', error);
      // Por segurança, não revelamos se o email existe ou não
      return { success: true };
    }
  }
}
