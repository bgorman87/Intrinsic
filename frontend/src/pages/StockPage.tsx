import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchFullStockBySymbol } from "../api";
import { FullStock } from "../types";
import "../styles/StockPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatDollar, formatNumber, formatPercent } from "../utils";

interface Props {
  theme: string;
  switchTheme: () => void;
}

const StockPage = ({ theme, switchTheme }: Props) => {
  const { exchange = "", symbol = "" } = useParams<{
    exchange: string;
    symbol: string;
  }>();
  const [stock, setStock] = useState<FullStock | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await fetchFullStockBySymbol({ exchange, symbol });
        setStock(data);
      } catch (error) {
        setError(error as Error);
      }
    };

    if (exchange && symbol) {
      fetchStock();
    }
  }, [exchange, symbol]);

  const calculateEPS = (
    netIncome: number | null,
    sharesOutstanding: number | null
  ) => (netIncome && sharesOutstanding ? netIncome / sharesOutstanding : null);

  const calculatePERatio = (current: number | null, eps: number | null) =>
    current && eps ? current / eps : null;

  const calculateEnterpriseValue = (
    marketCap: number | null,
    debt: number | null,
    cash: number | null
  ) =>
    marketCap && debt !== null && cash !== null
      ? marketCap + debt - cash
      : null;

  const calculateBookValuePerShare = (
    assets: number | null,
    liabilities: number | null,
    sharesOutstanding: number | null
  ) =>
    assets && liabilities && sharesOutstanding
      ? (assets - liabilities) / sharesOutstanding
      : null;

  const calculateReturnOnAssets = (
    netIncome: number | null,
    assets: number | null
  ) => (netIncome && assets ? netIncome / assets : null);

  const calculateCurrentRatio = (
    assets: number | null,
    liabilities: number | null
  ) => (assets && liabilities ? assets / liabilities : null);

  const calculateDebtToEquity = (debt: number | null, equity: number | null) =>
    debt && equity ? debt / equity : null;

  const calculateDividendYield = (
    trailingDividend: number | null,
    current: number | null
  ) =>
    trailingDividend && current ? (trailingDividend / current) * 100 : null;

  const calculateCashFlowYield = (
    fcf: number | null,
    marketCap: number | null
  ) => (fcf && marketCap ? fcf / marketCap : null);

  const calculatePriceToBook = (current: number | null, bvps: number | null) =>
    current && bvps ? current / bvps : null;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!stock) {
    return <div>Loading...</div>;
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const eps = calculateEPS(stock.netIncome, stock.sharesOutstandingRaw);
  const peRatio = calculatePERatio(stock.current, eps);
  const enterpriseValue = calculateEnterpriseValue(
    stock.marketCap,
    stock.debt,
    stock.cashRawEq
  );
  const bookValuePerShare = calculateBookValuePerShare(
    stock.assets,
    stock.liabilities,
    stock.sharesOutstandingRaw
  );
  const returnOnAssets = calculateReturnOnAssets(stock.netIncome, stock.assets);
  const currentRatio = calculateCurrentRatio(stock.assets, stock.liabilities);
  const debtToEquity = calculateDebtToEquity(
    stock.debt,
    stock.stockholdersEquityRaw
  );
  const dividendYield = calculateDividendYield(
    stock.trailingDividendRateRaw,
    stock.current
  );
  const cashFlowYield = calculateCashFlowYield(
    stock.fcfRawValue,
    stock.marketCap
  );
  const priceToBook = calculatePriceToBook(stock.current, bookValuePerShare);

  const lastUpdated = stock.lastUpdated
    ? new Date(stock.lastUpdated)
    : new Date();

  console.log(stock);

  return (
    <div className="stock-page" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="stock-page__header">
        <div className="stock-page__header__title__container">
          <div className="stock-page__header__title">
            <h1>
              {stock.title} ({stock.symbol.toUpperCase()})
            </h1>
            <p>
              Last Updated: {lastUpdated.toLocaleDateString("en-US", options)}
            </p>
          </div>
        </div>
        <div className="stock-page__header__details__container">
          <div className="stock-page__header__details">
            <p className="stock-page__header__current">
              {formatDollar(stock.current)}
            </p>
            <p className={`quality quality-${stock.quality}`}>
              {["Great", "Good", "Okay", "Bad"][stock.quality - 1]}
            </p>
          </div>
        </div>
      </div>
      <div className="stock-page__content">
        <div className="stock-page__content__details">
          <div className="stock-page__intrinsic-values">
            <p
              className="stock-list__intrinsic__value pe"
              data-stock={
                stock.pe && stock.current ? stock.pe > stock.current : "N/A"
              }
            >
              {formatDollar(stock.pe)}
            </p>
            <p
              className="stock-list__intrinsic__value roe"
              data-stock={
                stock.roe && stock.current ? stock.roe > stock.current : "N/A"
              }
            >
              {formatDollar(stock.roe)}
            </p>
            <p
              className="stock-list__intrinsic__value dcf"
              data-stock={
                stock.dcf && stock.current ? stock.dcf > stock.current : "N/A"
              }
            >
              {formatDollar(stock.dcf)}
            </p>
          </div>
          <div className="stock-page__content__news">
            <h2>News Stories</h2>
            <p>some news here</p>
          </div>
        </div>
        <div className="stock-page__content__metrics__container">
          <div className="stock-page__content__metric_cards">
            <div className="stock-page__content__metrics">
              <h2>Key Metrics</h2>
              <div className="stock-page__content__metric">
                <p className="metric-title">Market Cap</p>
                <p className="metric-quantity">
                  {formatDollar(stock.marketCap)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Growth Estimate (5 yr)</p>
                <p className="metric-quantity">
                  {formatPercent(stock.growthEstimate)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Shares Outstanding</p>
                <p className="metric-quantity">
                  {formatNumber(stock.sharesOutstandingRaw)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">EPS (Earnings Per Share)</p>
                <p className="metric-quantity">{formatDollar(eps)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">P/E Ratio</p>
                <p className="metric-quantity">{formatNumber(peRatio)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Enterprise Value</p>
                <p className="metric-quantity">
                  {formatDollar(enterpriseValue)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Book Value Per Share</p>
                <p className="metric-quantity">
                  {formatDollar(bookValuePerShare)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">ROA (Return on Assets)</p>
                <p className="metric-quantity">
                  {formatPercent(returnOnAssets)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Current Ratio</p>
                <p className="metric-quantity">{formatNumber(currentRatio)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">D/E Ratio (Debt-to-Equity)</p>
                <p className="metric-quantity">{formatNumber(debtToEquity)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Dividend Yield</p>
                <p className="metric-quantity">
                  {formatPercent(dividendYield)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Cash Flow Yield</p>
                <p className="metric-quantity">
                  {formatPercent(cashFlowYield)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">P/B Ratio (Price-to-Book)</p>
                <p className="metric-quantity">{formatNumber(priceToBook)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">ESG Score</p>
                <p className="metric-quantity">
                  {formatNumber(stock.esgScore)}
                </p>
              </div>
            </div>
            <div className="stock-page__content__metrics">
              <h2>Financial Details</h2>
              <div className="stock-page__content__metric">
                <p className="metric-title">Revenue</p>
                <p className="metric-quantity">{formatDollar(stock.revenue)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Net Income</p>
                <p className="metric-quantity">
                  {formatDollar(stock.netIncome)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Total Assets</p>
                <p className="metric-quantity">{formatDollar(stock.assets)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Total Liabilities</p>
                <p className="metric-quantity">
                  {formatDollar(stock.liabilities)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Total Debt</p>
                <p className="metric-quantity">{formatDollar(stock.debt)}</p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Long Term Debt</p>
                <p className="metric-quantity">
                  {formatDollar(stock.longTermDebt)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Cash & Equivalents</p>
                <p className="metric-quantity">
                  {formatDollar(stock.cashRawEq)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Free Cash Flow</p>
                <p className="metric-quantity">
                  {formatDollar(stock.fcfRawValue)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Stockholders Equity</p>
                <p className="metric-quantity">
                  {formatDollar(stock.stockholdersEquityRaw)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Historical ROE</p>
                <p className="metric-quantity">
                  {formatPercent(stock.historicalROE)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Trailing Dividend Rate</p>
                <p className="metric-quantity">
                  {formatDollar(stock.trailingDividendRateRaw)}
                </p>
              </div>
              <div className="stock-page__content__metric">
                <p className="metric-title">Controversy Level</p>
                <p className="metric-quantity">
                  {formatNumber(stock.controversy)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StockPage;
