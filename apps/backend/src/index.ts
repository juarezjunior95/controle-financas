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

// ─── Health check (antes de qualquer middleware que possa falhar) ───────────
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'controle-financas-backend',
    env: {
      database: !!process.env.DATABASE_URL,
      clerk: !!process.env.CLERK_SECRET_KEY,
    },
  });
});

// ─── Importações condicionais para evitar crash ─────────────────────────────
try {
  const { clerkAuth, requireAuthentication } = require('./middleware/auth.middleware');
  const { AuthController } = require('./modules/auth/auth.controller');
  const { ClientController } = require('./modules/clients/client.controller');

  // Clerk middleware global — anexa auth state em todas as rotas
  app.use(clerkAuth);

  // ─── API Router ──────────────────────────────────────────────────────────
  const apiRouter = express.Router();

  // Rotas de autenticação
  apiRouter.post('/auth/register', AuthController.register);
  apiRouter.post('/auth/login', AuthController.login);
  apiRouter.get('/auth/me', requireAuthentication, AuthController.me);

  // Rotas protegidas
  apiRouter.get('/clients/me', requireAuthentication, ClientController.getProfile);

  // Montar versionamento da API
  app.use('/api/v1', apiRouter);

  console.log('[Backend] Rotas carregadas com sucesso.');
} catch (error) {
  console.error('[Backend] Erro ao carregar módulos:', error);
  
  // Rota de fallback para informar o erro
  app.use('/api/v1/*', (_req, res) => {
    res.status(503).json({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Serviço temporariamente indisponível. Verifique as variáveis de ambiente.',
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

// ─── Iniciar servidor (apenas em ambiente local) ────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3333;
  app.listen(port, () => {
    console.log(`[Backend] Server is running on port ${port}`);
    console.log(`[Backend] API: http://localhost:${port}/api/v1`);
  });
}

// Exporta o app para Vercel Serverless Functions
export default app;
