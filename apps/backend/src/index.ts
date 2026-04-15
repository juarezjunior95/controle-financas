import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// ─── Logging de inicialização ───────────────────────────────────────────────
console.log('[Backend] Iniciando...');
console.log('[Backend] NODE_ENV:', process.env.NODE_ENV || 'não definido');
console.log('[Backend] DATABASE_URL:', process.env.DATABASE_URL ? 'configurada' : 'NÃO CONFIGURADA');
console.log('[Backend] CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'configurada' : 'NÃO CONFIGURADA');

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

// ─── Importações e configuração de rotas ────────────────────────────────────
try {
  const { clerkAuth, requireAuthentication } = require('./middleware/auth.middleware');
  const { AuthController } = require('./modules/auth/auth.controller');
  const { ClientController } = require('./modules/clients/client.controller');
  const { TransactionController } = require('./modules/transactions/transaction.controller');
  const { DashboardController } = require('./modules/dashboard/dashboard.controller');
  const { CategoryController } = require('./modules/categories/category.controller');

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

  // Rotas de dashboard
  apiRouter.get('/dashboard/summary', requireAuthentication, DashboardController.getSummary);

  // Rotas de categorias
  apiRouter.post('/categories', requireAuthentication, CategoryController.create);
  apiRouter.get('/categories', requireAuthentication, CategoryController.list);
  apiRouter.put('/categories/:id', requireAuthentication, CategoryController.update);
  apiRouter.delete('/categories/:id', requireAuthentication, CategoryController.delete);

  // Rotas de transações
  apiRouter.post('/transactions', requireAuthentication, TransactionController.create);
  apiRouter.get('/transactions', requireAuthentication, TransactionController.list);
  apiRouter.put('/transactions/:id', requireAuthentication, TransactionController.update);
  apiRouter.delete('/transactions/:id', requireAuthentication, TransactionController.delete);

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
      message: 'Erro interno do servidor.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    },
  });
});

// ─── Iniciar servidor ───────────────────────────────────────────────────────
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`[Backend] Server is running on port ${port}`);
  console.log(`[Backend] API: http://localhost:${port}/api/v1`);
});

// Exporta o app para Vercel Serverless Functions
export default app;
