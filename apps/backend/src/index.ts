import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { logger } from './config/logger';
import { httpLogger } from './middleware/logger.middleware';

const app = express();

// ─── Logging de inicialização ───────────────────────────────────────────────
logger.info('Iniciando Backend...');
logger.info({ nodeEnv: process.env.NODE_ENV }, 'Environment');
logger.info({ configured: !!process.env.DATABASE_URL }, 'Database URL');
logger.info({ configured: !!process.env.CLERK_SECRET_KEY }, 'Clerk Secret Key');

// Middleware global de logging HTTP
app.use(httpLogger);

// CORS — permite o frontend acessar a API
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(express.json());

// Variável para armazenar erro de inicialização
let initError: Error | null = null;

// ─── Health check (antes de qualquer middleware que possa falhar) ───────────
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    status: initError ? 'error' : 'ok',
    timestamp: new Date().toISOString(),
    service: 'controle-financas-backend',
    env: {
      database: !!process.env.DATABASE_URL,
      clerk: !!process.env.CLERK_SECRET_KEY,
    },
    initError: initError ? initError.message : null,
  });
});

// ─── Migrate endpoint (protegido por MIGRATE_SECRET) ───────────────────────
// Usa o prisma já configurado (com SSL correto) para aplicar a migration via SQL raw.
// Uso: POST /api/v1/migrate  com header  x-migrate-secret: <MIGRATE_SECRET>
app.post('/api/v1/migrate', async (_req, res) => {
  const secret = process.env.MIGRATE_SECRET;
  if (!secret || _req.headers['x-migrate-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { prisma } = require('./config/prisma');
    console.log('[Migrate] Aplicando migration SQL via prisma.$executeRawUnsafe...');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "initial_balance" DECIMAL(15,2) NOT NULL DEFAULT 0;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        id VARCHAR(36) NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        finished_at TIMESTAMPTZ,
        migration_name VARCHAR(255) NOT NULL,
        logs TEXT,
        rolled_back_at TIMESTAMPTZ,
        started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        applied_steps_count INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY (id)
      );
    `);

    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count)
      SELECT gen_random_uuid()::text, 'manual', now(), '20260413000000_add_initial_balance_to_user', 1
      WHERE NOT EXISTS (
        SELECT 1 FROM "_prisma_migrations"
        WHERE migration_name = '20260413000000_add_initial_balance_to_user'
      );
    `);

    console.log('[Migrate] Migration aplicada com sucesso.');
    res.status(200).json({ ok: true, message: 'Migration aplicada com sucesso.' });
  } catch (err: any) {
    console.error('[Migrate] Erro:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── Importações e configuração de rotas ────────────────────────────────────
try {
  const { clerkAuth, requireAuthentication } = require('./middleware/auth.middleware');
  const { AuthController } = require('./modules/auth/auth.controller');
  const { ClientController } = require('./modules/clients/client.controller');
  const { TransactionController } = require('./modules/transactions/transaction.controller');
  const { DashboardController } = require('./modules/dashboard/dashboard.controller');
  const { CategoryController } = require('./modules/categories/category.controller');
  const { GoalController } = require('./modules/goals/goal.controller');
  const { aiRoutes } = require('./modules/ai/ai.routes');

  // Clerk middleware global — anexa auth state em todas as rotas
  app.use(clerkAuth);

  // ─── API Router ──────────────────────────────────────────────────────────
  const apiRouter = express.Router();

  // Rotas de autenticação
  apiRouter.post('/auth/register', AuthController.register);
  apiRouter.post('/auth/login', AuthController.login);
  apiRouter.post('/auth/forgot-password', AuthController.forgotPassword);
  apiRouter.get('/auth/me', requireAuthentication, AuthController.me);

  // Rotas protegidas
  apiRouter.get('/clients/me', requireAuthentication, ClientController.getProfile);
  apiRouter.put('/users/profile', requireAuthentication, ClientController.updateProfile);
  apiRouter.get('/users/initial-balance', requireAuthentication, ClientController.getInitialBalance);
  apiRouter.put('/users/initial-balance', requireAuthentication, ClientController.updateInitialBalance);

  // Rotas de dashboard
  apiRouter.get('/dashboard/summary', requireAuthentication, DashboardController.getSummary);

  // Rotas de categorias
  apiRouter.post('/categories', requireAuthentication, CategoryController.create);
  apiRouter.get('/categories/stats', requireAuthentication, CategoryController.listWithStats);
  apiRouter.get('/categories', requireAuthentication, CategoryController.list);
  apiRouter.put('/categories/:id', requireAuthentication, CategoryController.update);
  apiRouter.delete('/categories/:id', requireAuthentication, CategoryController.delete);

  // Rotas de transações
  apiRouter.post('/transactions', requireAuthentication, TransactionController.create);
  apiRouter.get('/transactions', requireAuthentication, TransactionController.list);
  apiRouter.put('/transactions/:id', requireAuthentication, TransactionController.update);
  apiRouter.delete('/transactions/:id', requireAuthentication, TransactionController.delete);

  // Rotas de metas (Goals)
  apiRouter.post('/goals', requireAuthentication, GoalController.create);
  apiRouter.get('/goals', requireAuthentication, GoalController.list);
  apiRouter.get('/goals/:id', requireAuthentication, GoalController.getById);
  apiRouter.put('/goals/:id', requireAuthentication, GoalController.update);
  apiRouter.delete('/goals/:id', requireAuthentication, GoalController.delete);
  apiRouter.patch('/goals/:id/progress', requireAuthentication, GoalController.updateProgress);

  // Rotas de IA
  apiRouter.use('/ai', aiRoutes);

  // Montar versionamento da API
  app.use('/api/v1', apiRouter);

  console.log('[Backend] Rotas carregadas com sucesso.');
} catch (error: any) {
  initError = error;
  console.error('[Backend] Erro ao carregar módulos:', error);
  
  // Rota de fallback para informar o erro
  app.use('/api/v1/*', (_req, res) => {
    res.status(503).json({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Serviço temporariamente indisponível. Verifique as variáveis de ambiente.',
        details: initError?.message,
        stack: process.env.NODE_ENV !== 'production' ? initError?.stack : undefined,
      },
    });
  });
}

// ─── Error Handler global ──────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server] Erro não tratado:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro inesperado em nosso servidor.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    },
  });
});

// ─── Iniciar servidor ───────────────────────────────────────────────────────
const port = process.env.PORT || 3333;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`API: http://localhost:${port}/api/v1`);
  });
}

// Exporta o app para Vercel Serverless Functions
export default app;
