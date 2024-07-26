import "../styles/StockList.css";
import { Quality, Stock } from "../types";
import { useEffect, useState } from "react";
import { fetchStocksByQuality } from '../api';

interface StockCardProps {
  quality: Quality;
}

const qualityMap: { [key in Quality]: string } = {
  1: 'great',
  2: 'good',
  3: 'okay',
};

const StockList = ({ quality }: StockCardProps) => {

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await fetchStocksByQuality(qualityMap[quality]);
        setStocks(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchStocks();
  }, [quality]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="stock-list">
      <h2>{qualityMap[quality].toUpperCase()}</h2>
      <div className="stock-list__stocks">
        {stocks.map((stock, index) => (
          <div key={index} className="stock-list__stock">
            <div className="stock-list__stock-title">
              <h2 className="stock-list__stock__ticker">{stock.symbol.toUpperCase()}</h2>
              <h2 className="stock-list__stock__price">${stock.current.toFixed(2)}</h2>
            </div>
            <div className="stock-list__stock__details">
              <div className="stock-list__stock__summary__icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.5A6.5 6.5 0 1 1 8 1a6.5 6.5 0 0 1 0 13zm0-9a.75.75 0 0 0-.75.75v5a.75.75 0 0 0 1.5 0v-5A.75.75 0 0 0 8 5.5zm0-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/>
                </svg>
                <span className="tooltiptext">Some Text</span>
              </div>
              <h3 className="stock-list__stock__name">{stock.title}</h3>
            </div>
            <div className="stock-list__intrinsic-values">
              <p className="stock-list__intrinsic__value pe" data-stock={stock.pe > stock.current}>${stock.pe?.toFixed(2)}</p>
              <p className="stock-list__intrinsic__value roe" data-stock={stock.roe > stock.current}>${stock.roe?.toFixed(2)}</p>
              <p className="stock-list__intrinsic__value dcf" data-stock={stock.dcf > stock.current}>${stock.dcf?.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default StockList;
