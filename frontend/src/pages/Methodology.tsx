import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Methodology.css';

interface Props {
  theme: string;
  switchTheme: () => void;
}

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section className="meth-section" id={id}>
    <h2 className="meth-h2">{title}</h2>
    {children}
  </section>
);

const Method = ({ name, formula, used, description }: {
  name: string; formula: string; used: string; description: string;
}) => (
  <div className="meth-method">
    <div className="meth-method__header">
      <span className="meth-method__name">{name}</span>
      <span className="meth-method__used">Used for: {used}</span>
    </div>
    <div className="meth-method__formula">{formula}</div>
    <p className="meth-method__desc">{description}</p>
  </div>
);

const CategoryCard = ({ name, badge, methods, why }: {
  name: string; badge: string; methods: string[]; why: string;
}) => (
  <div className="meth-cat">
    <div className="meth-cat__header">
      <span className="meth-cat__name">{name}</span>
      <span className={`badge badge-${badge}`}>{name}</span>
    </div>
    <p className="meth-cat__why">{why}</p>
    <div className="meth-cat__methods">
      {methods.map(m => <span key={m} className="meth-tag">{m}</span>)}
    </div>
  </div>
);

const SignalCard = ({ name, good, okay, bad, why }: {
  name: string; good: string; okay: string; bad: string; why: string;
}) => (
  <div className="meth-signal">
    <div className="meth-signal__name">{name}</div>
    <p className="meth-signal__why">{why}</p>
    <div className="meth-signal__thresholds">
      <span className="meth-threshold good">Good: {good}</span>
      <span className="meth-threshold okay">Moderate: {okay}</span>
      <span className="meth-threshold bad">Weak: {bad}</span>
    </div>
  </div>
);

export default function Methodology({ theme, switchTheme }: Props) {
  const navigate = useNavigate();

  return (
    <div className="methodology" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="meth-body">

        <div className="meth-hero">
          <button className="meth-back" onClick={() => navigate('/')}>← Back</button>
          <h1 className="meth-h1">How Intrinsic works</h1>
          <p className="meth-intro">
            Intrinsic estimates the fair value of stocks using time-tested methods from value investing.
            Rather than applying the same formula to every company, it detects what type of business each stock is
            and applies the methods most appropriate for that category. This page explains the logic behind the numbers.
          </p>
        </div>

        <div className="meth-toc">
          <span className="meth-toc__label">On this page</span>
          <a href="#quality">Quality score</a>
          <a href="#categories">Business categories</a>
          <a href="#methods">Valuation methods</a>
          <a href="#signals">Quality signals</a>
          <a href="#dcf-scenarios">DCF scenarios</a>
          <a href="#limitations">Limitations</a>
        </div>

        <Section id="quality" title="Quality score">
          <p>Every stock receives a quality score of 1–4 based on how many of its three valuation estimates exceed the current price.</p>
          <div className="meth-quality-grid">
            <div className="meth-quality-item">
              <span className="meth-quality-badge quality-1">Great</span>
              <span>All 3 estimates above current price</span>
            </div>
            <div className="meth-quality-item">
              <span className="meth-quality-badge quality-2">Good</span>
              <span>2 of 3 estimates above current price</span>
            </div>
            <div className="meth-quality-item">
              <span className="meth-quality-badge quality-3">Okay</span>
              <span>1 of 3 estimates above current price</span>
            </div>
            <div className="meth-quality-item">
              <span className="meth-quality-badge quality-4">Bad</span>
              <span>No estimates above current price</span>
            </div>
          </div>
          <p className="meth-note">
            The quality score is a first-pass filter, not a buy signal. A stock can score Great and still be
            a poor investment if the underlying business is deteriorating. Always review the quality signals
            and financial details before drawing conclusions.
          </p>
        </Section>

        <Section id="categories" title="Business categories">
          <p>
            Applying the same valuation method to every company produces misleading results.
            A bank's "free cash flow" is meaningless — deposits are both revenue and liability.
            A mining company's earnings are driven by commodity prices, not management skill.
            Intrinsic detects each company's category from its sector and industry data and applies appropriate methods.
          </p>
          <div className="meth-cat-grid">
            <CategoryCard
              name="Asset-light"
              badge="asset_light"
              methods={['NPV PE', 'NPV DCF', 'Graham Number']}
              why="Technology, software, consumer brands, pharma — these businesses earn high returns on little physical capital. Earnings power and growth are the key drivers of value. DCF and PE-based methods work well here."
            />
            <CategoryCard
              name="Asset-heavy"
              badge="asset_heavy"
              methods={['NPV DCF', 'EV/EBITDA', 'Graham Number']}
              why="Industrials, utilities, railways, manufacturers — large capital bases generate predictable cash flows but lower returns. EV/EBITDA normalises for different capital structures and is widely used in this sector."
            />
            <CategoryCard
              name="Financial"
              badge="financial"
              methods={['NPV PE', 'Price/Book', 'ROE NPV']}
              why="Banks and insurers use debt as raw material, making FCF-based methods unreliable. Price/Book and ROE-based methods are the industry standard. DCF scenarios are not shown for this category."
            />
            <CategoryCard
              name="Cyclical"
              badge="cyclical"
              methods={['NPV DCF', 'EV/EBITDA', 'Graham Number']}
              why="Oil & gas, mining, metals — earnings swing dramatically with commodity cycles. A conservative DCF with a lower EV/EBITDA target multiple (10×) accounts for the cyclicality. Graham Number provides a floor."
            />
            <CategoryCard
              name="REIT"
              badge="reit"
              methods={['Price/FFO', 'NPV DCF', 'Dividend yield value']}
              why="Real estate trusts are valued on Funds From Operations (FFO) — net income plus depreciation — because depreciation artificially reduces earnings but not cash generation. A target P/FFO of 15× is used."
            />
          </div>
          <p className="meth-note">
            Unknown or unclassified sectors fall back to asset-light methods. Category detection uses Yahoo Finance's
            sector and industry fields, with industry-level overrides taking priority over sector-level assignments.
          </p>
        </Section>

        <Section id="methods" title="Valuation methods">
          <Method
            name="NPV PE (Net Present Value based on Price-to-Earnings)"
            formula="Fair value = EPS × Historical P/E × (1 + growth×0.75)⁵ / (1 + 9%)⁵"
            used="Asset-light, Financial"
            description="Projects future earnings per share using the analyst consensus 1-year growth estimate (with a 25% safety margin applied to growth), then discounts back to present value using a 9% discount rate. The historical P/E acts as the assumed future multiple. Best suited for companies with stable, predictable earnings."
          />
          <Method
            name="NPV DCF (Discounted Cash Flow)"
            formula="Fair value = Σ FCF×(1+growth)ⁱ / (1+9%)ⁱ + terminal value + cash − liabilities, per share"
            used="Asset-light, Asset-heavy, Cyclical, REIT"
            description="Projects free cash flow over 10 years with declining growth (5% annual decay on the growth rate), then adds a terminal value using the Gordon Growth Model at a 2.5% perpetual growth rate. Cash is added and liabilities subtracted to get equity value. Three scenarios are shown: bear (50% margin of safety on growth), base (25%), and bull (0%)."
          />
          <Method
            name="Graham Number"
            formula="Fair value = √(22.5 × EPS × Book Value Per Share)"
            used="Asset-light, Asset-heavy, Cyclical"
            description="Benjamin Graham's classic formula, combining earnings yield and book value. It represents the maximum price a defensive investor should pay. The 22.5 factor comes from a max P/E of 15 and max P/Book of 1.5. Works best for established companies with positive earnings and book value — produces no result for companies with negative EPS or book value."
          />
          <Method
            name="EV/EBITDA valuation"
            formula="Fair value = (EBITDA × target multiple − debt + cash) / shares"
            used="Asset-heavy, Cyclical"
            description="Computes the implied equity value if the company traded at a target EV/EBITDA multiple (12× for asset-heavy, 10× for cyclicals). EV/EBITDA is capital-structure neutral — it doesn't care whether a company is financed by debt or equity — making it useful for comparing companies with different leverage profiles."
          />
          <Method
            name="ROE NPV (Return on Equity)"
            formula="Fair value = NPV of dividends + NPV of terminal equity value based on historical ROE"
            used="Financial"
            description="Models a bank or insurer by projecting stockholders' equity forward using conservative growth, then estimating the terminal value based on the company's historical return on equity. Dividends are discounted separately. Only applicable to dividend-paying stocks — skipped otherwise."
          />
          <Method
            name="Price/FFO (Funds From Operations)"
            formula="Fair value = (FFO / shares) × 15"
            used="REIT"
            description="REITs are required to distribute most of their income, and depreciation on real estate assets artificially depresses net income. FFO adds back depreciation to give a truer picture of cash generation. A target P/FFO multiple of 15× is used as a conservative benchmark for REITs."
          />
          <Method
            name="Dividend yield value"
            formula="Fair value = trailing annual dividend / 4%"
            used="REIT"
            description="Implies a fair value based on what price would produce a 4% dividend yield — a historically reasonable target for income-focused investments. Simple but effective as a cross-check alongside P/FFO."
          />
        </Section>

        <Section id="signals" title="Quality signals">
          <p>These five indicators appear on every stock page as a quick read on business quality. They are independent of the valuation estimates.</p>
          <div className="meth-signals-grid">
            <SignalCard
              name="ROIC — Return on Invested Capital"
              why="Measures how efficiently a company generates profit from the capital invested in it. Consistently high ROIC is one of the strongest indicators of a durable competitive advantage (moat). Buffett considers it more important than ROE because it accounts for debt."
              good="≥ 15%"
              okay="8–15%"
              bad="< 8%"
            />
            <SignalCard
              name="Piotroski F-Score"
              why="A 9-point scoring system developed by academic Joseph Piotroski. Awards one point each for: positive ROA, positive operating cash flow, improving ROA, improving leverage, improving liquidity, no share dilution, improving gross margin, and improving asset turnover. Designed to identify financially strengthening companies."
              good="7–9"
              okay="4–6"
              bad="0–3"
            />
            <SignalCard
              name="Gross Margin"
              why="Revenue minus cost of goods sold, as a percentage of revenue. A wide, stable gross margin indicates pricing power and often a competitive moat. Shrinking gross margins are a warning sign regardless of reported earnings."
              good="≥ 40%"
              okay="20–40%"
              bad="< 20%"
            />
            <SignalCard
              name="Operating Margin"
              why="Earnings before interest and taxes as a percentage of revenue. Shows how much profit remains after paying operating expenses. Higher is better; declining margins over time suggest cost pressure or competitive erosion."
              good="≥ 20%"
              okay="10–20%"
              bad="< 10%"
            />
            <SignalCard
              name="D/E Ratio — Debt-to-Equity"
              why="Total debt divided by stockholders' equity. High leverage amplifies both gains and losses and increases bankruptcy risk during downturns. Note: financial companies (banks) naturally carry high D/E ratios — this signal is less meaningful for that category."
              good="< 0.5"
              okay="0.5–1.5"
              bad="> 1.5"
            />
          </div>
        </Section>

        <Section id="dcf-scenarios" title="DCF scenario range">
          <p>
            A single DCF number creates false precision. Small changes in the growth assumption produce large changes in the output.
            To make this uncertainty visible, three scenarios are shown for every stock where DCF applies:
          </p>
          <div className="meth-scenarios">
            <div className="meth-scenario">
              <div className="meth-scenario__label" style={{ color: 'var(--red)' }}>Bear</div>
              <div className="meth-scenario__desc">50% margin of safety applied to the growth estimate. Assumes the analyst consensus is twice as optimistic as reality.</div>
            </div>
            <div className="meth-scenario">
              <div className="meth-scenario__label">Base</div>
              <div className="meth-scenario__desc">25% margin of safety. The standard assumption — analyst estimates are somewhat optimistic, as they typically are.</div>
            </div>
            <div className="meth-scenario">
              <div className="meth-scenario__label" style={{ color: 'var(--green)' }}>Bull</div>
              <div className="meth-scenario__desc">No margin of safety. Takes the growth estimate at face value. Represents the optimistic case.</div>
            </div>
          </div>
          <p className="meth-note">
            The current price is shown as a vertical marker on the range bar. A stock where the current price sits
            to the right of the entire range (above even the bull case) is pricing in more growth than even the most
            optimistic scenario justifies.
          </p>
        </Section>

        <Section id="limitations" title="Limitations and disclaimer">
          <p>This tool has real limitations you should understand before acting on anything it shows:</p>
          <ul className="meth-list">
            <li>Data is sourced from Yahoo Finance via yahooquery and may be delayed, incomplete, or incorrect. Always verify figures against official filings.</li>
            <li>All valuation methods are sensitive to the growth estimate, which comes from analyst consensus and is frequently wrong — especially for cyclical and early-stage companies.</li>
            <li>The discount rate of 9% is fixed. In a higher interest rate environment, a higher discount rate may be more appropriate, which would reduce all valuations.</li>
            <li>Intrinsic value estimates are not price targets. A stock can trade below intrinsic value for years, and above it indefinitely.</li>
            <li>Category detection is automated from sector/industry data and can be wrong. A company classified as asset-light may have characteristics better suited to a different method.</li>
            <li>This is a screening tool, not financial advice. Do your own research before making any investment decision.</li>
          </ul>
        </Section>

      </div>
      <Footer />
    </div>
  );
}