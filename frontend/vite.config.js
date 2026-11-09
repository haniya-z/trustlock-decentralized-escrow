/**
 * vite.config.js
 * Vite configuration for the TrustLock frontend.
 *
 * TODO: add proxy rules if a local API server is introduced.
 * TODO: configure environment variable prefix (VITE_) for contract addresses.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Allows absolute imports like: import X from '@/components/...'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    open: true, // open browser on `npm run dev`
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

