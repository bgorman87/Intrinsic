import { useNavigate } from "react-router-dom";
import "../styles/StockList.css";
import { Quality, Stock } from "../types";
import { useState, useEffect } from "react";
import { fetchStocksByQuality } from "../api";
import StockListLoaderContainer from "./StockListLoader";
import { formatDollar, formatNPVDollar } from "../utils";

interface StockCardProps {
  theme: string;
  quality: Quality;
}

const qualityMap: { [key in Quality]: string } = {
  1: "great",
  2: "good",
  3: "okay",
  4: "na",
};

const StockList = ({ theme, quality }: StockCardProps) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

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

  const handleStockClick = ({
    exchange,
    symbol,
  }: {
    exchange: string;
    symbol: string;
  }) => {
    navigate(`/stock/${exchange}/${symbol}`);
  };

  return (
    <div className="stock-list">
      <h2>{qualityMap[quality].toUpperCase()}</h2>
      <div className="stock-list__stocks">
        {stocks.length === 0 ? (
          <StockListLoaderContainer theme={theme} />
        ) : (
          stocks.map((stock: Stock, index) => (
            <div
              key={index}
              onClick={() =>
                handleStockClick({
                  exchange: stock.exchange,
                  symbol: stock.symbol,
                })
              }
              className="stock-list__stock"
            >
              <div className="stock-list__stock-title">
                <h2 className="stock-list__stock__ticker">
                  {stock.symbol.toUpperCase()}
                </h2>
                <h2 className="stock-list__stock__price">
                  {formatDollar(stock.current)}
                </h2>
              </div>
              <div className="stock-list__stock__details">
                {/* <div className="stock-list__stock__summary__icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.5A6.5 6.5 0 1 1 8 1a6.5 6.5 0 0 1 0 13zm0-9a.75.75 0 0 0-.75.75v5a.75.75 0 0 0 1.5 0v-5A.75.75 0 0 0 8 5.5zm0-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
                    />
                  </svg>
                  <span className="tooltiptext">Some Text</span>
                </div> */}
                <h3 className="stock-list__stock__name">{stock.title}</h3>
              </div>
              <div className="stock-list__intrinsic-values">
                <p
                  className="stock-list__intrinsic__value pe"
                  data-stock={stock.pe > stock.current}
                >
                  {formatNPVDollar(stock.pe)}
                </p>
                <p
                  className="stock-list__intrinsic__value roe"
                  data-stock={stock.roe > stock.current}
                >
                  {formatNPVDollar(stock.roe)}
                </p>
                <p
                  className="stock-list__intrinsic__value dcf"
                  data-stock={stock.dcf > stock.current}
                >
                  {formatNPVDollar(stock.dcf)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockList;
