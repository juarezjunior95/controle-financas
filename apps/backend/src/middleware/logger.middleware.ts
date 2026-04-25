import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';
import { Request, Response } from 'express';

// Middleware que intercepta e loga todas as requisições HTTP
export const httpLogger = pinoHttp({
  logger,
  genReqId: function (req: Request, res: Response) {
    // Se o header já vier do Vercel/Cloudflare, usa ele, senão gera um UUID
    const reqId = req.headers['x-request-id'] || uuidv4();
    res.setHeader('X-Request-Id', reqId);
    return reqId;
  },
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },
  customProps: function (req, res) {
    // Tenta extrair o userId se foi setado pelo middleware de autenticação
    const authObj = (req as any).auth;
    return {
      userId: authObj ? authObj.userId : undefined,
    };
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      // Não logar headers completos por segurança
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
