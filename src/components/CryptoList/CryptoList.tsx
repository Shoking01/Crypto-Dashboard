/**
 * Componente CryptoList - Tabla moderna y limpia
 * 
 * Diseño minimalista con:
 * - Líneas limpias y espaciado generoso
 * - Estados visuales sutiles
 * - Sorting intuitivo
 * - Glassmorphism refinado
 * - Vista de cards en móvil
 * 
 * Optimizaciones:
 * - memo para evitar re-renders
 * - useMemo para sorting
 * - useCallback para handlers
 */

import { useState, useMemo, memo, useCallback } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Cryptocurrency } from '../../types';
import { formatPrice, formatPercentage, formatMarketCap } from '../../utils';
import { CryptoCard } from '../CryptoCard';

interface CryptoListProps {
  cryptos: Cryptocurrency[];
  selectedCryptoId?: string | null;
  onSelectCrypto?: (crypto: Cryptocurrency) => void;
  isLoading?: boolean;
}

type SortField = 'market_cap_rank' | 'name' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';
type SortDirection = 'asc' | 'desc';

function SortIcon({ field, currentField, direction }: { field: SortField; currentField: SortField; direction: SortDirection }) {
  if (currentField !== field) {
    return <ArrowUpDown size={14} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />;
  }
  return direction === 'asc' 
    ? <ArrowUp size={14} style={{ color: 'var(--accent-primary)' }} />
    : <ArrowDown size={14} style={{ color: 'var(--accent-primary)' }} />;
}

const CryptoListComponent = memo(function CryptoList({
  cryptos,
  selectedCryptoId,
  onSelectCrypto,
  isLoading = false,
}: CryptoListProps) {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedCryptos = useMemo(() => {
    if (cryptos.length === 0) return [];
    
    return [...cryptos].sort((a, b) => {
      let aValue: number | string = a[sortField];
      let bValue: number | string = b[sortField];

      if (aValue === null) aValue = sortDirection === 'asc' ? Infinity : -Infinity;
      if (bValue === null) bValue = sortDirection === 'asc' ? Infinity : -Infinity;

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cryptos, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(dir => dir === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  const handleCardClick = useCallback((crypto: Cryptocurrency) => {
    onSelectCrypto?.(crypto);
  }, [onSelectCrypto]);

  if (isLoading) {
    return (
      <div className="glass-card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
        <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto var(--space-4)' }} />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          Cargando datos del mercado...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="crypto-list-desktop">
        <div
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'var(--glass-blur)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-default)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="crypto-table">
              <thead>
                <tr>
                  <HeaderCell onClick={() => handleSort('market_cap_rank')} sortable>
                    <span className="crypto-table-header-content">
                      # <SortIcon field="market_cap_rank" currentField={sortField} direction={sortDirection} />
                    </span>
                  </HeaderCell>
                  <HeaderCell onClick={() => handleSort('name')} sortable>
                    <span className="crypto-table-header-content">
                      Nombre <SortIcon field="name" currentField={sortField} direction={sortDirection} />
                    </span>
                  </HeaderCell>
                  <HeaderCell onClick={() => handleSort('current_price')} sortable align="right">
                    <span className="crypto-table-header-content crypto-table-align-right">
                      Precio <SortIcon field="current_price" currentField={sortField} direction={sortDirection} />
                    </span>
                  </HeaderCell>
                  <HeaderCell onClick={() => handleSort('price_change_percentage_24h')} sortable align="right">
                    <span className="crypto-table-header-content crypto-table-align-right">
                      24h % <SortIcon field="price_change_percentage_24h" currentField={sortField} direction={sortDirection} />
                    </span>
                  </HeaderCell>
                  <HeaderCell onClick={() => handleSort('market_cap')} sortable align="right">
                    <span className="crypto-table-header-content crypto-table-align-right">
                      Cap. Mercado <SortIcon field="market_cap" currentField={sortField} direction={sortDirection} />
                    </span>
                  </HeaderCell>
                  <HeaderCell onClick={() => handleSort('total_volume')} sortable align="right">
                    <span className="crypto-table-header-content crypto-table-align-right">
                      Volumen 24h <SortIcon field="total_volume" currentField={sortField} direction={sortDirection} />
                    </span>
                  </HeaderCell>
                </tr>
              </thead>
              <tbody>
                {sortedCryptos.map((crypto, index) => (
                  <CryptoTableRow
                    key={crypto.id}
                    crypto={crypto}
                    index={index}
                    isSelected={selectedCryptoId === crypto.id}
                    onSelect={onSelectCrypto}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="crypto-list-mobile">
        {sortedCryptos.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            isSelected={selectedCryptoId === crypto.id}
            onClick={() => handleCardClick(crypto)}
          />
        ))}
      </div>
    </>
  );
});

interface CryptoTableRowProps {
  crypto: Cryptocurrency;
  index: number;
  isSelected: boolean;
  onSelect?: (crypto: Cryptocurrency) => void;
}

const CryptoTableRow = memo(function CryptoTableRow({ 
  crypto, 
  index, 
  isSelected, 
  onSelect 
}: CryptoTableRowProps) {
  const isPositive = (crypto.price_change_percentage_24h ?? 0) >= 0;
  const baseBg = index % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)';

  return (
    <tr
      onClick={() => onSelect?.(crypto)}
      className={`crypto-table-row ${isSelected ? 'crypto-table-row-selected' : ''}`}
      style={{
        cursor: onSelect ? 'pointer' : 'default',
        backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.08)' : baseBg,
      }}
    >
      <td className="crypto-table-cell">
        <span className="crypto-table-rank">
          {crypto.market_cap_rank}
        </span>
      </td>

      <td className="crypto-table-cell crypto-table-name-cell">
        <div className="crypto-table-name-group">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="crypto-table-image"
            loading="lazy"
          />
          <div>
            <div className="crypto-table-name">{crypto.name}</div>
            <div className={`crypto-table-symbol ${isSelected ? 'selected' : ''}`}>
              {crypto.symbol}
            </div>
          </div>
        </div>
      </td>

      <td className="crypto-table-cell crypto-table-align-right">
        <span className="crypto-table-price">
          {formatPrice(crypto.current_price)}
        </span>
      </td>

      <td className="crypto-table-cell crypto-table-align-right">
        <span className={`crypto-table-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}
          {formatPercentage(crypto.price_change_percentage_24h)}
        </span>
      </td>

      <td className="crypto-table-cell crypto-table-align-right">
        <span className="crypto-table-secondary">
          {formatMarketCap(crypto.market_cap)}
        </span>
      </td>

      <td className="crypto-table-cell crypto-table-align-right">
        <span className="crypto-table-secondary">
          {formatMarketCap(crypto.total_volume)}
        </span>
      </td>
    </tr>
  );
});

interface HeaderCellProps {
  children: React.ReactNode;
  onClick?: () => void;
  sortable?: boolean;
  align?: 'left' | 'right';
}

function HeaderCell({ children, onClick, sortable, align = 'left' }: HeaderCellProps) {
  return (
    <th
      onClick={onClick}
      className="crypto-table-header"
      style={{ textAlign: align }}
      data-sortable={sortable}
    >
      {children}
    </th>
  );
}

export { CryptoListComponent as CryptoList };
