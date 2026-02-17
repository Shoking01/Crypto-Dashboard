/**
 * Componente Header - Barra superior moderna
 * 
 * Diseño minimalista con:
 * - Logo con gradiente sutil
 * - Indicadores de estado limpios
 * - Botón de tema oscuro/claro
 * - Glassmorphism refinado
 * - Diseño responsivo para móvil
 * 
 * Optimizaciones:
 * - memo para evitar re-renders
 * - useMemo para cálculos
 */

import { memo, useMemo } from 'react';
import { RefreshCw, Clock, Zap } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { formatTime } from '../../utils/formatters';

interface HeaderProps {
  lastUpdated: Date;
  nextUpdateIn: number;
  onRefresh: () => void;
  isLoading?: boolean;
}

const HeaderComponent = memo(function Header({
  lastUpdated,
  nextUpdateIn,
  onRefresh,
  isLoading = false,
}: HeaderProps) {
  const formattedTime = useMemo(() => formatTime(lastUpdated.getTime()), [lastUpdated]);
  
  const formattedCountdown = useMemo(() => ({
    minutes: String(Math.floor(nextUpdateIn / 60)).padStart(2, '0'),
    seconds: String(nextUpdateIn % 60).padStart(2, '0'),
  }), [nextUpdateIn]);

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Logo */}
        <div className="app-header-logo">
          <div className="app-header-icon">
            <Zap size={24} style={{ color: 'white' }} />
          </div>
          <div className="app-header-title">
            <h1 className="app-header-title-text">
              Crypto<span style={{ color: 'var(--accent-primary)' }}>Dashboard</span>
            </h1>
            <p className="app-header-subtitle">Live Market Data</p>
          </div>
        </div>

        {/* Centro: Stats - Hidden on mobile */}
        <div className="app-header-stats">
          {/* Last Update */}
          <div className="app-header-stat-item">
            <Clock size={16} style={{ color: 'var(--accent-secondary)' }} />
            <span className="app-header-stat-text">
              {formattedTime}
            </span>
          </div>

          {/* Countdown */}
          <div className="app-header-stat-item app-header-stat-highlight">
            <div
              className="app-header-pulse-dot"
              style={{
                animation: nextUpdateIn < 10 ? 'pulse 1s ease-in-out infinite' : 'none',
              }}
            />
            <span className="app-header-countdown">
              {formattedCountdown.minutes}:{formattedCountdown.seconds}
            </span>
          </div>
        </div>

        {/* Derecha: Controles */}
        <div className="app-header-controls">
          {/* Mobile countdown - visible only on mobile */}
          <div className="app-header-mobile-countdown">
            <span className="app-header-countdown">
              {formattedCountdown.minutes}:{formattedCountdown.seconds}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Actualizar datos"
            className="app-header-refresh-btn"
            data-loading={isLoading}
          >
            <RefreshCw
              size={20}
              style={{
                color: 'var(--accent-primary)',
                animation: isLoading ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
});

export { HeaderComponent as Header };
