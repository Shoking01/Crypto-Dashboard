/**
 * Servicio de API para CoinGecko
 * Maneja todas las llamadas a la API de CoinGecko con manejo de errores y rate limiting
 * 
 * Mejores prácticas aplicadas:
 * - async-parallel: Operaciones independientes en paralelo
 * - js-early-exit: Early returns para errores
 * - Error handling robusto
 */

import axios, { AxiosError, type AxiosInstance } from 'axios';
import type {
  Cryptocurrency,
  ChartData,
  SearchResponse,
  ApiError,
  TimeFrame,
} from '../types';
import { COINGECKO_CONFIG, TIMEFRAMES, ERROR_MESSAGES, RETRY_CONFIG } from '../utils/constants';

/**
 * Instancia de Axios configurada para CoinGecko API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: COINGECKO_CONFIG.BASE_URL,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Maneja errores de la API y los transforma a un formato estándar
 */
function handleApiError(error: unknown): ApiError {
  // Error de Axios
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 0;

    // Rate limiting
    if (status === 429) {
      return {
        status: 429,
        message: ERROR_MESSAGES.RATE_LIMIT,
      };
    }

    // Error de red
    if (!axiosError.response) {
      return {
        status: 0,
        message: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }

    // Otros errores HTTP
    const responseData = axiosError.response.data as { error?: string } | undefined;
    return {
      status,
      message: responseData?.error || ERROR_MESSAGES.GENERIC,
    };
  }

  // Error genérico
  return {
    status: 500,
    message: ERROR_MESSAGES.GENERIC,
  };
}

/**
 * Delay helper con backoff exponencial
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene la lista de criptomonedas con sus precios actuales
 * 
 * @param page - Número de página (default: 1)
 * @param perPage - Cantidad por página (default: 50)
 * @param currency - Moneda de referencia (default: usd)
 * @returns Promise<Cryptocurrency[]>
 */
export async function fetchCryptocurrencies(
  page: number = 1,
  perPage: number = COINGECKO_CONFIG.DEFAULT_PER_PAGE,
  currency: string = COINGECKO_CONFIG.DEFAULT_CURRENCY
): Promise<Cryptocurrency[]> {
  const response = await apiClient.get<Cryptocurrency[]>('/coins/markets', {
    params: {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: false,
      price_change_percentage: '24h',
    },
  });

  return response.data;
}

/**
 * Obtiene datos históricos de precios para una criptomoneda específica
 * 
 * @param coinId - ID de la criptomoneda (ej: 'bitcoin')
 * @param timeframe - Período de tiempo ('1h', '24h', '7d', '30d', '1y')
 * @param currency - Moneda de referencia (default: usd)
 * @returns Promise<ChartData>
 */
export async function fetchChartData(
  coinId: string,
  timeframe: TimeFrame,
  currency: string = COINGECKO_CONFIG.DEFAULT_CURRENCY
): Promise<ChartData> {
  const timeframeConfig = TIMEFRAMES[timeframe];
  
  if (!timeframeConfig) {
    throw new Error(`Invalid timeframe: ${timeframe}`);
  }

  const response = await apiClient.get<ChartData>(
    `/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: currency,
        days: timeframeConfig.days,
      },
    }
  );

  return response.data;
}

/**
 * Busca criptomonedas por nombre o símbolo
 * 
 * @param query - Término de búsqueda
 * @returns Promise<SearchResponse>
 */
export async function searchCryptocurrencies(query: string): Promise<SearchResponse> {
  if (!query.trim()) {
    return { coins: [], exchanges: [], icos: [], categories: [], nfts: [] };
  }

  const response = await apiClient.get<SearchResponse>('/search', {
    params: { query: query.trim() },
  });

  return response.data;
}

/**
 * Obtiene detalles de una criptomoneda específica
 * 
 * @param coinId - ID de la criptomoneda
 * @returns Promise<Cryptocurrency>
 */
export async function fetchCryptoDetails(
  coinId: string
): Promise<Cryptocurrency> {
  const response = await apiClient.get<Cryptocurrency>(`/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
    },
  });

  return response.data;
}

/**
 * Versión con retry para manejar rate limiting y errores de red
 * 
 * @param operation - Función a ejecutar
 * @param maxRetries - Máximo número de reintentos
 * @returns Promise con el resultado
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = RETRY_CONFIG.MAX_RETRIES
): Promise<T> {
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = handleApiError(error);

      // No reintentar en errores 4xx (cliente)
      if (lastError.status >= 400 && lastError.status < 500 && lastError.status !== 429) {
        throw lastError;
      }

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Esperar antes de reintentar con backoff exponencial
      const retryDelay = RETRY_CONFIG.INITIAL_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, attempt);
      await delay(Math.min(retryDelay, RETRY_CONFIG.MAX_DELAY));
    }
  }

  throw lastError || new Error(ERROR_MESSAGES.GENERIC);
}

/**
 * Obtiene múltiples datos en paralelo
 * Útil para cargar datos iniciales de la aplicación
 * 
 * @param coinIds - Array de IDs de criptomonedas
 * @returns Promise<Cryptocurrency[]>
 */
export async function fetchMultipleCryptos(
  coinIds: string[]
): Promise<Cryptocurrency[]> {
  if (coinIds.length === 0) return [];

  const response = await apiClient.get<Cryptocurrency[]>('/coins/markets', {
    params: {
      vs_currency: COINGECKO_CONFIG.DEFAULT_CURRENCY,
      ids: coinIds.join(','),
      sparkline: false,
      price_change_percentage: '24h',
    },
  });

  return response.data;
}

// Exportar el cliente para casos de uso avanzados
export { apiClient };
