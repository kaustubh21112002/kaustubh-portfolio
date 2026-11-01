import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('clsx')) {
              return 'vendor-core';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-libs';
          }
          if (id.includes('src/components/flagship/')) {
            return 'module-flagship-valuation';
          }
          if (id.includes('src/components/projects/CaseStudyModal') || 
              id.includes('src/components/projects/ITSupportArchitectureInteractive') ||
              id.includes('src/components/projects/StratosDQMatrix')) {
            return 'module-case-studies';
          }
        }
      }
    }
  }
});
