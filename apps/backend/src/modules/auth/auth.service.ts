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

export class AuthService {
  /**
   * Registra um novo usuário no Clerk e sincroniza no banco local.
   */
  static async signUp(input: SignUpInput) {
    try {
      // Criar usuário no Clerk
      const clerkUser = await clerk.users.createUser({
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
      const signInToken = await clerk.signInTokens.createSignInToken({
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
      console.error('[AuthService] Erro no registro:', error);

      // Tratar erros específicos do Clerk
      if (error?.errors) {
        const clerkErrors = error.errors.map((e: any) => e.longMessage || e.message);
        throw new Error(clerkErrors.join('; '));
      }

      throw new Error('Falha no registro do usuário.');
    }
  }

  /**
   * Autentica um usuário verificando credenciais via Clerk.
   * Após login bem-sucedido, sincroniza dados no banco local.
   */
  static async signIn(input: SignInInput) {
    try {
      // Buscar o usuário pelo email no Clerk
      const users = await clerk.users.getUserList({
        emailAddress: [input.email],
      });

      if (!users.data || users.data.length === 0) {
        throw new Error('Credenciais inválidas.');
      }

      const clerkUser = users.data[0];

      // Verificar a senha do usuário
      const result = await clerk.users.verifyPassword({
        userId: clerkUser.id,
        password: input.password,
      });

      if (!result.verified) {
        throw new Error('Credenciais inválidas.');
      }

      // Sincronizar com banco de dados local (post-auth sync)
      const user = await ClientService.syncFromClerk(clerkUser.id);

      // Gerar um signInToken para o frontend
      const signInToken = await clerk.signInTokens.createSignInToken({
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
      console.error('[AuthService] Erro no login:', error);

      if (error?.message === 'Credenciais inválidas.') {
        throw error;
      }

      if (error?.errors) {
        const clerkErrors = error.errors.map((e: any) => e.longMessage || e.message);
        throw new Error(clerkErrors.join('; '));
      }

      throw new Error('Falha na autenticação.');
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
}
