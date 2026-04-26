export type Quality = 1 | 2 | 3 | 4;

export type ValuationCategory = "asset_light" | "asset_heavy" | "financial" | "cyclical" | "reit" | "unknown";

export interface Stock {
  symbol: string;
  exchange: string;
  current: number;
  val1: number | null;
  val2: number | null;
  val3: number | null;
  val1_label: string | null;
  val2_label: string | null;
  val3_label: string | null;
  title: string | null;
  industry: string | null;
  sector: string | null;
  quality: Quality;
  valuation_category: ValuationCategory | null;
}

export interface FullStock {
  id: number;
  symbol: string;
  exchange: string;
  current: number | null;
  quality: Quality;
  valuation_category: ValuationCategory | null;

  val1: number | null;
  val2: number | null;
  val3: number | null;
  val1_label: string | null;
  val2_label: string | null;
  val3_label: string | null;

  dcf_bear: number | null;
  dcf_base: number | null;
  dcf_bull: number | null;

  title: string | null;
  sector: string | null;
  industry: string | null;
  marketCap: number | null;
  summary: string | null;

  revenue: number | null;
  netIncome: number | null;
  grossProfit: number | null;
  operatingIncome: number | null;
  ebitda: number | null;
  interestExpense: number | null;

  assets: number | null;
  liabilities: number | null;
  debt: number | null;
  longTermDebt: number | null;
  cashRawEq: number | null;
  stockholdersEquityRaw: number | null;
  sharesOutstandingRaw: number | null;
  bookValuePerShare: number | null;

  fcfRawValue: number | null;
  capex: number | null;
  operatingCashFlow: number | null;
  ffo: number | null;

  currentEPS: number | null;
  historicalPE: number | null;
  historicalROE: number | null;
  trailingDividendRateRaw: number | null;
  growthEstimate: number | null;

  roic: number | null;
  piotroski: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  graham: number | null;
  evEbitda: number | null;
  priceToFfo: number | null;

  esgScore: number | null;
  controversy: number | null;

  lastUpdated: Date | null;
  news: News[] | null;
}

export interface News {
  title: string;
  summary: string;
  url: string;
  provider_name: string;
  provider_publish_time: Date;
}