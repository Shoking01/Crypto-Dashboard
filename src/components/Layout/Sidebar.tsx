/**
 * Componente Sidebar - Navegación lateral estilo Terminal
 * Glassmorphism, efectos neón, botones iluminados
 * 
 * Optimizaciones aplicadas:
 * - rerender-memo: Componente memoizado
 * - bundle-barrel-imports: Importación directa de lucide-react
 */

import { useState, memo, useCallback } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

interface SidebarProps {
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

const TIMEFRAME_OPTIONS = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '1y', label: '1Y' },
];

const SidebarComponent = memo(function Sidebar({
  selectedTimeframe = '24h',
  onTimeframeChange,
}: SidebarProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // useCallback para handlers estables
  const handleTimeframeChange = useCallback((value: string) => {
    onTimeframeChange?.(value);
  }, [onTimeframeChange]);

  const filters = [
    { id: 'all', label: 'Todas', icon: BarChart3 },
    { id: 'gainers', label: 'Ganadoras', icon: TrendingUp },
    { id: 'losers', label: 'Perdedoras', icon: TrendingDown },
    { id: 'volume', label: 'Volumen', icon: Activity },
  ];

  return (
    <aside
      style={{
        width: '260px',
        background: 'linear-gradient(180deg, rgba(18, 18, 26, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0, 245, 255, 0.1)',
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      {/* Timeframe Selector */}
      <div>
        <h3
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--accent-cyan)',
            marginBottom: '1rem',
            textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
          }}
        >
          Timeframe
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 245, 255, 0.1)',
          }}
        >
          {TIMEFRAME_OPTIONS.map((tf) => (
            <button
              key={tf.value}
              onClick={() => handleTimeframeChange(tf.value)}
              style={{
                padding: '0.625rem 0.25rem',
                border: 'none',
                borderRadius: '8px',
                backgroundColor:
                  selectedTimeframe === tf.value
                    ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta))'
                    : 'transparent',
                background:
                  selectedTimeframe === tf.value
                    ? 'linear-gradient(135deg, #00f5ff, #ff00ff)'
                    : 'transparent',
                color:
                  selectedTimeframe === tf.value
                    ? '#0a0a0f'
                    : 'var(--text-muted)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow:
                  selectedTimeframe === tf.value
                    ? '0 0 15px rgba(0, 245, 255, 0.5)'
                    : 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedTimeframe !== tf.value) {
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTimeframe !== tf.value) {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div>
        <h3
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--accent-magenta)',
            marginBottom: '1rem',
            textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
          }}
        >
          Filtros
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                style={{
                  padding: '1rem 1.25rem',
                  textAlign: 'left',
                  border: 'none',
                  borderRadius: '12px',
                  background:
                    activeFilter === filter.id
                      ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(255, 0, 255, 0.1))'
                      : 'rgba(255, 255, 255, 0.02)',
                  color:
                    activeFilter === filter.id
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderLeft:
                    activeFilter === filter.id
                      ? '3px solid var(--accent-cyan)'
                      : '3px solid transparent',
                  boxShadow:
                    activeFilter === filter.id
                      ? '0 0 20px rgba(0, 245, 255, 0.2)'
                      : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== filter.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderLeft = '3px solid rgba(0, 245, 255, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== filter.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderLeft = '3px solid transparent';
                  }
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color:
                      activeFilter === filter.id
                        ? 'var(--accent-cyan)'
                        : 'var(--text-muted)',
                  }}
                />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Stats Card */}
      <div
        style={{
          marginTop: 'auto',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.05), rgba(255, 0, 255, 0.05))',
          borderRadius: '16px',
          border: '1px solid rgba(0, 245, 255, 0.1)',
          boxShadow: '0 0 30px rgba(0, 245, 255, 0.1)',
        }}
      >
        <h3
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--accent-gold)',
            marginBottom: '1rem',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          Market Sentiment
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
              }}
            >
              BTC Dominance
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--accent-cyan)',
                textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
              }}
            >
              52.3%
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
              }}
            >
              Fear & Greed
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--status-green)',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}
            >
              75
            </span>
          </div>
          <div
            style={{
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                width: '75%',
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-magenta))',
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
});

export { SidebarComponent as Sidebar };
