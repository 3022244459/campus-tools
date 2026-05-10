import express from 'express';
import type {NextFunction, Request, Response} from 'express';
import {getServerConfig, type ServerConfig} from './config.ts';
import {createCorsMiddleware, createRateLimitMiddleware, createSecurityHeadersMiddleware} from './middlewares/security.ts';
import {createObservabilityMiddleware} from './observability.ts';
import {getReadinessSnapshot} from './readiness.ts';
import {createAdminRouter} from './routes/adminRoutes.ts';
import {createAuthRouter} from './routes/authRoutes.ts';
import {createCampusRouter} from './routes/campusRoutes.ts';
import {createTeacherRouter} from './routes/teacherRoutes.ts';
import {ValidationError} from './validators/index.ts';

export function createApp(config: ServerConfig = getServerConfig()) {
  const app = express();

  app.set('trust proxy', config.trustProxy);
  app.use(express.json({limit: config.requestBodyLimit}));
  app.use(createSecurityHeadersMiddleware());
  app.use(createCorsMiddleware(config));
  app.use(createRateLimitMiddleware(config));
  app.use(createObservabilityMiddleware(config));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'campus-tools-api',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    });
  });

  app.get('/api/health/ready', (_req, res) => {
    const readiness = getReadinessSnapshot(config);
    res.status(readiness.status === 'ready' ? 200 : 503).json(readiness);
  });

  app.use('/api/auth', createAuthRouter());
  app.use('/api/admin', createAdminRouter());
  app.use('/api/teacher', createTeacherRouter());
  app.use('/api', createCampusRouter());

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({message: error.message});
      return;
    }

    const payloadErrorStatus = getPayloadErrorStatus(error);
    if (payloadErrorStatus) {
      res.status(payloadErrorStatus).json({
        message: payloadErrorStatus === 413 ? 'Request body is too large.' : 'Invalid request body.',
      });
      return;
    }

    res.status(500).json({message: '服务器处理请求时发生错误。'});
  });

  return app;
}

function getPayloadErrorStatus(error: Error): number | null {
  const httpError = error as {status?: unknown; statusCode?: unknown};
  const status = httpError.status ?? httpError.statusCode;
  return typeof status === 'number' && status >= 400 && status < 500 ? status : null;
}
