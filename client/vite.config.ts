import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // In development the frontend calls /api on the same origin, and Vite forwards it to the API server.
    proxy: {
      '/api': {
        target: process.env['API_PROXY_TARGET'] ?? 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 700,
  },
});
