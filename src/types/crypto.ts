/**
 * Tipos TypeScript para el Dashboard de Criptomonedas
 * Define las interfaces principales usadas en toda la aplicación
 */

/**
 * Representa una criptomoneda individual desde la API de CoinGecko
 */
export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: RoiInfo | null;
  last_updated: string;
}

/**
 * Información de ROI (Return on Investment)
 */
interface RoiInfo {
  times: number;
  currency: string;
  percentage: number;
}

/**
 * Punto individual para gráficos de precios
 * timestamp: Unix timestamp en milisegundos
 * price: Precio en la moneda seleccionada
 */
export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

/**
 * Respuesta de la API de datos históricos (market_chart)
 */
export interface ChartData {
  prices: [number, number][];        // [timestamp, price]
  market_caps: [number, number][];   // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
}

/**
 * Períodos de tiempo disponibles para gráficos
 */
export type TimeFrame = '1h' | '24h' | '7d' | '30d' | '1y';

/**
 * Información del timeframe seleccionado
 */
export interface TimeFrameInfo {
  label: string;
  days: number;
  interval?: string;
}

/**
 * Estructura de error de API
 */
export interface ApiError {
  status: number;
  message: string;
}

/**
 * Resultado de búsqueda de criptomonedas
 */
export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

/**
 * Respuesta de búsqueda de CoinGecko
 */
export interface SearchResponse {
  coins: SearchResult[];
  exchanges: unknown[];
  icos: unknown[];
  categories: unknown[];
  nfts: unknown[];
}

/**
 * Estado de carga para componentes
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Props para componentes que muestran estados de carga
 */
export interface WithLoadingState {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Tipos de filtro disponibles para criptomonedas
 */
export type FilterType = 'winners' | 'losers' | 'volume' | 'all';

/**
 * Configuración de un filtro
 */
export interface FilterConfig {
  type: FilterType;
  label: string;
  description: string;
  icon?: string;
}

/**
 * Estado del filtrado de criptomonedas
 */
export interface FilteringState {
  filterType: FilterType;
  isClientFiltering: boolean;
  needsApiCall: boolean;
  resultCount: number;
  threshold?: number;
}

/**
 * Opciones para el hook de filtrado
 */
export interface FilteringOptions {
  minResultsThreshold: number;
  cacheTime: number;
  dynamicThresholdPercentage: number;
}
