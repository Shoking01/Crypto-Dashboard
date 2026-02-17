import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting para chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar librerías grandes en chunks propios
          'recharts-vendor': ['recharts'],
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
    // Optimizar el tamaño de los chunks
    chunkSizeWarningLimit: 1000,
  },
  // Preload automático para imports dinámicos
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query'],
  },
})
