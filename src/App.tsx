/**
 * Dashboard de Criptomonedas - Versión Moderna
 * 
 * Características:
 * - Diseño minimalista y limpio
 * - Modo oscuro/claro intercalable
 * - SEO optimizado
 * - Rendimiento optimizado con lazy loading
 * 
 * Mejores prácticas aplicadas:
 * - rerender-memo: Componentes memoizados
 * - bundle-dynamic-imports: Lazy loading para gráficos
 * - frontend-design: UI/UX moderno y accesible
 */

import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Header } from './components/Layout';
import { CryptoList } from './components/CryptoList';
import { SearchBar } from './components/SearchBar';
import { CryptoControls } from './components/CryptoControls';
import {
  TableSkeleton,
  ChartSkeleton,
  ErrorMessage,
  EmptyState,
} from './components/LoadingState';
import {
  useCryptoData,
  useChartData,
  useAutoRefresh,
  useCryptoFiltering,
} from './hooks';
import type { Cryptocurrency, TimeFrame, SearchResult, FilterType } from './types';

// Lazy load del componente de gráfico (recharts es pesado)
const PriceChart = lazy(() => import('./components/PriceChart').then(m => ({ default: m.PriceChart })));

function App() {
  // Estado
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);
  const [timeframe, setTimeframe] = useState<TimeFrame>('24h');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  // Hooks de datos
  const {
    data: cryptos,
    isLoading: isLoadingCryptos,
    isError: isErrorCryptos,
    error: errorCryptos,
    refetch: refetchCryptos,
  } = useCryptoData(1, 50);

  // Hook de filtrado con arquitectura de dos etapas
  const {
    filteredCryptos,
    isLoading: isFiltering,
    isError: isFilterError,
    filteringState,
    refresh: refreshFilter,
  } = useCryptoFiltering(cryptos || [], currentFilter);

  const {
    data: chartData,
    isLoading: isLoadingChart,
    isError: isErrorChart,
    error: errorChart,
    refetch: refetchChart,
  } = useChartData(selectedCrypto?.id || null, timeframe);

  // Auto-refresh
  const { lastUpdated, nextUpdateIn, refresh } = useAutoRefresh(
    60000,
    refetchCryptos
  );

  // Handlers
  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleSelectCrypto = useCallback((crypto: Cryptocurrency) => {
    setSelectedCrypto(crypto);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedCrypto(null);
    // Scroll al inicio de la sección de mercado en móvil
    if (window.innerWidth < 768) {
      const sectionHeader = document.querySelector('.app-section-header');
      if (sectionHeader) {
        sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    if (filteredCryptos) {
      const found = filteredCryptos.find((c) => c.id === result.id);
      if (found) {
        setSelectedCrypto(found);
      }
    }
  }, [filteredCryptos]);

  const handleTimeframeChange = useCallback((tf: TimeFrame) => {
    setTimeframe(tf);
  }, []);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setCurrentFilter(filter);
  }, []);

  const handleFilterRefresh = useCallback(() => {
    refreshFilter();
  }, [refreshFilter]);

  const handleChartRetry = useCallback(() => {
    refetchChart();
  }, [refetchChart]);

  // Datos del gráfico
  const displayChartData = useMemo(() => {
    if (selectedCrypto && chartData) {
      return {
        data: chartData,
        name: selectedCrypto.name,
        symbol: selectedCrypto.symbol,
      };
    }
    if (cryptos && cryptos.length > 0 && !selectedCrypto) {
      const bitcoin = cryptos.find((c) => c.id === 'bitcoin') || cryptos[0];
      return {
        data: [],
        name: bitcoin.name,
        symbol: bitcoin.symbol,
      };
    }
    return null;
  }, [selectedCrypto, chartData, cryptos]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      
      {/* Header */}
      <Header
        lastUpdated={lastUpdated}
        nextUpdateIn={nextUpdateIn}
        onRefresh={handleRefresh}
        isLoading={isLoadingCryptos}
      />

      {/* Main Content */}
      <main
        id="main-content"
        className="main-content"
        style={{
          flex: 1,
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
          padding: 'var(--space-8)',
        }}
      >
        {/* Layout Grid - Responsivo */}
        <div className="app-layout-grid">
          {/* Columna izquierda: Búsqueda y Gráfico */}
          <div className="app-left-column">
            {/* Search */}
            <SearchBar
              onSelect={handleSearchSelect}
              placeholder="Buscar criptomoneda..."
            />

            {/* Chart - En desktop siempre visible, en móvil solo cuando hay selección */}
            <div className={`app-chart-container ${selectedCrypto ? 'has-selection' : ''}`}>
              <Suspense fallback={<ChartSkeleton />}>
                <PriceChart
                  data={displayChartData?.data || []}
                  timeframe={timeframe}
                  isLoading={isLoadingChart}
                  isError={isErrorChart}
                  error={errorChart}
                  onRetry={handleChartRetry}
                  coinName={displayChartData?.name}
                  coinSymbol={displayChartData?.symbol}
                />
              </Suspense>
            </div>
          </div>

          {/* Columna derecha: Controles y Tabla */}
          <div className="app-right-column">
            {/* Header de sección */}
            <div className="app-section-header">
              <h2
                style={{
                  margin: 0,
                  fontSize: 'var(--font-2xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Mercado
              </h2>
              {selectedCrypto && (
                <button
                  onClick={handleClearSelection}
                  className="btn btn-secondary"
                >
                  Ver todas
                </button>
              )}
            </div>

            {/* Controles */}
            {!isLoadingCryptos && !isErrorCryptos && cryptos && cryptos.length > 0 && (
              <CryptoControls
                selectedTimeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                filteringState={filteringState}
                onRefresh={handleFilterRefresh}
                isLoading={isFiltering}
              />
            )}

            {/* Estados de carga/error */}
            {(isLoadingCryptos || isFiltering) && <TableSkeleton rows={10} />}
            
            {isErrorCryptos && (
              <ErrorMessage
                message={errorCryptos?.message || 'Error al cargar criptomonedas'}
                onRetry={refetchCryptos}
              />
            )}
            
            {isFilterError && (
              <ErrorMessage
                message="Error al filtrar criptomonedas"
                onRetry={refreshFilter}
              />
            )}

            {/* Tabla */}
            {!isLoadingCryptos && !isErrorCryptos && !isFiltering && filteredCryptos && filteredCryptos.length > 0 && (
              <CryptoList
                cryptos={filteredCryptos}
                selectedCryptoId={selectedCrypto?.id}
                onSelectCrypto={handleSelectCrypto}
              />
            )}
            
            {!isLoadingCryptos && !isErrorCryptos && !isFiltering && (!filteredCryptos || filteredCryptos.length === 0) && (
              <EmptyState message="No se encontraron criptomonedas con los filtros seleccionados" />
            )}
          </div>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="app-footer">
        <p className="app-footer-text">
          Datos proporcionados por{' '}
          <a
            href="https://www.coingecko.com"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer-link"
          >
            CoinGecko
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
