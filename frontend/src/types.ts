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

export type Quality = 1 | 2 | 3;
