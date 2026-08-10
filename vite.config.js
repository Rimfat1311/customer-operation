import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:3000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        // v1 endpoints: backend expects /api/v1/... so forward as-is (no rewrite)
        '/api/v1': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('Origin', proxyTarget);
            });
          },
        },
        // Legacy endpoints: backend expects /auth/..., /quiz/..., etc. (strip /api prefix)
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('Origin', proxyTarget);
            });
          },
        },
      },
    },
  };
});
