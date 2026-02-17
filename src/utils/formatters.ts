/**
 * Funciones utilitarias para formateo de datos
 * Centraliza la lógica de presentación de números y fechas
 */

import { NUMBER_FORMATS } from './constants';

/**
 * Formatea un precio en formato de moneda USD
 * @param price - Precio a formatear
 * @returns String formateado (ej: "$65,420.50")
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', NUMBER_FORMATS.PRICE).format(price);
}

/**
 * Formatea un cambio porcentual
 * @param percentage - Cambio porcentual (ej: 2.5 para 2.5%)
 * @returns String formateado con signo (ej: "+2.50%" o "-1.20%")
 */
export function formatPercentage(percentage: number | null | undefined): string {
  if (percentage === null || percentage === undefined) return '-';
  
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${new Intl.NumberFormat('en-US', NUMBER_FORMATS.PERCENTAGE).format(percentage / 100)}`;
}

/**
 * Formatea números grandes (market cap, volumen) en formato compacto
 * @param value - Valor a formatear
 * @returns String formateado (ej: "$1.2T", "$850M")
 */
export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', NUMBER_FORMATS.COMPACT).format(value);
}

/**
 * Formatea un número grande con separadores de miles
 * @param value - Valor a formatear
 * @returns String formateado (ej: "1,234,567")
 */
export function formatLargeNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', NUMBER_FORMATS.LARGE).format(value);
}

/**
 * Trunca un texto si excede la longitud máxima
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima permitida
 * @returns Texto truncado con "..." si es necesario
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Formatea un timestamp a fecha legible
 * @param timestamp - Timestamp en milisegundos o segundos
 * @param isSeconds - Si el timestamp está en segundos (true) o milisegundos (false)
 * @returns String formateado (ej: "Jan 15, 2024")
 */
export function formatDate(
  timestamp: number,
  isSeconds: boolean = false
): string {
  const date = new Date(isSeconds ? timestamp * 1000 : timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formatea un timestamp a hora legible
 * @param timestamp - Timestamp en milisegundos o segundos
 * @param isSeconds - Si el timestamp está en segundos
 * @returns String formateado (ej: "2:30 PM")
 */
export function formatTime(
  timestamp: number,
  isSeconds: boolean = false
): string {
  const date = new Date(isSeconds ? timestamp * 1000 : timestamp);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formatea un timestamp a fecha y hora completa
 * @param timestamp - Timestamp en milisegundos o segundos
 * @param isSeconds - Si el timestamp está en segundos
 * @returns String formateado (ej: "Jan 15, 2024, 2:30 PM")
 */
export function formatDateTime(
  timestamp: number,
  isSeconds: boolean = false
): string {
  const date = new Date(isSeconds ? timestamp * 1000 : timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Determina el color de un cambio porcentual
 * @param percentage - Cambio porcentual
 * @returns Clase CSS para el color (green o red)
 */
export function getChangeColorClass(percentage: number | null | undefined): string {
  if (percentage === null || percentage === undefined) return '';
  return percentage >= 0 ? 'text-green' : 'text-red';
}

/**
 * Genera un delay exponencial para reintentos
 * @param attempt - Número de intento actual (empezando en 0)
 * @returns Tiempo de espera en milisegundos
 */
export function getRetryDelay(attempt: number): number {
  const { INITIAL_DELAY, MAX_DELAY, BACKOFF_MULTIPLIER } = {
    INITIAL_DELAY: 1000,
    MAX_DELAY: 10000,
    BACKOFF_MULTIPLIER: 2,
  };
  
  const delay = INITIAL_DELAY * Math.pow(BACKOFF_MULTIPLIER, attempt);
  return Math.min(delay, MAX_DELAY);
}

/**
 * Convierte un valor de market cap a string con sufijo apropiado
 * @param marketCap - Valor de market cap
 * @returns String formateado legible
 */
export function formatMarketCap(marketCap: number | null | undefined): string {
  if (marketCap === null || marketCap === undefined) return '-';
  
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  
  return formatPrice(marketCap);
}
