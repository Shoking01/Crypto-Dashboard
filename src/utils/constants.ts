/**
 * Constantes del proyecto
 * Centraliza valores configurables y referencias
 */

/**
 * Configuración de la API de CoinGecko
 */
export const COINGECKO_CONFIG = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  DEFAULT_CURRENCY: 'usd',
  DEFAULT_PER_PAGE: 50,
  REFRESH_INTERVAL: 60000, // 60 segundos en milisegundos
} as const;

/**
 * Timeframes disponibles con su configuración
 * CoinGecko usa el parámetro 'days' para especificar el rango
 */
export const TIMEFRAMES: Record<string, { label: string; days: number }> = {
  '1h': { label: '1H', days: 0.04 },   // ~1 hora
  '24h': { label: '24H', days: 1 },     // 24 horas
  '7d': { label: '7D', days: 7 },       // 7 días
  '30d': { label: '30D', days: 30 },    // 30 días
  '1y': { label: '1Y', days: 365 },     // 1 año
} as const;

/**
 * Timeframe por defecto
 */
export const DEFAULT_TIMEFRAME = '24h';

/**
 * Configuración de la tabla de criptomonedas
 */
export const CRYPTO_TABLE_CONFIG = {
  PAGE_SIZE: 50,
  SORT_BY_DEFAULT: 'market_cap_rank',
  SORT_ORDER_DEFAULT: 'asc' as const,
} as const;

/**
 * Colores del tema (referencia para JS/TS)
 * Los colores reales están en CSS variables
 */
export const THEME_COLORS = {
  // Accents
  GREEN: '#10b981',
  RED: '#ef4444',
  BLUE: '#3b82f6',
  PURPLE: '#8b5cf6',
  
  // Backgrounds
  BG_PRIMARY: '#0a0e27',
  BG_SECONDARY: '#1a1f3a',
  BG_TERTIARY: '#252b4d',
  
  // Text
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#94a3b8',
  TEXT_MUTED: '#64748b',
  
  // Borders
  BORDER: '#2d3748',
} as const;

/**
 * Formatos de número para diferentes casos de uso
 */
export const NUMBER_FORMATS = {
  // Precio en USD
  PRICE: {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  } as Intl.NumberFormatOptions,
  
  // Cambio porcentual
  PERCENTAGE: {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  } as Intl.NumberFormatOptions,
  
  // Market cap y volumen (en billones/millones)
  COMPACT: {
    notation: 'compact',
    compactDisplay: 'short',
    style: 'currency',
    currency: 'USD',
  } as Intl.NumberFormatOptions,
  
  // Números grandes con separadores
  LARGE: {
    maximumFractionDigits: 0,
  } as Intl.NumberFormatOptions,
} as const;

/**
 * Símbolos de monedas principales para mostrar
 */
export const TOP_CRYPTOS = [
  'bitcoin',
  'ethereum',
  'tether',
  'binancecoin',
  'solana',
  'usd-coin',
  'ripple',
  'cardano',
  'avalanche-2',
  'dogecoin',
] as const;

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  API_UNAVAILABLE: 'Servicio temporalmente no disponible. Intenta nuevamente en unos momentos.',
  RATE_LIMIT: 'Demasiadas solicitudes. Esperando para reintentar...',
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  NOT_FOUND: 'No se encontraron resultados para tu búsqueda.',
  GENERIC: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
} as const;

/**
 * Configuración de reintentos para fetch
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // 1 segundo
  MAX_DELAY: 10000,    // 10 segundos
  BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * Configuración del sistema de filtrado
 */
export const FILTER_CONFIG = {
  // Mínimo de resultados antes de hacer API call
  MIN_RESULTS_THRESHOLD: 5,
  
  // Tiempo de caché en milisegundos (2 minutos)
  CACHE_TIME: 2 * 60 * 1000,
  
  // Porcentaje para cálculo de umbral dinámico (top 10%)
  DYNAMIC_THRESHOLD_PERCENTAGE: 0.1,
  
  // Filtros disponibles
  FILTERS: {
    all: {
      type: 'all' as const,
      label: 'Todas',
      description: 'Mostrar todas las criptomonedas',
    },
    winners: {
      type: 'winners' as const,
      label: 'Ganadoras',
      description: 'Criptos con mayor ganancia en 24h',
    },
    losers: {
      type: 'losers' as const,
      label: 'Perdedoras',
      description: 'Criptos con mayor pérdida en 24h',
    },
    volume: {
      type: 'volume' as const,
      label: 'Volumen',
      description: 'Criptos con mayor volumen de trading',
    },
  },
} as const;
