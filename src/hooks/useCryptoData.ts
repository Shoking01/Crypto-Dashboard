/**
 * Hook para obtener datos de criptomonedas
 * Usa React Query para caching, deduplicación y revalidación automática
 * 
 * Mejores prácticas aplicadas:
 * - client-swr-dedup: React Query maneja deduplicación automática
 * - rerender-derived-state: Computaciones derivadas en el render
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCryptocurrencies, withRetry } from '../services/coingeckoApi';
import { COINGECKO_CONFIG } from '../utils/constants';
import type { Cryptocurrency } from '../types';

/**
 * Query key para criptomonedas
 */
export const cryptoKeys = {
  all: ['cryptocurrencies'] as const,
  lists: () => [...cryptoKeys.all, 'list'] as const,
  list: (page: number, perPage: number) => 
    [...cryptoKeys.lists(), { page, perPage }] as const,
  details: () => [...cryptoKeys.all, 'detail'] as const,
  detail: (id: string) => [...cryptoKeys.details(), id] as const,
};

/**
 * Hook para obtener la lista de criptomonedas
 * 
 * @param page - Número de página (default: 1)
 * @param perPage - Cantidad por página (default: 50)
 * @returns Query result con datos, estado de carga y error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCryptoData(1, 50);
 * ```
 */
export function useCryptoData(
  page: number = 1,
  perPage: number = COINGECKO_CONFIG.DEFAULT_PER_PAGE
) {
  return useQuery<Cryptocurrency[], Error>({
    queryKey: cryptoKeys.list(page, perPage),
    queryFn: () => withRetry(() => fetchCryptocurrencies(page, perPage)),
    staleTime: COINGECKO_CONFIG.REFRESH_INTERVAL - 5000, // Un poco menos que el refresh
    refetchInterval: COINGECKO_CONFIG.REFRESH_INTERVAL,
    refetchOnWindowFocus: false, // No refrescar al volver a la pestaña para ahorrar requests
    retry: false, // Manejamos el retry manualmente en withRetry
    select: (data) => {
      // Transformar datos si es necesario
      // Por ejemplo, agregar campo calculado o filtrar
      return data;
    },
  });
}

/**
 * Hook para obtener datos de criptomonedas con opciones personalizadas
 * Útil cuando necesitas control total sobre el comportamiento
 * 
 * @param options - Opciones adicionales de configuración
 * @returns Query result
 */
export function useCryptoDataWithOptions(
  page: number = 1,
  perPage: number = COINGECKO_CONFIG.DEFAULT_PER_PAGE,
  options: {
    enabled?: boolean;
    refetchInterval?: number | false;
    staleTime?: number;
  } = {}
) {
  return useQuery<Cryptocurrency[], Error>({
    queryKey: cryptoKeys.list(page, perPage),
    queryFn: () => withRetry(() => fetchCryptocurrencies(page, perPage)),
    staleTime: options.staleTime ?? COINGECKO_CONFIG.REFRESH_INTERVAL - 5000,
    refetchInterval: options.refetchInterval ?? COINGECKO_CONFIG.REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: options.enabled ?? true,
  });
}

/**
 * Hook optimizado para obtener solo el top de criptomonedas
 * Útil para widgets o vistas resumidas
 * 
 * @param limit - Cantidad de criptos a mostrar (default: 10)
 * @returns Query result con top N criptomonedas
 */
export function useTopCryptocurrencies(limit: number = 10) {
  return useCryptoData(1, limit);
}
