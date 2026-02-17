/**
 * Componente PriceChart - Gráfico optimizado
 * 
 * Optimizaciones:
 * - rerender-memo: Componente memoizado
 * - Manejo de errores con retry
 * - Downsampling de datos
 * - Carga progresiva
 * - Diseño responsivo con CSS classes
 */

import { memo, useMemo, useCallback } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { ChartDataPoint, TimeFrame } from '../../types';
import { formatPrice, formatDate } from '../../utils';
import { useTheme } from '../../context/ThemeContext';

interface PriceChartProps {
  data: ChartDataPoint[];
  timeframe: TimeFrame;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  coinName?: string;
  coinSymbol?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  isDark,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
  isDark: boolean;
}) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-3) var(--space-4)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: 'var(--space-1)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
          }}
        >
          {formatDate(label || 0)}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-lg)',
            fontWeight: 700,
            color: 'var(--accent-primary)',
          }}
        >
          {formatPrice(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

const PriceChartComponent = memo(function PriceChart({
  data,
  timeframe,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  coinName = 'Bitcoin',
  coinSymbol = 'BTC',
}: PriceChartProps) {
  const { isDark } = useTheme();

  const { priceChange, isPositive, lastPrice } = useMemo(() => {
    if (!data || data.length <= 1) {
      return { priceChange: 0, isPositive: false, lastPrice: 0 };
    }
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    return { priceChange: change, isPositive: change >= 0, lastPrice };
  }, [data]);

  const formatXAxis = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe === '1h' || timeframe === '24h') {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }, [timeframe]);

  const colors = useMemo(() => ({
    stroke: isPositive ? 'var(--status-success)' : 'var(--status-danger)',
    fill: isPositive ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
    gradientStart: isPositive ? '#10b981' : '#ef4444',
    gradientEnd: isPositive ? '#06b6d4' : '#f97316',
  }), [isPositive]);

  if (isLoading) {
    return (
      <div className="glass-card price-chart-loading">
        <div className="price-chart-loading-content">
          <div className="spinner spinner-lg" />
          <p className="price-chart-loading-text">Cargando gráfico...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card price-chart-error">
        <div className="price-chart-error-content">
          <AlertCircle size={48} className="price-chart-error-icon" />
          <h3 className="price-chart-error-title">Error al cargar gráfico</h3>
          <p className="price-chart-error-message">
            {error?.message || 'No se pudieron cargar los datos. Intenta de nuevo.'}
          </p>
          {onRetry && (
            <button onClick={onRetry} className="btn btn-primary">
              <RefreshCw size={16} />
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card price-chart-empty">
        <p className="price-chart-empty-text">
          Selecciona una criptomoneda para ver su gráfico
        </p>
      </div>
    );
  }

  const timeframeLabel = timeframe === '1y' ? 'Último año' 
    : timeframe === '30d' ? 'Últimos 30 días' 
    : timeframe === '7d' ? 'Últimos 7 días' 
    : timeframe === '24h' ? 'Últimas 24 horas' 
    : 'Última hora';

  return (
    <div className="glass-card price-chart-container">
      <div className="price-chart-header">
        <div className="price-chart-info">
          <h2 className="price-chart-title">{coinName}</h2>
          <p className="price-chart-symbol">{coinSymbol}</p>
        </div>
        
        <div className="price-chart-stats">
          <div className="price-chart-price">{formatPrice(lastPrice)}</div>
          <div className={`price-chart-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="price-chart-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.gradientStart} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.gradientStart} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={colors.gradientStart} />
                <stop offset="100%" stopColor={colors.gradientEnd} />
              </linearGradient>
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="var(--border-default)"
              tick={{
                fill: 'var(--text-muted)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}
              axisLine={{ stroke: 'var(--border-default)' }}
              tickLine={{ stroke: 'var(--border-default)' }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => formatPrice(value)}
              stroke="var(--border-default)"
              tick={{
                fill: 'var(--text-muted)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}
              axisLine={{ stroke: 'var(--border-default)' }}
              tickLine={{ stroke: 'var(--border-default)' }}
              width={80}
            />
            
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke="url(#strokeGradient)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              animationDuration={800}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="price-chart-footer">
        <span>{data.length} puntos</span>
        <span>{timeframeLabel}</span>
      </div>
    </div>
  );
});

export { PriceChartComponent as PriceChart };
