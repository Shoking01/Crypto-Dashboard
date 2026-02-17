/**
 * Componente CryptoControls - Barra de controles moderna
 * 
 * Combina Timeframe + Filtros en diseño limpio horizontal
 * Diseño responsivo para móvil y desktop
 * 
 * Optimizaciones:
 * - memo para evitar re-renders
 * - useCallback para handlers estables
 */

import { memo, useCallback } from 'react';
import { TrendingUp, TrendingDown, BarChart3, ListFilter, RefreshCw, Clock } from 'lucide-react';
import { FILTER_CONFIG } from '../../utils/constants';
import type { FilterType, FilteringState, TimeFrame } from '../../types';

interface CryptoControlsProps {
  selectedTimeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  filteringState: FilteringState;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const TIMEFRAME_OPTIONS: { value: TimeFrame; label: string }[] = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '1y', label: '1Y' },
];

const filterIcons = {
  all: ListFilter,
  winners: TrendingUp,
  losers: TrendingDown,
  volume: BarChart3,
};

const CryptoControlsComponent = memo(function CryptoControls({
  selectedTimeframe,
  onTimeframeChange,
  currentFilter,
  onFilterChange,
  filteringState,
  onRefresh,
  isLoading = false,
}: CryptoControlsProps) {
  const handleTimeframeClick = useCallback((tf: TimeFrame) => {
    if (tf !== selectedTimeframe) {
      onTimeframeChange(tf);
    }
  }, [selectedTimeframe, onTimeframeChange]);

  const handleFilterClick = useCallback((filterType: FilterType) => {
    if (filterType !== currentFilter) {
      onFilterChange(filterType);
    }
  }, [currentFilter, onFilterChange]);

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  return (
    <div className="crypto-controls">
      <div className="crypto-controls-inner">
        {/* Sección izquierda: Timeframe + Filtros */}
        <div className="crypto-controls-left">
          {/* Timeframe */}
          <div className="crypto-controls-timeframe">
            <div className="crypto-controls-label">
              <Clock size={16} />
              <span>Periodo</span>
            </div>
            <div className="crypto-controls-timeframe-btns">
              {TIMEFRAME_OPTIONS.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => handleTimeframeClick(tf.value)}
                  disabled={isLoading}
                  className={`crypto-controls-timeframe-btn ${selectedTimeframe === tf.value ? 'active' : ''}`}
                  data-loading={isLoading}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider - hidden on mobile */}
          <div className="crypto-controls-divider" />

          {/* Filtros */}
          <div className="crypto-controls-filters">
            {(Object.keys(FILTER_CONFIG.FILTERS) as FilterType[]).map((filterType) => {
              const Icon = filterIcons[filterType];
              const isActive = currentFilter === filterType;
              const config = FILTER_CONFIG.FILTERS[filterType];

              return (
                <button
                  key={filterType}
                  onClick={() => handleFilterClick(filterType)}
                  disabled={isLoading}
                  className={`crypto-controls-filter-btn ${isActive ? 'active' : ''}`}
                  data-loading={isLoading}
                  title={config.description}
                >
                  <Icon size={16} />
                  <span className="crypto-controls-filter-label">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sección derecha: Estado y Controles */}
        <div className="crypto-controls-right">
          {/* Indicador de estado */}
          <div className="crypto-controls-status">
            <div
              className="crypto-controls-status-dot"
              data-state={isLoading ? 'loading' : filteringState.isClientFiltering ? 'local' : 'api'}
              style={{
                animation: isLoading ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }}
            />
            <span className="crypto-controls-status-text">
              {isLoading ? 'Cargando...' : filteringState.isClientFiltering ? 'Local' : 'API'}
            </span>
          </div>

          {/* Contador */}
          <div className="crypto-controls-count">
            <span className="crypto-controls-count-number">{filteringState.resultCount}</span>
            {' '}criptos
          </div>

          {/* Refresh */}
          {filteringState.needsApiCall && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="crypto-controls-refresh-btn"
              data-loading={isLoading}
              title="Refrescar datos"
            >
              <RefreshCw
                size={18}
                style={{
                  color: 'var(--accent-primary)',
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export { CryptoControlsComponent as CryptoControls };
