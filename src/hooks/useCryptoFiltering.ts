/**
 * Hook useCryptoFiltering - Arquitectura de filtrado optimizado
 * 
 * Flujo:
 * 1. ETAPA 1: Filtrado client-side con datos locales
 * 2. ETAPA 2: Si resultados < MIN_RESULTS_THRESHOLD → API call
 * 3. ETAPA 3: Cache con React Query (2 minutos TTL)
 * 
 * Mejores prácticas aplicadas:
 * - client-swr-dedup: React Query maneja deduplicación
 * - memoization: useMemo para cálculos derivados
 * - early-returns: Para casos de borde
 */

import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { withRetry, fetchCryptocurrencies } from '../services/coingeckoApi';
import { FILTER_CONFIG, COINGECKO_CONFIG } from '../utils/constants';
import type { 
  Cryptocurrency, 
  FilterType, 
  FilteringState,
  FilteringOptions 
} from '../types';

/**
 * Query key para datos filtrados
 */
export const filteredCryptoKeys = {
  all: ['filtered-cryptocurrencies'] as const,
  byFilter: (filterType: FilterType) => 
    [...filteredCryptoKeys.all, filterType] as const,
};

/**
 * Hook para filtrar criptomonedas con arquitectura de dos etapas
 * 
 * @param allCryptos - Lista completa de criptomonedas disponibles localmente
 * @param filterType - Tipo de filtro a aplicar
 * @param options - Opciones de configuración
 * @returns Datos filtrados y estado del filtrado
 * 
 * @example
 * ```tsx
 * const { 
 *   filteredCryptos, 
 *   isLoading, 
 *   filteringState,
 *   refresh 
 * } = useCryptoFiltering(cryptos, 'winners');
 * ```
 */
export function useCryptoFiltering(
  allCryptos: Cryptocurrency[],
  filterType: FilterType = 'all',
  options: Partial<FilteringOptions> = {}
) {
  // Opciones con valores por defecto
  const config = useMemo(() => ({
    minResultsThreshold: options.minResultsThreshold ?? FILTER_CONFIG.MIN_RESULTS_THRESHOLD,
    cacheTime: options.cacheTime ?? FILTER_CONFIG.CACHE_TIME,
    dynamicThresholdPercentage: options.dynamicThresholdPercentage ?? FILTER_CONFIG.DYNAMIC_THRESHOLD_PERCENTAGE,
  }), [options]);

  const queryClient = useQueryClient();

  /**
   * ETAPA 1: Filtrado client-side
   * Calcula el umbral dinámico y filtra los datos locales
   */
  const { clientFiltered, threshold } = useMemo(() => {
    if (!allCryptos || allCryptos.length === 0) {
      return { clientFiltered: [], threshold: 0 };
    }

    if (filterType === 'all') {
      return { clientFiltered: allCryptos, threshold: 0 };
    }

    // Calcular umbral dinámico (ej: top 10%)
    const thresholdIndex = Math.ceil(allCryptos.length * config.dynamicThresholdPercentage);
    
    let sorted: Cryptocurrency[] = [];
    let calculatedThreshold = 0;

    switch (filterType) {
      case 'winners':
        // Ordenar por cambio 24h descendente y tomar top X%
        sorted = [...allCryptos].sort((a, b) => 
          (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
        );
        calculatedThreshold = sorted[thresholdIndex]?.price_change_percentage_24h ?? 0;
        break;

      case 'losers':
        // Ordenar por cambio 24h ascendente y tomar bottom X%
        sorted = [...allCryptos].sort((a, b) => 
          (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0)
        );
        calculatedThreshold = sorted[thresholdIndex]?.price_change_percentage_24h ?? 0;
        break;

      case 'volume':
        // Ordenar por volumen descendente y tomar top X%
        sorted = [...allCryptos].sort((a, b) => b.total_volume - a.total_volume);
        calculatedThreshold = sorted[thresholdIndex]?.total_volume ?? 0;
        break;

      default:
        return { clientFiltered: allCryptos, threshold: 0 };
    }

    // Filtrar según el umbral calculado
    let filtered: Cryptocurrency[] = [];
    
    switch (filterType) {
      case 'winners':
        filtered = allCryptos.filter(c => 
          (c.price_change_percentage_24h ?? 0) >= calculatedThreshold && 
          (c.price_change_percentage_24h ?? 0) > 0
        );
        break;

      case 'losers':
        filtered = allCryptos.filter(c => 
          (c.price_change_percentage_24h ?? 0) <= calculatedThreshold && 
          (c.price_change_percentage_24h ?? 0) < 0
        );
        break;

      case 'volume':
        filtered = allCryptos.filter(c => c.total_volume >= calculatedThreshold);
        break;
    }

    return { clientFiltered: filtered, threshold: calculatedThreshold };
  }, [allCryptos, filterType, config.dynamicThresholdPercentage]);

  /**
   * Determinar si necesitamos hacer API call
   * Si hay suficientes resultados del filtrado client-side, no hacemos API call
   */
  const needsApiCall = useMemo(() => {
    if (filterType === 'all') return false;
    return clientFiltered.length < config.minResultsThreshold;
  }, [clientFiltered.length, config.minResultsThreshold, filterType]);

  /**
   * ETAPA 2 & 3: API call con cache (solo si es necesario)
   */
  const { 
    data: apiData, 
    isLoading: isApiLoading, 
    error: apiError,
    refetch 
  } = useQuery<Cryptocurrency[], Error>({
    queryKey: filteredCryptoKeys.byFilter(filterType),
    queryFn: async () => {
      // Obtener más datos de la API para tener suficientes resultados
      // Pedimos más datos para asegurar suficientes resultados tras filtrar
      const expandedData = await withRetry(() => 
        fetchCryptocurrencies(1, COINGECKO_CONFIG.DEFAULT_PER_PAGE * 2)
      );
      
      // Aplicar el mismo filtro a los datos expandidos
      let filtered: Cryptocurrency[] = [];
      
      switch (filterType) {
        case 'winners':
          filtered = expandedData
            .filter(c => (c.price_change_percentage_24h ?? 0) > 0)
            .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0));
          break;

        case 'losers':
          filtered = expandedData
            .filter(c => (c.price_change_percentage_24h ?? 0) < 0)
            .sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0));
          break;

        case 'volume':
          filtered = expandedData
            .sort((a, b) => b.total_volume - a.total_volume);
          break;

        default:
          filtered = expandedData;
      }

      return filtered;
    },
    enabled: needsApiCall, // Solo ejecutar si necesitamos más datos
    staleTime: config.cacheTime - 5000, // Invalidar justo antes del cache time
    gcTime: config.cacheTime,
    refetchOnWindowFocus: false,
    retry: false,
  });

  /**
   * ETAPA 3: Decidir qué datos mostrar
   * - Si no necesitamos API call → usar datos client-side
   * - Si necesitamos API call y tenemos datos → usar datos de API
   * - Si necesitamos API call y está cargando → mostrar datos client-side mientras tanto
   */
  const filteredCryptos = useMemo(() => {
    if (!needsApiCall) {
      return clientFiltered;
    }
    
    // Si tenemos datos de API, usarlos
    if (apiData && apiData.length > 0) {
      return apiData;
    }
    
    // Mientras carga la API, mostrar lo que tenemos localmente
    return clientFiltered;
  }, [clientFiltered, apiData, needsApiCall]);

  /**
   * Estado del filtrado para UI
   */
  const filteringState: FilteringState = useMemo(() => ({
    filterType,
    isClientFiltering: !needsApiCall || !apiData,
    needsApiCall,
    resultCount: filteredCryptos.length,
    threshold,
  }), [filterType, needsApiCall, apiData, filteredCryptos.length, threshold]);

  /**
   * Forzar refresco manual
   */
  const refresh = useCallback(async () => {
    if (needsApiCall) {
      // Invalidar cache y refetch
      await queryClient.invalidateQueries({
        queryKey: filteredCryptoKeys.byFilter(filterType),
      });
      await refetch();
    }
  }, [needsApiCall, filterType, queryClient, refetch]);

  /**
   * Cambiar tipo de filtro (convenience method)
   */
  const setFilterType = useCallback((newFilterType: FilterType) => {
    // El cambio de filtro se maneja externamente via el parámetro
    // Este método es para uso interno o conveniencia
    return newFilterType;
  }, []);

  return {
    // Datos
    filteredCryptos,
    
    // Estado
    isLoading: isApiLoading && needsApiCall,
    isError: !!apiError,
    error: apiError,
    filteringState,
    
    // Acciones
    refresh,
    setFilterType,
    
    // Info de debug
    clientResultCount: clientFiltered.length,
    apiResultCount: apiData?.length ?? 0,
  };
}

/**
 * Hook optimizado para filtrado sin API calls
 * Útil cuando siempre tienes todos los datos localmente
 * 
 * @param allCryptos - Lista completa de criptomonedas
 * @param filterType - Tipo de filtro
 * @returns Datos filtrados solo client-side
 */
export function useClientSideFiltering(
  allCryptos: Cryptocurrency[],
  filterType: FilterType = 'all'
) {
  return useCryptoFiltering(allCryptos, filterType, {
    minResultsThreshold: 0, // Siempre usar client-side
  });
}

export default useCryptoFiltering;
