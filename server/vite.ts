// Vite integration for Express server
// Handles dev middleware and production static file serving

import type { Application, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer, type PluginOption } from 'vite';

const isDev = process.env.COZE_PROJECT_ENV !== 'PROD';

/**
 * Vite dev middleware mode
 */
export async function setupViteMiddleware(app: Application) {
  const vueModule = await import('@vitejs/plugin-vue');
  const vuePlugin = vueModule.default || vueModule;
  
  const vite = await createViteServer({
    configFile: false,
    root: process.cwd(),
    plugins: [vuePlugin() as PluginOption],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
      middlewareMode: true,
      hmr: {
        path: '/hot/vite-hmr',
        port: 6000,
        clientPort: 443,
        timeout: 30000,
      },
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);
  console.log('Vite dev server initialized');
}

/**
 * Production static file serving
 */
export function setupStaticServer(app: Application) {
  const distPath = path.resolve(process.cwd(), 'dist/client');

  if (!fs.existsSync(distPath)) {
    console.error('dist/client folder not found. Please run "pnpm build" first.');
    process.exit(1);
  }

  app.use(express.static(distPath));

  // SPA fallback
  app.use((_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  console.log('Serving static files from dist/client/');
}

/**
 * Setup based on environment
 */
export async function setupVite(app: Application) {
  if (isDev) {
    await setupViteMiddleware(app);
  } else {
    setupStaticServer(app);
  }
}
