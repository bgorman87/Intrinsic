import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchFullStockBySymbol } from "../api";
import { FullStock } from "../types";
import "../styles/StockPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CollapsibleText from "../components/CollapsibleText";
import Tooltip from '../components/Tooltip';
import {
  formatDollar, formatNPVDollar, formatNumber, formatPercent,
  calculateEPS, calculatePERatio, calculateEnterpriseValue,
  calculateBookValuePerShare, calculateReturnOnAssets,
  calculateAssetsToLiabilities, calculateDebtToEquity,
  calculateDividendYield, calculateCashFlowYield, calculatePriceToBook,
} from "../utils";

const VAL_TOOLTIPS: Record<string, string> = {
  'NPV PE': 'Projects future earnings using analyst growth estimates, then discounts back at 9%. Based on historical P/E as the assumed future multiple.',
  'NPV DCF': 'Discounted Cash Flow — projects free cash flow over 10 years plus a terminal value, then subtracts liabilities and divides by shares outstanding.',
  'Graham': "Graham Number — √(22.5 × EPS × Book Value). Benjamin Graham's formula for the maximum price a defensive investor should pay.",
  'EV/EBITDA': 'Implied fair value if the company traded at a target EV/EBITDA multiple. Capital-structure neutral — useful for comparing leveraged companies.',
  'P/Book': 'Price-to-Book valuation — fair value at a target P/B multiple of 1.5×. Standard method for banks and insurers.',
  'ROE NPV': 'Projects stockholders equity forward using conservative growth, then values the terminal equity at the historical ROE. Only valid for dividend payers.',
  'P/FFO': 'Price to Funds From Operations — the REIT equivalent of P/E. FFO adds back depreciation which artificially depresses REIT earnings.',
  'Div. yield': 'Implied value at a 4% target dividend yield — a conservative benchmark for income-focused investments like REITs.',
};

interface Props { theme: string; switchTheme: () => void; }

type DetailTab = 'valuation' | 'financials' | 'news' | 'about';

const categoryLabel: Record<string, string> = {
  asset_light: 'Asset-light', asset_heavy: 'Asset-heavy',
  financial: 'Financial', cyclical: 'Cyclical',
  reit: 'REIT', unknown: 'Unknown',
};

const MetricRow = ({ label, value, highlight }: { label: string; value: string; highlight?: 'good' | 'warn' | 'bad' | null }) => {
  const color = highlight === 'good' ? 'var(--green)' : highlight === 'warn' ? 'var(--amber)' : highlight === 'bad' ? 'var(--red)' : 'var(--text-primary)';
  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <span className="metric-value" style={{ color }}>{value}</span>
    </div>
  );
};

const ValCard = ({ label, value, current, exchange, tooltip }: { label: string; value: number | null; current: number | null; exchange: string; tooltip?: string }) => {
  const above = value !== null && current !== null ? value > current : null;
  const pct = value !== null && current !== null && current !== 0 ? ((value - current) / current) * 100 : null;
  const color = above === true ? 'var(--green)' : above === false ? 'var(--red)' : 'var(--text-muted)';
  return (
    <div className="val-card">
      <div className="val-card__label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {label}{tooltip && <Tooltip text={tooltip} />}
      </div>
      <div className="val-card__value" style={{ color }}>{formatNPVDollar(value, exchange)}</div>
      {pct !== null && (
        <div className="val-card__pct" style={{ color }}>
          {pct > 0 ? '+' : ''}{pct.toFixed(1)}% vs current
        </div>
      )}
    </div>
  );
};

const DcfBar = ({ bear, base, bull, current, exchange }: {
  bear: number | null; base: number | null; bull: number | null;
  current: number | null; exchange: string;
}) => {
  const dcfVals = [bear, base, bull].filter(v => v !== null) as number[];
  if (dcfVals.length < 2) return null;

  const dcfMin = Math.min(...dcfVals);
  const dcfMax = Math.max(...dcfVals);
  const pad = (dcfMax - dcfMin) * 0.08 || 1;
  const scaleMin = dcfMin - pad;
  const scaleMax = dcfMax + pad;
  const range = scaleMax - scaleMin;
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - scaleMin) / range) * 100));

  // Determine if current price is within the DCF range or outside it
  const currentWithinRange = current !== null && current >= scaleMin && current <= scaleMax;
  const currentBelowRange = current !== null && current < scaleMin;
  const currentAboveRange = current !== null && current > scaleMax;

  return (
    <div className="dcf-bar-wrap">
      <div className="dcf-bar__label">
        DCF scenario range
        {currentBelowRange && (
          <span className="dcf-bar__outside-label dcf-bar__outside-label--below">
            Current price {formatDollar(current, exchange)} is below all scenarios
          </span>
        )}
        {currentAboveRange && (
          <span className="dcf-bar__outside-label dcf-bar__outside-label--above">
            Current price {formatDollar(current, exchange)} is above all scenarios
          </span>
        )}
      </div>
      <div className="dcf-bar__track">
        {bear !== null && bull !== null && (
          <div className="dcf-bar__range" style={{ left: `${pct(Math.min(bear, bull))}%`, width: `${Math.max(1, pct(Math.max(bear, bull)) - pct(Math.min(bear, bull)))}%` }} />
        )}
        {currentWithinRange && current !== null && (
          <div className="dcf-bar__current" style={{ left: `${pct(current)}%` }}>
            <div className="dcf-bar__current-line" />
            <div
              className="dcf-bar__current-label"
              style={{
                transform: pct(current) < 15 ? 'none' : pct(current) > 85 ? 'translateX(-100%)' : 'translateX(-50%)',
                left: pct(current) < 15 ? 0 : pct(current) > 85 ? 'auto' : '50%',
                right: pct(current) > 85 ? 0 : 'auto',
                position: 'absolute',
              }}
            >
              {formatDollar(current, exchange)}
            </div>
          </div>
        )}
      </div>
      <div className="dcf-bar__endpoints">
        <span style={{ color: 'var(--red)' }}>Bear {formatNPVDollar(bear, exchange)}</span>
        <span>Base {formatNPVDollar(base, exchange)}</span>
        <span style={{ color: 'var(--green)' }}>Bull {formatNPVDollar(bull, exchange)}</span>
      </div>
    </div>
  );
};

export default function StockPage({ theme, switchTheme }: Props) {
  const { exchange = "", symbol = "" } = useParams<{ exchange: string; symbol: string }>();
  const [stock, setStock] = useState<FullStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tab, setTab] = useState<DetailTab>('valuation');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try { setStock(await fetchFullStockBySymbol({ exchange, symbol })); }
      catch (e) { setError(e as Error); }
      finally { setLoading(false); }
    };
    if (exchange && symbol) fetch();
  }, [exchange, symbol]);

  if (error) return (
    <div className="stock-page" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="stock-page__error">
        <p>Could not load {symbol.toUpperCase()}.</p>
        <button onClick={() => navigate('/')}>← Back</button>
      </div>
      <Footer />
    </div>
  );

  if (loading || !stock) return (
    <div className="stock-page" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="stock-page__loading">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-block" style={{ height: i === 0 ? 80 : 120, marginBottom: 12 }} />)}
      </div>
      <Footer />
    </div>
  );

  const ex = stock.exchange;
  const lastUpdated = stock.lastUpdated ? new Date(stock.lastUpdated) : null;

  const eps = calculateEPS(stock.netIncome, stock.sharesOutstandingRaw);
  const peRatio = calculatePERatio(stock.current, eps);
  const ev = calculateEnterpriseValue(stock.marketCap, stock.debt, stock.cashRawEq);
  const bvps = stock.bookValuePerShare ?? calculateBookValuePerShare(stock.assets, stock.liabilities, stock.sharesOutstandingRaw);
  const roa = calculateReturnOnAssets(stock.netIncome, stock.assets);
  const al = calculateAssetsToLiabilities(stock.assets, stock.liabilities);
  const de = calculateDebtToEquity(stock.debt, stock.stockholdersEquityRaw);
  const divYield = calculateDividendYield(stock.trailingDividendRateRaw, stock.current);
  const cfYield = calculateCashFlowYield(stock.fcfRawValue, stock.marketCap);
  const pb = calculatePriceToBook(stock.current, bvps);

  const roicHighlight = stock.roic !== null ? (stock.roic >= 0.15 ? 'good' : stock.roic >= 0.08 ? null : 'warn') as 'good' | 'warn' | null : null;
  const pioHighlight = stock.piotroski !== null ? (stock.piotroski >= 7 ? 'good' : stock.piotroski >= 4 ? 'warn' : 'bad') as 'good' | 'warn' | 'bad' : null;
  const deHighlight = de !== null ? (de < 0.5 ? 'good' : de < 1.5 ? null : 'warn') as 'good' | 'warn' | null : null;

  const aboveCount = [stock.val1, stock.val2, stock.val3].filter(v => v !== null && stock.current !== null && v > stock.current).length;
  const verdictText = aboveCount === 3 ? 'All 3 estimates above current price'
    : aboveCount === 2 ? '2 of 3 estimates above current price'
    : aboveCount === 1 ? '1 of 3 estimates above current price'
    : 'Trading above all estimates';
  const verdictColor = aboveCount >= 2 ? 'var(--green)' : aboveCount === 1 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="stock-page" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="stock-page__body">

        {/* Zone 1 — Verdict */}
        <div className="zone zone--verdict">
          <div className="verdict__left">
            <div className="verdict__title-row">
              <h1 className="verdict__name">{stock.title}</h1>
              <span className="verdict__ticker">({stock.symbol.toUpperCase()} · {stock.exchange.toUpperCase()})</span>
            </div>
            <div className="verdict__badges">
              {stock.sector && <span className="badge badge-sector">{stock.sector}</span>}
              {stock.industry && <span className="badge badge-sector">{stock.industry}</span>}
              {stock.valuation_category && (
                <span className={`badge badge-${stock.valuation_category}`}>
                  {categoryLabel[stock.valuation_category]}
                </span>
              )}
            </div>
            {lastUpdated && (
              <div className="verdict__updated">
                Updated {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </div>
            )}
          </div>
          <div className="verdict__right">
            <div className="verdict__price">{formatDollar(stock.current, ex)}</div>
            <div className={`verdict__quality quality-${stock.quality}`}>
              {['Great', 'Good', 'Okay', 'Bad'][stock.quality - 1]}
            </div>
            <div className="verdict__summary" style={{ color: verdictColor }}>{verdictText}</div>
          </div>
        </div>

        {/* Zone 2 — Valuation summary */}
        <div className="zone zone--valuation">
          <div className="val-cards">
            <ValCard label={stock.val1_label ?? 'Val 1'} value={stock.val1} current={stock.current} exchange={ex} tooltip={VAL_TOOLTIPS[stock.val1_label ?? ''] ?? 'Primary valuation estimate for this business category.'} />
            <ValCard label={stock.val2_label ?? 'Val 2'} value={stock.val2} current={stock.current} exchange={ex} tooltip={VAL_TOOLTIPS[stock.val2_label ?? ''] ?? 'Secondary valuation estimate for this business category.'} />
            <ValCard label={stock.val3_label ?? 'Val 3'} value={stock.val3} current={stock.current} exchange={ex} tooltip={VAL_TOOLTIPS[stock.val3_label ?? ''] ?? 'Third valuation estimate for this business category.'} />
          </div>
          {(stock.dcf_bear !== null || stock.dcf_base !== null || stock.dcf_bull !== null) && (
            <DcfBar bear={stock.dcf_bear} base={stock.dcf_base} bull={stock.dcf_bull} current={stock.current} exchange={ex} />
          )}
        </div>

        {/* Zone 3 — Quality signals */}
        <div className="zone zone--signals">
          <div className="signals-grid">
            <div className="signal-card">
              <div className="signal-value" style={{ color: roicHighlight === 'good' ? 'var(--green)' : roicHighlight === 'warn' ? 'var(--amber)' : 'var(--text-primary)' }}>
                {formatPercent(stock.roic)}
              </div>
              <div className="signal-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>ROIC <Tooltip text="Return on Invested Capital. Profit generated per dollar invested. ≥15% indicates a durable competitive advantage." /></div>
              <div className="signal-hint">Good ≥ 15%</div>
            </div>
            <div className="signal-card">
              <div className="signal-value" style={{ color: pioHighlight === 'good' ? 'var(--green)' : pioHighlight === 'warn' ? 'var(--amber)' : pioHighlight === 'bad' ? 'var(--red)' : 'var(--text-primary)' }}>
                {stock.piotroski !== null ? `${stock.piotroski} / 9` : 'N/A'}
              </div>
              <div className="signal-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Piotroski <Tooltip text="9-point financial health score. Awards points for profitability, leverage, liquidity and efficiency. 7-9 strong, 4-6 moderate, 0-3 weak." /></div>
              <div className="signal-hint">Strong ≥ 7</div>
            </div>
            <div className="signal-card">
              <div className="signal-value">{formatPercent(stock.grossMargin)}</div>
              <div className="signal-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Gross margin <Tooltip text="Revenue minus cost of goods, as % of revenue. Wide stable margins indicate pricing power. ≥40% is strong." /></div>
            </div>
            <div className="signal-card">
              <div className="signal-value">{formatPercent(stock.operatingMargin)}</div>
              <div className="signal-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Op. margin <Tooltip text="Earnings before interest and tax as % of revenue. Shows profit remaining after operating costs. ≥20% is strong." /></div>
            </div>
            <div className="signal-card">
              <div className="signal-value" style={{ color: deHighlight === 'good' ? 'var(--green)' : deHighlight === 'warn' ? 'var(--amber)' : 'var(--text-primary)' }}>
                {formatNumber(de)}
              </div>
              <div className="signal-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>D/E ratio <Tooltip text="Total debt divided by stockholders equity. Lower means less financial risk. <0.5 conservative, >1.5 high leverage." /></div>
              <div className="signal-hint">Good &lt; 0.5</div>
            </div>
          </div>
        </div>

        {/* Zone 4 — Detail tabs */}
        <div className="zone zone--details">
          <div className="detail-tabs">
            {(['valuation', 'financials', 'news', 'about'] as DetailTab[]).map(t => (
              <button key={t} className={`detail-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="detail-content">
            {tab === 'valuation' && (
              <div className="detail-grid">
                <div className="detail-section">
                  <h3>Valuation inputs</h3>
                  <MetricRow label="Current EPS" value={formatDollar(stock.currentEPS, ex)} />
                  <MetricRow label="Historical P/E" value={formatNumber(stock.historicalPE)} />
                  <MetricRow label="Historical ROE" value={formatPercent(stock.historicalROE)} />
                  <MetricRow label="Growth estimate (1yr)" value={formatPercent(stock.growthEstimate)} />
                  <MetricRow label="Graham number" value={formatDollar(stock.graham, ex)} />
                  <MetricRow label="EV/EBITDA" value={formatNumber(stock.evEbitda)} />
                  {stock.priceToFfo !== null && <MetricRow label="Price / FFO" value={formatNumber(stock.priceToFfo)} />}
                </div>
                <div className="detail-section">
                  <h3>Market metrics</h3>
                  <MetricRow label="Market cap" value={formatDollar(stock.marketCap, ex)} />
                  <MetricRow label="Enterprise value" value={formatDollar(ev, ex)} />
                  <MetricRow label="P/E ratio" value={formatNumber(peRatio)} />
                  <MetricRow label="P/B ratio" value={formatNumber(pb)} />
                  <MetricRow label="Book value / share" value={formatDollar(bvps, ex)} />
                  <MetricRow label="Shares outstanding" value={formatNumber(stock.sharesOutstandingRaw)} />
                  <MetricRow label="Dividend yield" value={formatPercent(divYield)} />
                  <MetricRow label="Cash flow yield" value={formatPercent(cfYield)} />
                  <MetricRow label="Trailing dividend" value={formatDollar(stock.trailingDividendRateRaw, ex)} />
                </div>
              </div>
            )}

            {tab === 'financials' && (
              <div className="detail-grid">
                <div className="detail-section">
                  <h3>Income</h3>
                  <MetricRow label="Revenue" value={formatDollar(stock.revenue, ex)} />
                  <MetricRow label="Gross profit" value={formatDollar(stock.grossProfit, ex)} />
                  <MetricRow label="Gross margin" value={formatPercent(stock.grossMargin)} highlight={stock.grossMargin !== null ? (stock.grossMargin >= 0.4 ? 'good' : stock.grossMargin >= 0.2 ? null : 'warn') : null} />
                  <MetricRow label="Operating income" value={formatDollar(stock.operatingIncome, ex)} />
                  <MetricRow label="Operating margin" value={formatPercent(stock.operatingMargin)} highlight={stock.operatingMargin !== null ? (stock.operatingMargin >= 0.2 ? 'good' : stock.operatingMargin >= 0.1 ? null : 'warn') : null} />
                  <MetricRow label="Net income" value={formatDollar(stock.netIncome, ex)} />
                  <MetricRow label="EBITDA" value={formatDollar(stock.ebitda, ex)} />
                  <MetricRow label="Interest expense" value={formatDollar(stock.interestExpense, ex)} />
                  <MetricRow label="ROA" value={formatPercent(roa)} />
                  <MetricRow label="ESG score" value={formatNumber(stock.esgScore)} />
                  <MetricRow label="Controversy" value={formatNumber(stock.controversy)} />
                </div>
                <div className="detail-section">
                  <h3>Balance sheet</h3>
                  <MetricRow label="Total assets" value={formatDollar(stock.assets, ex)} />
                  <MetricRow label="Total liabilities" value={formatDollar(stock.liabilities, ex)} />
                  <MetricRow label="A/L ratio" value={formatNumber(al)} />
                  <MetricRow label="Total debt" value={formatDollar(stock.debt, ex)} />
                  <MetricRow label="Long-term debt" value={formatDollar(stock.longTermDebt, ex)} />
                  <MetricRow label="D/E ratio" value={formatNumber(de)} highlight={deHighlight} />
                  <MetricRow label="Stockholders equity" value={formatDollar(stock.stockholdersEquityRaw, ex)} />
                  <MetricRow label="Cash & equivalents" value={formatDollar(stock.cashRawEq, ex)} />
                  <h3 style={{ marginTop: '1.25rem' }}>Cash flow</h3>
                  <MetricRow label="Free cash flow" value={formatDollar(stock.fcfRawValue, ex)} />
                  <MetricRow label="Operating cash flow" value={formatDollar(stock.operatingCashFlow, ex)} />
                  <MetricRow label="Capex" value={formatDollar(stock.capex, ex)} />
                  {stock.ffo !== null && <MetricRow label="FFO" value={formatDollar(stock.ffo, ex)} />}
                </div>
              </div>
            )}

            {tab === 'news' && (
              <div className="news-list">
                {stock.news && stock.news.length > 0 ? (
                  stock.news.map(item => (
                    <div key={item.url} className="news-item">
                      <div className="news-item__date">
                        {new Date(item.provider_publish_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="news-item__title">{item.title}</a>
                      <p className="news-item__summary">{item.summary}</p>
                    </div>
                  ))
                ) : <p style={{ color: 'var(--text-muted)' }}>No news available.</p>}
              </div>
            )}

            {tab === 'about' && (
              <div className="about-content">
                <CollapsibleText text={stock.summary ?? 'No description available.'} maxLength={400} />
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}