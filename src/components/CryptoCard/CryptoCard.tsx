/**
 * Componente CryptoCard - Tarjeta individual de criptomoneda
 * Muestra información resumida en formato card (usado en móvil)
 * 
 * Diseño responsivo con CSS classes
 */

import { memo } from 'react';
import type { Cryptocurrency } from '../../types';
import { formatPrice, formatPercentage, formatMarketCap } from '../../utils';

interface CryptoCardProps {
  crypto: Cryptocurrency;
  isSelected?: boolean;
  onClick?: () => void;
}

const CryptoCardComponent = memo(function CryptoCard({ 
  crypto, 
  isSelected = false, 
  onClick 
}: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <div
      onClick={onClick}
      className={`crypto-card ${isSelected ? 'crypto-card-selected' : ''}`}
      role="button"
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick) onClick();
      }}
    >
      <div className="crypto-card-header">
        <div className="crypto-card-identity">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="crypto-card-image"
            loading="lazy"
          />
          <div className="crypto-card-name-group">
            <h3 className="crypto-card-name">{crypto.name}</h3>
            <span className="crypto-card-symbol">{crypto.symbol}</span>
          </div>
        </div>
        <span className="crypto-card-rank">#{crypto.market_cap_rank}</span>
      </div>

      <div className="crypto-card-price">
        {formatPrice(crypto.current_price)}
      </div>

      <div className="crypto-card-footer">
        <span className={`crypto-card-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '▲' : '▼'} {formatPercentage(crypto.price_change_percentage_24h)}
        </span>
        <span className="crypto-card-market-cap">
          MC: {formatMarketCap(crypto.market_cap)}
        </span>
      </div>
    </div>
  );
});

export { CryptoCardComponent as CryptoCard };
