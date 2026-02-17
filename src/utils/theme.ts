/**
 * Theme utilities - Funciones auxiliares para el tema
 */

export type Theme = 'dark' | 'light';

export const STORAGE_KEY = 'crypto-dashboard-theme';

export function getInitialTheme(defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && (stored === 'dark' || stored === 'light')) {
    return stored;
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}
