/**
 * Componente SearchBar - Barra de búsqueda de criptomonedas
 * 
 * Diseño responsivo con CSS classes
 * 
 * Optimizaciones aplicadas:
 * - rerender-memo: Componente memoizado
 * - bundle-barrel-imports: Importación directa de lucide-react
 */

import { useState, useRef, useEffect, memo } from 'react';
import { Search, X } from 'lucide-react';
import { searchCryptocurrencies } from '../../services';
import { sanitizeSearchQuery } from '../../utils/security';
import type { SearchResult } from '../../types';

interface SearchBarProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
}

const SearchBarComponent = memo(function SearchBar({
  onSelect,
  placeholder = 'Buscar criptomoneda...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sanitizedQuery = sanitizeSearchQuery(query);
    
    const timer = setTimeout(async () => {
      if (sanitizedQuery) {
        setIsLoading(true);
        try {
          const response = await searchCryptocurrencies(sanitizedQuery);
          setResults(response.coins.slice(0, 5));
          setIsOpen(true);
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelect?.(result);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="search-bar-container">
      <div className="search-bar-inner">
        <Search
          size={18}
          className="search-bar-icon"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="search-bar-input"
        />
        {query && (
          <button
            onClick={handleClear}
            className="search-bar-clear-btn"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
        {isLoading && (
          <div className="search-bar-loading" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-bar-dropdown">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="search-bar-result"
            >
              <img
                src={result.thumb}
                alt={result.name}
                className="search-bar-result-image"
              />
              <div className="search-bar-result-info">
                <div className="search-bar-result-name">{result.name}</div>
                <div className="search-bar-result-symbol">{result.symbol}</div>
              </div>
              {result.market_cap_rank && (
                <span className="search-bar-result-rank">
                  #{result.market_cap_rank}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export { SearchBarComponent as SearchBar };
