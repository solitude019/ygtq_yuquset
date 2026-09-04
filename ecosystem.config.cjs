// pm2 process configuration for the Yu Sports production app.
//
// Why node + tsx CLI instead of `pnpm start:prod`:
//   - pm2 directly manages a single Node process (no pnpm wrapper, no orphaned tsx children).
//   - Avoids the pnpm `.bin/tsx` symlink being mis-resolved by pm2
//     (which caused `ERR_MODULE_NOT_FOUND ... /tsx`).
//
// Usage on the server (run from the project root):
//   pm2 start ecosystem.config.cjs
//   pm2 save
//   pm2 startup
//
// Reload after code/config changes:
//   pm2 restart ygtq_yuquest --update-env
module.exports = {
  apps: [
    {
      name: 'ygtq_yuquest',
      // Run tsx's CLI through node directly; cwd below makes paths deterministic.
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'server/server.ts',
      interpreter: 'node',
      cwd: __dirname,
      env: {
        COZE_PROJECT_ENV: 'PROD',
        // PORT is read from .env by the app (dotenv). Default fallback in code is 8080.
        NODE_ENV: 'production',
      },
      max_restarts: 10,
      restart_delay: 3000,
      autorestart: true,
      // Single instance; the app binds one HTTP port (default 8080).
      instances: 1,
      exec_mode: 'fork',
      out_file: '/root/.pm2/logs/ygtq-yuquest-out.log',
      error_file: '/root/.pm2/logs/ygtq-yuquest-error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
