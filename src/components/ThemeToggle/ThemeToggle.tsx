/**
 * ThemeToggle - Botón para cambiar entre temas oscuro/claro
 * 
 * Diseño: Botón circular con iconos animados (sol/luna)
 * Animación suave de rotación al cambiar
 */

import { memo, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggleComponent = memo(function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  const handleClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <button
      onClick={handleClick}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-tertiary)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Icono Sol */}
      <Sun
        size={20}
        style={{
          position: 'absolute',
          color: 'var(--status-warning)',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(90deg) scale(0.5)' : 'rotate(0) scale(1)',
          transition: 'all var(--transition-normal)',
        }}
      />
      
      {/* Icono Luna */}
      <Moon
        size={20}
        style={{
          position: 'absolute',
          color: 'var(--accent-primary)',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0.5)',
          transition: 'all var(--transition-normal)',
        }}
      />
    </button>
  );
});

export { ThemeToggleComponent as ThemeToggle };
