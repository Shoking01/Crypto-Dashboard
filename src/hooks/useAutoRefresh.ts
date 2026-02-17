/**
 * Hook para manejar el auto-refresh de datos
 * Proporciona contador, control manual y estado de última actualización
 * 
 * Mejores prácticas aplicadas:
 * - rerender-use-ref-transient-values: Usar ref para el interval ID
 * - rerender-lazy-state-init: Lazy initialization del estado
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { COINGECKO_CONFIG } from '../utils/constants';

/**
 * Hook para auto-refresh con contador visual
 * 
 * @param interval - Intervalo en milisegundos (default: 60000)
 * @param onRefresh - Callback a ejecutar en cada refresh
 * @returns Estado y controles del auto-refresh
 * 
 * @example
 * ```tsx
 * const { lastUpdated, nextUpdateIn, refresh, isPaused } = useAutoRefresh(
 *   60000,
 *   () => refetch()
 * );
 * ```
 */
export function useAutoRefresh(
  interval: number = COINGECKO_CONFIG.REFRESH_INTERVAL,
  onRefresh?: () => void
) {
  // Usar ref para el interval ID (valor transitorio, no necesita re-render)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onRefreshRef = useRef(onRefresh);
  
  // Actualizar la ref cuando cambie el callback
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // Estado de última actualización
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  
  // Contador de segundos hasta próxima actualización
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(interval / 1000);
  
  // Estado de pausa
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Limpiar intervalo
  const clearRefreshInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Función de refresh manual
  const refresh = useCallback(() => {
    setLastUpdated(new Date());
    setNextUpdateIn(interval / 1000);
    onRefreshRef.current?.();
  }, [interval]);

  // Pausar auto-refresh
  const pause = useCallback(() => {
    setIsPaused(true);
    clearRefreshInterval();
  }, [clearRefreshInterval]);

  // Reanudar auto-refresh
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Efecto principal del intervalo
  useEffect(() => {
    if (isPaused) return;

    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(() => {
      setNextUpdateIn((prev) => {
        if (prev <= 1) {
          // Llegó a 0, ejecutar refresh
          refresh();
          return interval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    // Guardar referencia
    intervalRef.current = countdownInterval;

    // Cleanup
    return () => {
      clearInterval(countdownInterval);
    };
  }, [isPaused, interval, refresh]);

  // Resetear contador cuando cambie el intervalo
  useEffect(() => {
    setNextUpdateIn(interval / 1000);
  }, [interval]);

  return {
    lastUpdated,
    nextUpdateIn,
    refresh,
    pause,
    resume,
    isPaused,
  };
}

/**
 * Hook simplificado solo para tracking de última actualización
 * Útil cuando no necesitas el contador visual
 * 
 * @returns Última fecha de actualización y función para actualizar
 */
export function useLastUpdated() {
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

  const update = useCallback(() => {
    setLastUpdated(new Date());
  }, []);

  return { lastUpdated, update };
}

/**
 * Calcula el tiempo transcurrido desde una fecha
 * 
 * @param date - Fecha de referencia
 * @returns String formateado (ej: "hace 2 minutos")
 */
function calculateTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'hace un momento';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  }
}

/**
 * Hook para formatear el tiempo transcurrido desde última actualización
 * 
 * @param date - Fecha de última actualización
 * @returns String formateado (ej: "hace 2 minutos")
 */
export function useTimeAgo(date: Date): string {
  const [timeAgo, setTimeAgo] = useState<string>(() => calculateTimeAgo(date));

  useEffect(() => {
    // Actualizar cada minuto
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return timeAgo;
}
