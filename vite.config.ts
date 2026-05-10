import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: [
          '**/android/app/src/main/assets/public/**',
          '**/dist/**',
        ],
      },
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8787',
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      entries: ['index.html'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (id.includes('motion')) {
              return 'motion';
            }

            if (id.includes('@capacitor')) {
              return 'capacitor';
            }

            return 'vendor';
          },
        },
      },
    },
  };
});
