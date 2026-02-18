/**
 * Componente PriceChart - Gráfico optimizado
 * 
 * Optimizaciones:
 * - rerender-memo: Componente memoizado
 * - Manejo de errores con retry
 * - Downsampling de datos
 * - Sin animaciones para mejor rendimiento
 * - Diseño responsivo con CSS classes
 */

import { memo, useMemo, useCallback } from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { ChartDataPoint, TimeFrame } from '../../types';
import { formatPrice, formatDate } from '../../utils';
import { useTheme } from '../../context/ThemeContext';
import { downsampleData } from '../../utils/chartUtils';

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

const CustomTooltip = memo(function CustomTooltip({
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
          border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2) var(--space-3)',
        }}
      >
        <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
          {formatDate(label || 0)}
        </p>
        <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--accent-primary)' }}>
          {formatPrice(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
});

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

  const { priceChange, isPositive, lastPrice, optimizedData } = useMemo(() => {
    if (!data || data.length <= 1) {
      return { priceChange: 0, isPositive: false, lastPrice: 0, optimizedData: [] };
    }
    
    const isMobile = window.innerWidth < 768;
    const maxPoints = isMobile ? 50 : 100;
    const downsampled = downsampleData(data, maxPoints);
    
    const firstPrice = downsampled[0].price;
    const lastPrice = downsampled[downsampled.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return { priceChange: change, isPositive: change >= 0, lastPrice, optimizedData: downsampled };
  }, [data]);

  const formatXAxis = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe === '1h' || timeframe === '24h') {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }, [timeframe]);

  const strokeColor = isPositive ? '#10b981' : '#ef4444';

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

  if (!optimizedData || optimizedData.length === 0) {
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
            data={optimizedData}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="var(--border-default)"
              tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => formatPrice(value)}
              stroke="var(--border-default)"
              tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="price-chart-footer">
        <span>{optimizedData.length} puntos</span>
        <span>{timeframeLabel}</span>
      </div>
    </div>
  );
});

export { PriceChartComponent as PriceChart };
