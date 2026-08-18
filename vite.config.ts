import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import app from './src/server/index';

function expressPlugin(): Plugin {
  return {
    name: 'express-backend',
    configureServer(server) {
      server.middlewares.use(app);
    }
  };
}

export default defineConfig({
  plugins: [react(), expressPlugin()],
  server: {
    port: 5174,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
