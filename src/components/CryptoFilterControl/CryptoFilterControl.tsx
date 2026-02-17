/**
 * Componente CryptoFilterControl - Controles de filtrado
 * 
 * Botones de filtro con diseño neón y glassmorphism
 * Muestra el estado actual del filtrado y cantidad de resultados
 * 
 * Optimizaciones aplicadas:
 * - memo: Componente memoizado para evitar re-renders innecesarios
 * - useCallback: Handlers estables
 */

import { memo, useCallback } from 'react';
import { TrendingUp, TrendingDown, BarChart3, ListFilter, RefreshCw } from 'lucide-react';
import { FILTER_CONFIG } from '../../utils/constants';
import type { FilterType, FilteringState } from '../../types';

interface CryptoFilterControlProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  filteringState: FilteringState;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const filterIcons = {
  all: ListFilter,
  winners: TrendingUp,
  losers: TrendingDown,
  volume: BarChart3,
};

const CryptoFilterControlComponent = memo(function CryptoFilterControl({
  currentFilter,
  onFilterChange,
  filteringState,
  onRefresh,
  isLoading = false,
}: CryptoFilterControlProps) {
  const handleFilterClick = useCallback((filterType: FilterType) => {
    if (filterType !== currentFilter) {
      onFilterChange(filterType);
    }
  }, [currentFilter, onFilterChange]);

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.9), rgba(10, 10, 15, 0.95))',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 245, 255, 0.1)',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 245, 255, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Botones de filtro */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {(Object.keys(FILTER_CONFIG.FILTERS) as FilterType[]).map((filterType) => {
            const Icon = filterIcons[filterType];
            const isActive = currentFilter === filterType;
            const config = FILTER_CONFIG.FILTERS[filterType];

            return (
              <button
                key={filterType}
                onClick={() => handleFilterClick(filterType)}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  borderRadius: '12px',
                  border: isActive
                    ? '2px solid var(--accent-cyan)'
                    : '2px solid rgba(0, 245, 255, 0.2)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(0, 245, 255, 0.05))'
                    : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  textShadow: isActive ? '0 0 10px rgba(0, 245, 255, 0.5)' : 'none',
                  boxShadow: isActive
                    ? '0 0 20px rgba(0, 245, 255, 0.3), inset 0 0 10px rgba(0, 245, 255, 0.1)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && !isActive) {
                    e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.5)';
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                    e.currentTarget.style.background = 'rgba(0, 245, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.2)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
                title={config.description}
              >
                <Icon size={18} />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Panel de estado y refresh */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Indicador de estado */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 245, 255, 0.1)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isLoading
                  ? 'var(--accent-magenta)'
                  : filteringState.isClientFiltering
                  ? 'var(--status-green)'
                  : 'var(--accent-cyan)',
                boxShadow: isLoading
                  ? '0 0 10px var(--accent-magenta)'
                  : filteringState.isClientFiltering
                  ? '0 0 10px var(--status-green)'
                  : '0 0 10px var(--accent-cyan)',
                animation: isLoading ? 'pulse 1s ease-in-out infinite' : 'none',
              }}
            />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {isLoading
                ? 'Actualizando...'
                : filteringState.isClientFiltering
                ? 'Datos locales'
                : 'Datos en vivo'}
            </span>
          </div>

          {/* Contador de resultados */}
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              {filteringState.resultCount}
            </span>
            {' '}resultados
          </div>

          {/* Botón de refresh */}
          {filteringState.needsApiCall && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '2px solid rgba(0, 245, 255, 0.3)',
                background: 'transparent',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)';
                  e.currentTarget.style.transform = 'rotate(180deg)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.3)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
              title="Refrescar datos"
            >
              <RefreshCw
                size={18}
                color="var(--accent-cyan)"
                style={{
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                }}
              />
            </button>
          )}
        </div>
      </div>

      {/* Badge de filtro activo */}
      {currentFilter !== 'all' && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            background: 'rgba(0, 245, 255, 0.05)',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            Filtro activo:
          </span>
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {FILTER_CONFIG.FILTERS[currentFilter].description}
          </span>
          {filteringState.threshold !== undefined && filteringState.threshold !== 0 && (
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginLeft: 'auto',
              }}
            >
              Umbral: {currentFilter === 'volume'
                ? `$${(filteringState.threshold / 1e9).toFixed(2)}B`
                : `${filteringState.threshold.toFixed(2)}%`}
            </span>
          )}
        </div>
      )}

      {/* Animaciones CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
});

export { CryptoFilterControlComponent as CryptoFilterControl };
