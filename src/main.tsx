/**
 * Punto de entrada de la aplicación
 * Configura React Query y renderiza la aplicación
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import App from './App.tsx';

/**
 * Configuración del QueryClient de React Query
 * 
 * Mejores prácticas aplicadas:
 * - client-swr-dedup: Stale-while-revalidate por defecto
 * - Configuración de caché optimizada
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" (no se revalidan)
      staleTime: 60 * 1000, // 1 minuto
      // Tiempo que los datos permanecen en caché inactivos
      gcTime: 5 * 60 * 1000, // 5 minutos
      // Reintentos automáticos
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // No refetchear al volver a la pestaña por defecto
      refetchOnWindowFocus: false,
      // Mantener datos anteriores mientras se cargan nuevos
      placeholderData: (previousData: unknown) => previousData,
    },
    mutations: {
      // Reintentos para mutations
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <App />
      </ThemeProvider>
      {/* React Query Devtools - solo en desarrollo */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
);
