/**
 * ThemeContext - Sistema de gestión de temas
 * 
 * Características:
 * - Persistencia en localStorage
 * - Detección de preferencia del sistema
 * - Transiciones suaves entre temas
 * - Sin flash de tema incorrecto
 */

import { createContext, useContext, useEffect, useState, useCallback, useLayoutEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para evitar SSR issues
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Theme Provider - Gestiona el estado del tema global
 */
export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Aplicar tema al DOM inmediatamente (antes del paint)
  useIsomorphicLayoutEffect(() => {
    // Leer tema guardado o preferencia del sistema
    const stored = localStorage.getItem('crypto-dashboard-theme') as Theme | null;
    
    let initialTheme: Theme;
    if (stored && (stored === 'dark' || stored === 'light')) {
      initialTheme = stored;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }
    
    setThemeState(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Escuchar cambios en preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('crypto-dashboard-theme');
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('crypto-dashboard-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acceder al contexto del tema
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
