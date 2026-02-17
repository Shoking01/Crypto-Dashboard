/**
 * Utilidades para optimización de datos de gráficos
 * 
 * Incluye:
 * - Downsampling para reducir puntos de datos
 * - Cache inteligente
 * - Validación de datos
 */

import type { ChartDataPoint } from '../types';

/**
 * Reduce la cantidad de puntos de datos manteniendo la forma del gráfico
 * Usa el algoritmo Largest-Triangle-Three-Buckets (LTTB) simplificado
 * 
 * @param data - Datos originales
 * @param maxPoints - Máximo de puntos a mantener
 * @returns Datos reducidos
 */
export function downsampleData(
  data: ChartDataPoint[],
  maxPoints: number = 200
): ChartDataPoint[] {
  if (data.length <= maxPoints) {
    return data;
  }

  const result: ChartDataPoint[] = [];
  const bucketSize = Math.floor(data.length / maxPoints);

  // Siempre incluir el primer punto
  result.push(data[0]);

  // Procesar buckets intermedios
  for (let i = 1; i < maxPoints - 1; i++) {
    const start = i * bucketSize;
    const end = start + bucketSize;
    
    // Encontrar el punto más significativo del bucket
    // (el que tiene mayor diferencia con el promedio)
    let maxDiff = -Infinity;
    let bestPoint = data[start];
    let sum = 0;
    
    // Calcular promedio del bucket
    for (let j = start; j < end && j < data.length; j++) {
      sum += data[j].price;
    }
    const avg = sum / (end - start);
    
    // Encontrar punto con mayor desviación
    for (let j = start; j < end && j < data.length; j++) {
      const diff = Math.abs(data[j].price - avg);
      if (diff > maxDiff) {
        maxDiff = diff;
        bestPoint = data[j];
      }
    }
    
    result.push(bestPoint);
  }

  // Siempre incluir el último punto
  result.push(data[data.length - 1]);

  return result;
}

/**
 * Determina el número óptimo de puntos según el timeframe
 */
export function getOptimalPoints(timeframe: string): number {
  switch (timeframe) {
    case '1h':
      return 60;      // 1 punto por minuto
    case '24h':
      return 96;      // 1 punto cada 15 min
    case '7d':
      return 168;     // 1 punto por hora
    case '30d':
      return 180;     // 1 punto cada 4 horas
    case '1y':
      return 365;     // 1 punto por día
    default:
      return 200;
  }
}

/**
 * Valida que los datos del gráfico sean correctos
 */
export function validateChartData(data: ChartDataPoint[]): boolean {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;
  
  // Verificar que tenga puntos válidos
  const validPoints = data.filter(
    point => 
      point.timestamp > 0 && 
      typeof point.price === 'number' && 
      !isNaN(point.price) &&
      isFinite(point.price)
  );
  
  return validPoints.length > 0;
}

/**
 * Calcula estadísticas básicas del gráfico
 */
export function calculateChartStats(data: ChartDataPoint[]) {
  if (data.length === 0) {
    return { min: 0, max: 0, avg: 0, first: 0, last: 0, change: 0 };
  }

  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const sum = prices.reduce((a, b) => a + b, 0);
  const avg = sum / prices.length;
  const first = data[0].price;
  const last = data[data.length - 1].price;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;

  return { min, max, avg, first, last, change };
}

/**
 * Formatea errores de API para mostrar al usuario
 */
export function formatChartError(error: unknown): string {
  if (error instanceof Error) {
    // Rate limiting
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return 'Límite de solicitudes excedido. Espera un momento e intenta de nuevo.';
    }
    // Network error
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    // Generic error
    return `Error al cargar datos: ${error.message}`;
  }
  return 'Error desconocido al cargar el gráfico.';
}
