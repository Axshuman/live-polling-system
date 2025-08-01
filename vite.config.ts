import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Required for Vercel to resolve assets correctly
  build: {
    outDir: 'dist', // this matches what Vercel expects
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
