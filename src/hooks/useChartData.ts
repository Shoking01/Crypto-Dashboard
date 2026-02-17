/**
 * Hook para obtener datos históricos de precios de criptomonedas
 * Usa React Query para caching eficiente
 * 
 * Optimizaciones:
 * - client-swr-dedup: Caching inteligente por coin + timeframe
 * - Downsampling automático para períodos largos
 * - Manejo de errores mejorado
 * - Retry con backoff exponencial
 */

import { useQuery } from '@tanstack/react-query';
import { fetchChartData, withRetry } from '../services/coingeckoApi';
import { 
  downsampleData, 
  getOptimalPoints, 
  validateChartData,
  formatChartError 
} from '../utils/chartUtils';
import type { ChartData, ChartDataPoint, TimeFrame } from '../types';

/**
 * Query keys para datos de gráficos
 */
export const chartKeys = {
  all: ['charts'] as const,
  byCoin: (coinId: string) => [...chartKeys.all, coinId] as const,
  byTimeframe: (coinId: string, timeframe: TimeFrame) =>
    [...chartKeys.byCoin(coinId), timeframe] as const,
};

/**
 * Transforma y optimiza los datos de la API
 * 
 * @param data - Datos crudos de la API
 * @param timeframe - Período de tiempo para optimizar
 * @returns Array de ChartDataPoint optimizado
 */
function transformChartData(data: ChartData, timeframe: TimeFrame): ChartDataPoint[] {
  // Convertir a formato interno
  const rawData: ChartDataPoint[] = data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }));

  // Validar datos
  if (!validateChartData(rawData)) {
    throw new Error('Datos de gráfico inválidos recibidos de la API');
  }

  // Aplicar downsampling según timeframe
  const optimalPoints = getOptimalPoints(timeframe);
  const optimizedData = downsampleData(rawData, optimalPoints);

  return optimizedData;
}

/**
 * Hook para obtener datos históricos de precios
 * 
 * @param coinId - ID de la criptomoneda (ej: 'bitcoin')
 * @param timeframe - Período de tiempo ('1h', '24h', '7d', '30d', '1y')
 * @returns Query result con datos formateados para gráficos
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useChartData('bitcoin', '24h');
 * ```
 */
export function useChartData(
  coinId: string | null,
  timeframe: TimeFrame
) {
  return useQuery<ChartDataPoint[], Error>({
    queryKey: chartKeys.byTimeframe(coinId || '', timeframe),
    queryFn: async () => {
      if (!coinId) {
        throw new Error('Se requiere seleccionar una criptomoneda');
      }

      try {
        // Fetch con retry automático
        const rawData = await withRetry(() => fetchChartData(coinId, timeframe), 2);
        
        // Transformar y optimizar
        return transformChartData(rawData, timeframe);
      } catch (error) {
        // Formatear error para el usuario
        throw new Error(formatChartError(error));
      }
    },
    // Cache más largo para datos históricos
    staleTime: getTimeframeStaleTime(timeframe),
    gcTime: 10 * 60 * 1000, // 10 minutos en memoria
    // No auto-refresh para datos históricos
    refetchInterval: false,
    refetchOnWindowFocus: false,
    // Reintentos manuales manejados en withRetry
    retry: 1,
    retryDelay: 2000,
    // Solo ejecutar si tenemos un coinId válido
    enabled: !!coinId && coinId.length > 0,
    // Placeholder data mientras carga
    placeholderData: (prev) => prev,
  });
}

/**
 * Determina el tiempo de stale según el timeframe
 * Datos más antiguos pueden estar stale por más tiempo
 */
function getTimeframeStaleTime(timeframe: TimeFrame): number {
  switch (timeframe) {
    case '1h':
      return 2 * 60 * 1000;   // 2 minutos
    case '24h':
      return 5 * 60 * 1000;   // 5 minutos
    case '7d':
      return 10 * 60 * 1000;  // 10 minutos
    case '30d':
      return 30 * 60 * 1000;  // 30 minutos
    case '1y':
      return 60 * 60 * 1000;  // 1 hora
    default:
      return 5 * 60 * 1000;
  }
}

/**
 * Hook para precargar datos de un timeframe
 * Útil para mejorar UX al cambiar entre períodos
 * 
 * @param coinId - ID de la criptomoneda
 * @param timeframe - Timeframe a precargar
 */
export function usePrefetchChart(
  coinId: string | null,
  timeframe: TimeFrame
) {
  const { refetch } = useChartData(coinId, timeframe);
  return refetch;
}

/**
 * Hook para obtener estadísticas del gráfico actual
 */
export function useChartStats(data: ChartDataPoint[] | undefined) {
  if (!data || data.length === 0) {
    return { 
      min: 0, 
      max: 0, 
      avg: 0, 
      first: 0, 
      last: 0, 
      change: 0,
      isPositive: false,
      changeFormatted: '0.00%'
    };
  }

  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const sum = prices.reduce((a, b) => a + b, 0);
  const avg = sum / prices.length;
  const first = data[0].price;
  const last = data[data.length - 1].price;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const isPositive = change >= 0;

  return { 
    min, 
    max, 
    avg, 
    first, 
    last, 
    change,
    isPositive,
    changeFormatted: `${isPositive ? '+' : ''}${change.toFixed(2)}%`
  };
}
