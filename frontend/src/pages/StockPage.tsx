import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchStockBySymbol } from "../api";
import { Stock } from "../types";
import "../styles/StockPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Props {
  theme: string;
  switchTheme: () => void;
}

const StockPage = ({ theme, switchTheme }: Props) => {
  const { exchange = '', symbol = '' } = useParams<{ exchange: string; symbol: string }>();
  const [stock, setStock] = useState<Stock | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await fetchStockBySymbol({ exchange, symbol });
        setStock(data);
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
    <div className='stock-page' data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme}/>
      <h1>{stock.symbol}</h1>
      <Footer />
    </div>
  );
};

export default StockPage;
