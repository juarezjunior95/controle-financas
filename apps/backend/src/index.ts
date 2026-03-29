import express from 'express';
import cors from 'cors';
import { HealthController } from './modules/health/health.controller';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Main API Router
const apiRouter = express.Router();

// Health Check Route
apiRouter.get('/health', HealthController.check);

// Mount API version
app.use('/api/v1', apiRouter);

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`[Backend] Server is running on port ${port}`);
  });
}

export default app;
