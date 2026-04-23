import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkAuth, requireAuthentication } from './middleware/auth.middleware';
import { HealthController } from './modules/health/health.controller';
import { AuthController } from './modules/auth/auth.controller';
import { ClientController } from './modules/clients/client.controller';
import { DashboardController } from './modules/dashboard/dashboard.controller';

const app = express();

console.log('[Backend] DATABASE_URL carregada:', process.env.DATABASE_URL ? 'Sim (mascarada)' : 'Não');
if (!process.env.DATABASE_URL) {
  console.warn('[Backend] AVISO: DATABASE_URL não foi encontrada!');
}

// CORS — permite o frontend acessar a API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Clerk middleware global — anexa auth state em todas as rotas
app.use(clerkAuth);

// ─── API Router ────────────────────────────────────────────────────────────
const apiRouter = express.Router();

// Rotas públicas
apiRouter.get('/health', HealthController.check);
apiRouter.post('/auth/register', AuthController.register);
apiRouter.post('/auth/login', AuthController.login);

// Rotas protegidas (exigem Bearer token válido)
apiRouter.get('/auth/me', requireAuthentication, AuthController.me);
apiRouter.get('/clients/me', requireAuthentication, ClientController.getProfile);
apiRouter.get('/dashboard/summary', requireAuthentication, DashboardController.getSummary);

// Montar versionamento da API
app.use('/api/v1', apiRouter);

// ─── Error Handler global ──────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server] Erro não tratado:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor.',
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
