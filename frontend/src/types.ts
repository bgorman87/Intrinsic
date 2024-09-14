export interface FullStock {
  id: number;
  symbol: string;
  exchange: string;
  current: number | null;
  pe: number | null;
  dcf: number | null;
  roe: number | null;
  quality: Quality;
  title: string | null;
  industry: string | null;
  marketCap: number | null;
  revenue: number | null;
  netIncome: number | null;
  assets: number | null;
  liabilities: number | null;
  debt: number | null;
  esgScore: number | null;
  controversy: number | null;
  summary: string | null;
  longTermDebt: number | null;
  growthEstimate: number | null;
  currentEPS: number | null;
  historicalPE: number | null;
  cashRawEq: number | null;
  fcfRawValue: number | null;
  sharesOutstandingRaw: number | null;
  stockholdersEquityRaw: number | null;
  historicalROE: number | null;
  trailingDividendRateRaw: number | null;
  lastUpdated: Date | null;
  news: News[] | null;
}


export interface Stock {
  symbol: string;
  exchange: string;
  current: number;
  pe: number;
  dcf: number;
  roe: number;
  title: string;
  industry: string;
  summary: string;
}

export type Quality = 1 | 2 | 3 | 4;

export interface SearchResult {
  symbol: string;
  exchange: string;
  current: number;
  title: string;
  industry: string;
  quality: Quality;
}

export interface News {
  title: string,
  summary: string,
  url: string,
  provider_name: string,
  provider_publish_time: Date
}