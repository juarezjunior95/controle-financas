import { Router } from 'express';
import { AiController } from './ai.controller';
import { requireAuthentication } from '../../middleware/auth.middleware';

const aiRoutes = Router();

// Todas as rotas de IA requerem autenticação
aiRoutes.use(requireAuthentication);

aiRoutes.get('/insights', AiController.getInsights);

export { aiRoutes };
