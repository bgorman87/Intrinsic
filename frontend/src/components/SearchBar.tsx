import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';
import { searchStocks } from '../api';
import { SearchResult } from '../types';
import { formatDollar } from '../utils';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
      setResults([]);
    }
  };

  useEffect(() => {
    if (query.length >= 2) {
      const fetchResults = async () => {
        try {
          const data = await searchStocks(query);
          setResults(data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };

      fetchResults();
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStockClick = ({ exchange, symbol }: { exchange: string; symbol: string }) => {
    navigate(`/stock/${exchange}/${symbol}`);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="search__input"
          placeholder="Search for stock ticker..."
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit" className="search__button">
          <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
        </button>
      </form>
      {dropdownVisible && (
        <div className="search-dropdown">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div 
              key={index} 
              className="search-dropdown__item"
              onClick={() => handleStockClick({ exchange: result.exchange, symbol: result.symbol })}
              >
                <div className="search-dropdown__symbol">
                  <span>{result.symbol} ({result.exchange.toUpperCase()})</span>
                  <span className="search-dropdown__price">{formatDollar(result.current)}</span>
                </div>
                <div className="search-dropdown__title">{result.title}</div>
                <div className="search-dropdown__industry">Industry: {result.industry}</div>
                <div className="search-dropdown__quality">
                  Quality: <span className={`quality quality-${result.quality}`}>
                    {['Great', 'Good', 'Okay', 'Bad'][result.quality - 1]}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="search-dropdown__no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
