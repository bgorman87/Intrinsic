import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchStocksByQuality } from '../api';
import { Stock } from '../types';
import { formatDollar, formatPercent } from '../utils';
import '../styles/Home.css';

interface Props {
  theme: string;
  switchTheme: () => void;
}

type FilterTab = 'great' | 'good' | 'okay' | 'all';
type SortKey = 'upside' | 'piotroski' | 'roic' | 'ticker';



const categoryLabel: Record<string, string> = {
  asset_light: 'Asset-light', asset_heavy: 'Asset-heavy',
  financial: 'Financial', cyclical: 'Cyclical',
  reit: 'REIT', unknown: 'Unknown',
};

const upside = (stock: Stock): number | null => {
  const vals = [stock.val1, stock.val2, stock.val3].filter(v => v !== null) as number[];
  if (!vals.length || !stock.current) return null;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return (avg - stock.current) / stock.current;
};

const ValuationBar = ({ stock }: { stock: Stock }) => {
  const vals = [stock.val1, stock.val2, stock.val3].filter(v => v !== null) as number[];
  if (!vals.length || !stock.current) return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>N/A</span>;

  const min = Math.min(...vals, stock.current);
  const max = Math.max(...vals, stock.current);
  const range = max - min || 1;

  const valMin = Math.min(...vals);
  const valMax = Math.max(...vals);
  const rangeLeft = ((valMin - min) / range) * 100;
  const rangeWidth = ((valMax - valMin) / range) * 100;
  const currentLeft = ((stock.current - min) / range) * 100;

  const allAbove = vals.every(v => v > (stock.current ?? 0));
  const allBelow = vals.every(v => v < (stock.current ?? 0));
  const barColor = allAbove ? 'var(--green-mid)' : allBelow ? 'var(--red)' : 'var(--amber)';

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', height: 6, background: 'var(--border)', borderRadius: 3 }}>
        <div style={{
          position: 'absolute', left: `${rangeLeft}%`, width: `${Math.max(rangeWidth, 2)}%`,
          height: '100%', background: barColor, opacity: 0.5, borderRadius: 3,
        }} />
        <div style={{
          position: 'absolute', left: `${currentLeft}%`, transform: 'translateX(-50%)',
          width: 2, height: 14, top: -4, background: 'var(--text-primary)', borderRadius: 1,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: 'var(--text-muted)' }}>
        <span>{formatDollar(valMin, stock.exchange)}</span>
        <span>{formatDollar(valMax, stock.exchange)}</span>
      </div>
    </div>
  );
};

const PiotroskiBadge = ({ score }: { score: number | null }) => {
  if (score === null) return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>;
  const color = score >= 7 ? 'var(--green)' : score >= 4 ? 'var(--amber)' : 'var(--red)';
  const bg = score >= 7 ? 'var(--green-bg)' : score >= 4 ? 'var(--amber-bg)' : 'var(--red-bg)';
  return (
    <span style={{ background: bg, color, fontSize: 12, fontWeight: 500, padding: '2px 8px', borderRadius: 10 }}>
      {score} / 9
    </span>
  );
};

const RoicCell = ({ roic }: { roic: number | null }) => {
  if (roic === null) return <span style={{ color: 'var(--text-muted)' }}>—</span>;
  const color = roic >= 0.15 ? 'var(--green)' : roic >= 0.08 ? 'var(--text-primary)' : 'var(--red)';
  return <span style={{ color, fontWeight: 500 }}>{formatPercent(roic)}</span>;
};

export default function Home({ theme, switchTheme }: Props) {
  const [stocksByQuality, setStocksByQuality] = useState<Record<FilterTab, Stock[]>>({
    great: [], good: [], okay: [], all: [],
  });
  const [loaded, setLoaded] = useState<Record<FilterTab, boolean>>({
    great: false, good: false, okay: false, all: false,
  });
  const [activeTab, setActiveTab] = useState<FilterTab>('great');
  const [sortKey, setSortKey] = useState<SortKey>('upside');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async (tab: FilterTab, quality: string) => {
      try {
        const data = await fetchStocksByQuality(quality);
        setStocksByQuality(prev => ({ ...prev, [tab]: data }));
        setLoaded(prev => ({ ...prev, [tab]: true }));
      } catch (e) {
        setLoaded(prev => ({ ...prev, [tab]: true }));
      }
    };
    load('great', 'great');
    load('good', 'good');
    load('okay', 'okay');
    load('all', 'all');
  }, []);

  const counts = {
    great: stocksByQuality.great.length,
    good: stocksByQuality.good.length,
    okay: stocksByQuality.okay.length,
    total: stocksByQuality.all.length,
  };

  const sorted = useMemo(() => {
    const stocks = stocksByQuality[activeTab];

    return [...stocks].sort((a, b) => {
      let av: number | null = null, bv: number | null = null;
      if (sortKey === 'upside') { av = upside(a); bv = upside(b); }
      else if (sortKey === 'piotroski') { av = (a as any).piotroski ?? null; bv = (b as any).piotroski ?? null; }
      else if (sortKey === 'roic') { av = (a as any).roic ?? null; bv = (b as any).roic ?? null; }
      else { return sortDir === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol); }
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [activeTab, stocksByQuality, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortArrow = ({ k }: { k: SortKey }) =>
    sortKey === k ? <span style={{ marginLeft: 3, opacity: 0.6 }}>{sortDir === 'desc' ? '↓' : '↑'}</span> : null;

  const isLoading = !loaded[activeTab === 'all' ? 'great' : activeTab];

  return (
    <div className="home" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="home__body">

        <div className="summary-bar">
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="summary-n quality-1">{counts.great}</span>
              <span className="summary-label">great</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-n quality-2">{counts.good}</span>
              <span className="summary-label">good</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-n quality-3">{counts.okay}</span>
              <span className="summary-label">okay</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-n" style={{ color: 'var(--text-secondary)' }}>{counts.total}</span>
              <span className="summary-label">total scored</span>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="filter-bar">
            {(['great', 'good', 'okay', 'all'] as FilterTab[]).map(tab => (
              <button key={tab} className={`filter-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && <span className="filter-tab-count">{counts[tab as keyof typeof counts]}</span>}
              </button>
            ))}
            <div className="filter-spacer" />
            <div className="sort-control">
              <span>Sort</span>
              <select value={sortKey} onChange={e => { setSortKey(e.target.value as SortKey); setSortDir('desc'); }}>
                <option value="upside">Upside %</option>
                <option value="piotroski">Piotroski</option>
                <option value="roic">ROIC</option>
                <option value="ticker">Ticker</option>
              </select>
            </div>
          </div>

          <div className="stock-table">
            <div className="table-header">
              <div className="col-company">Company</div>
              <div className="col-price th-r">Price</div>
              <div className="col-upside th-r th-sortable" onClick={() => handleSort('upside')}>
                Upside <SortArrow k="upside" />
              </div>
              <div className="col-bar">Valuation range</div>
              <div className="col-pio th-r th-sortable" onClick={() => handleSort('piotroski')}>
                Piotroski <SortArrow k="piotroski" />
              </div>
              <div className="col-roic th-r th-sortable" onClick={() => handleSort('roic')}>
                ROIC <SortArrow k="roic" />
              </div>
            </div>

            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="table-row skeleton-row">
                  <div className="skeleton-line" style={{ width: '60%', height: 14 }} />
                </div>
              ))
            ) : sorted.length === 0 ? (
              <div className="table-empty">No stocks in this category.</div>
            ) : (
              sorted.map(stock => {
                const u = upside(stock);
                const uColor = u === null ? 'var(--text-muted)' : u > 0 ? 'var(--green)' : 'var(--red)';
                return (
                  <div
                    key={`${stock.exchange}-${stock.symbol}`}
                    className="table-row"
                    onClick={() => navigate(`/stock/${stock.exchange}/${stock.symbol}`)}
                  >
                    <div className="col-company">
                      <div className="row-ticker">{stock.symbol.toUpperCase()}</div>
                      <div className="row-name">{stock.title}</div>
                      {stock.valuation_category && (
                        <span className={`badge badge-${stock.valuation_category}`}>
                          {categoryLabel[stock.valuation_category]}
                        </span>
                      )}
                    </div>
                    <div className="col-price">
                      <div className="row-price">{formatDollar(stock.current, stock.exchange)}</div>
                      <div className={`quality quality-${stock.quality}`} style={{ fontSize: 11 }}>
                        {['Great', 'Good', 'Okay', 'Bad'][stock.quality - 1]}
                      </div>
                    </div>
                    <div className="col-upside" style={{ color: uColor, fontWeight: 500, textAlign: 'right' }}>
                      {u !== null ? `${u > 0 ? '+' : ''}${(u * 100).toFixed(1)}%` : '—'}
                    </div>
                    <div className="col-bar">
                      <ValuationBar stock={stock} />
                    </div>
                    <div className="col-pio" style={{ textAlign: 'right' }}>
                      <PiotroskiBadge score={(stock as any).piotroski ?? null} />
                    </div>
                    <div className="col-roic" style={{ textAlign: 'right' }}>
                      <RoicCell roic={(stock as any).roic ?? null} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}