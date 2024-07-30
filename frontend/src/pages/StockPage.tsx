import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchStockBySymbol } from "../api";
import { Stock } from "../types";
import "../styles/StockPage.css";

interface Props {
  theme: string;
}

const StockPage = ({ theme }: Props) => {
  const { exchange = '', symbol = '' } = useParams<{ exchange: string; symbol: string }>();
  const [stock, setStock] = useState<Stock | null>(null);
  const [error, setError] = useState<Error | null>(null);

  console.log("StockPage", exchange, symbol);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await fetchStockBySymbol({ exchange, symbol });
        setStock(data);
        console.log("StockPage data", data);
      } catch (error) {
        setError(error);
      }
    };

    if (exchange && symbol) {
      fetchStock();
    }
  }, [exchange, symbol]);

  if (error) {
    return <div>Error: {error.message}</div>; // Need to create Error page
  }

  if (!stock) {
    return <div>Loading...</div>; // Need to add content loader here
  }

  return (
    <div className={`stock-page ${theme}`}>
      <h1>{stock.symbol}</h1>
    </div>
  );
};

export default StockPage;
