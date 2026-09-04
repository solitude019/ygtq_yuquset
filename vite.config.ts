import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// In this project Express handles both the API (/api) and the Vite dev
// middleware on a single port (5000, see server/vite.ts). Therefore there is
// NO separate Vite dev-server proxy to another backend. Setting a proxy or a
// fixed HMR port breaks hot reload / connectivity behind the preview tunnel,
// so the Vite server config is intentionally minimal here.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  build: {
    outDir: 'dist/client',
  },
});
