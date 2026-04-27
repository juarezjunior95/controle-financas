import { Request, Response } from 'express';
import { ClientService } from './client.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ClientController {
  /**
   * GET /api/v1/clients/me
   * Retorna o perfil do cliente autenticado.
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;

      if (!userId) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' },
        });
        return;
      }

      const cliente = await ClientService.getByClerkId(userId);

      if (!cliente) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Perfil do cliente não encontrado.' },
        });
        return;
      }

      res.json({ data: cliente });
    } catch (error) {
      console.error('[ClientController] Erro ao buscar perfil:', error);
      res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao buscar perfil.' },
      });
    }
  }

  /**
   * GET /api/v1/users/initial-balance
   * Retorna o saldo inicial do usuário autenticado.
   */
  static async getInitialBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      if (!userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const initialBalance = await ClientService.getInitialBalance(userId);
      res.json({ data: { initialBalance } });
    } catch (error: any) {
      console.error('[ClientController] Erro ao buscar saldo inicial:', error);
      if (error.message === 'Usuário não encontrado.') {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: error.message } });
        return;
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao buscar saldo inicial.' } });
    }
  }

  /**
   * PUT /api/v1/users/initial-balance
   * Atualiza o saldo inicial do usuário autenticado.
   */
  static async updateInitialBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      if (!userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const { initialBalance } = req.body;

      if (initialBalance === undefined || initialBalance === null) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'O campo "initialBalance" é obrigatório.' },
        });
        return;
      }

      const parsed = Number(initialBalance);
      if (isNaN(parsed)) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'O saldo inicial deve ser um número válido.' },
        });
        return;
      }

      const updated = await ClientService.updateInitialBalance(userId, parsed);
      res.json({ data: { initialBalance: updated }, message: 'Saldo inicial atualizado com sucesso.' });
    } catch (error: any) {
      console.error('[ClientController] Erro ao atualizar saldo inicial:', error);
      if (error.message === 'Usuário não encontrado.' || error.message === 'O saldo inicial deve ser um número válido.') {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.message } });
        return;
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao atualizar saldo inicial.' } });
    }
  }

  /**
   * PUT /api/v1/users/profile
   * Atualiza o nome de exibição do usuário autenticado.
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;

      if (!userId) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Autenticação é obrigatória.' },
        });
        return;
      }

      const { display_name } = req.body;

      if (display_name === undefined || display_name === null) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'O campo "display_name" é obrigatório.',
          },
        });
        return;
      }

      const user = await ClientService.updateDisplayName(userId, display_name);

      res.json({
        data: {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
        message: 'Nome atualizado com sucesso.',
      });
    } catch (error: any) {
      console.error('[ClientController] Erro ao atualizar perfil:', error);

      // Erros de validação do service
      const validationErrors = [
        'O nome não pode estar vazio.',
        'O nome deve ter pelo menos 2 caracteres.',
        'O nome não pode ter mais de 50 caracteres.',
      ];

      if (validationErrors.includes(error.message)) {
        res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: error.message },
        });
        return;
      }

      if (error.message === 'Usuário não encontrado.') {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: error.message },
        });
        return;
      }

      res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao atualizar perfil.' },
      });
    }
  }

  /**
   * PUT /api/v1/users/ai-config
   * Atualiza a configuração de IA do usuário (Gemini API Key).
   */
  static async updateAiConfig(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).auth?.userId;
      if (!userId) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.' } });
        return;
      }

      const { geminiApiKey } = req.body;

      // Pode ser null (para resetar/remover) ou uma string
      const updated = await ClientService.updateGeminiApiKey(userId, geminiApiKey || null);

      res.json({
        data: { geminiApiKey: updated },
        message: 'Configuração de IA atualizada com sucesso.',
      });
    } catch (error: any) {
      console.error('[ClientController] Erro ao atualizar config de IA:', error);
      if (error.message === 'Usuário não encontrado.') {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: error.message } });
        return;
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno ao atualizar configuração de IA.' } });
    }
  }
}
