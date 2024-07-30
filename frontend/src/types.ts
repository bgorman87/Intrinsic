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