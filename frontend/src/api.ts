import { Stock } from "./types";


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
