import "../styles/StockList.css";
import { Stock } from "../types";

interface Props {
  title: string;
  stockData: Stock[];
}

const StockList = ({ title, stockData }: Props) => {

  return (
    <div className="stock-list">
      <h2>{title.toUpperCase()}</h2>
      <div className="stock-list__stocks">
        {stockData.map((stock) => (
          <div className="stock-list__stock">
            <div className="stock-list__stock-title">
              <h2 className="stock-list__stock__ticker">{stock.ticker.toUpperCase()}</h2>
              <h2 className="stock-list__stock__price">${stock.price}</h2>
            </div>
            <h3 className="stock-list__stock__name">{stock.title}</h3>
            <div className="stock-list__intrinsic-values">
              <p className="stock-list__intrinsic__value pe" data-stock={stock.pe > stock.price}>${stock.pe.toFixed(2)}</p>
              <p className="stock-list__intrinsic__value roe" data-stock={stock.roe > stock.price}>${stock.roe.toFixed(2)}</p>
              <p className="stock-list__intrinsic__value dcf" data-stock={stock.dcf > stock.price}>${stock.dcf.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;
