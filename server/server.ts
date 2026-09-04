// Express server with Vite integration
// Handles API routes and serves frontend in dev/prod modes

import 'dotenv/config';
import { createServer, type Server } from 'http';
import express from 'express';
import router from './routes/index';
import { setupVite } from './vite';
import { getUploadRootDir } from './lib/config';

// There is exactly ONE HTTP listener in the whole app (see server.listen below).
// Port resolution:
//   - Production (Aliyun, COZE_PROJECT_ENV=PROD): use PORT, default 8080.
//     It deliberately does NOT read DEPLOY_RUN_PORT, so it can never fall back to 5000.
//   - Dev (Coze sandbox): use PORT -> DEPLOY_RUN_PORT (injected, usually 5000) -> 5000.
const isDev = process.env.COZE_PROJECT_ENV !== 'PROD';
const DEFAULT_DEV_PORT = 5000;
const DEFAULT_PROD_PORT = 8080;

const portStr =
  process.env.PORT ||
  (isDev ? process.env.DEPLOY_RUN_PORT : undefined) ||
  String(isDev ? DEFAULT_DEV_PORT : DEFAULT_PROD_PORT);
const port = Number.parseInt(portStr, 10);

if (Number.isNaN(port) || port <= 0 || port > 65535) {
  console.error(`[fatal] Invalid PORT value: "${portStr}". Must be 1-65535.`);
  process.exit(1);
}
const app = express();
const server = createServer(app);

async function startServer(): Promise<Server> {
  // Load config from the database (upload root dir) and ensure it exists.
  const uploadRoot = await getUploadRootDir();
  console.log(`[config] upload root directory: ${uploadRoot}`);

  // Request logging (dev only)
  if (isDev) {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${ms}ms`);
      });
      next();
    });
  }

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve built-in static product images
  app.use('/images', express.static('public/images'));

  // Serve locally uploaded product images from the configured root directory
  app.use('/uploads', express.static(uploadRoot));

  // Register API routes
  app.use(router);

  // Integrate Vite (dev) or static file serving (prod)
  await setupVite(app);

  // Global error handling (must have 4 params for Express to recognize it)
  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Server error:', err);
    const status = 'status' in err ? (err as { status?: number }).status ?? 500 : 500;
    res.status(status).json({
      error: err.message || 'Internal server error',
    });
  });

  server.once('error', err => {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'EADDRINUSE') {
      console.error(
        `[fatal] Port ${port} is already in use (EADDRINUSE). ` +
          `Stop the other process or set a different PORT in .env, then restart.`
      );
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port} [${isDev ? 'DEV' : 'PROD'}]`);
  });

  return server;
}

startServer();
