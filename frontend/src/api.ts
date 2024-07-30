import { Stock, SearchResult } from "./types";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export const fetchStocksByQuality = async (
  quality: string
): Promise<Stock[]> => {
  const response = await fetch(`${apiUrl}/stocks/${quality}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchStockBySymbol = async ({exchange, symbol}: {exchange: string, symbol: string}): Promise<Stock> => {
  const response = await fetch(`${apiUrl}/stock/${exchange}/${symbol}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const searchStocks = async (query: string): Promise<SearchResult[]> => {
  const response = await fetch(`${apiUrl}/search?query=${query}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};