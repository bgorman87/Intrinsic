const getCurrency = (exchange: string): string => {
  switch (exchange.toLowerCase()) {
    case "tsx": return "CAD";
    case "cse": return "CAD";
    default:    return "USD";
  }
};

export const formatDollar = (value: number | null, exchange?: string): string => {
  if (value === null || !isFinite(value)) return "N/A";
  const userLocale = navigator.language || "en-US";
  const currency = exchange ? getCurrency(exchange) : "USD";
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return (
      new Intl.NumberFormat(userLocale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value / 1_000_000_000) + "B"
    );
  }
  if (absValue >= 1_000_000) {
    return (
      new Intl.NumberFormat(userLocale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value / 1_000_000) + "M"
    );
  }
  return new Intl.NumberFormat(userLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNPVDollar = (value: number | null, exchange?: string): string => {
  if (value === null || !isFinite(value)) return "N/A";
  const userLocale = navigator.language || "en-US";
  const currency = exchange ? getCurrency(exchange) : "USD";
  if (value > 1_000_000)  return `> ${new Intl.NumberFormat(userLocale, { style: "currency", currency, maximumFractionDigits: 0 }).format(1_000_000)}`;
  if (value < -1_000_000) return `< ${new Intl.NumberFormat(userLocale, { style: "currency", currency, maximumFractionDigits: 0 }).format(-1_000_000)}`;
  return new Intl.NumberFormat(userLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value: number | null): string =>
  value !== null && isFinite(value) ? (value * 100).toFixed(2) + "%" : "N/A";

export const formatNumber = (value: number | null, locale = "en-US"): string =>
  value !== null && isFinite(value)
    ? new Intl.NumberFormat(locale).format(value)
    : "N/A";

// --- Stock metric calculations ---

export const calculateEPS = (
  netIncome: number | null,
  sharesOutstanding: number | null
): number | null =>
  netIncome !== null && sharesOutstanding !== null && sharesOutstanding !== 0
    ? netIncome / sharesOutstanding
    : null;

export const calculatePERatio = (
  current: number | null,
  eps: number | null
): number | null =>
  current !== null && eps !== null && eps !== 0 ? current / eps : null;

export const calculateEnterpriseValue = (
  marketCap: number | null,
  debt: number | null,
  cash: number | null
): number | null =>
  marketCap !== null && debt !== null && cash !== null
    ? marketCap + debt - cash
    : null;

export const calculateBookValuePerShare = (
  assets: number | null,
  liabilities: number | null,
  sharesOutstanding: number | null
): number | null =>
  assets !== null && liabilities !== null && sharesOutstanding !== null && sharesOutstanding !== 0
    ? (assets - liabilities) / sharesOutstanding
    : null;

export const calculateReturnOnAssets = (
  netIncome: number | null,
  assets: number | null
): number | null =>
  netIncome !== null && assets !== null && assets !== 0
    ? netIncome / assets
    : null;

export const calculateAssetsToLiabilities = (
  assets: number | null,
  liabilities: number | null
): number | null =>
  assets !== null && liabilities !== null && liabilities !== 0
    ? assets / liabilities
    : null;

export const calculateDebtToEquity = (
  debt: number | null,
  equity: number | null
): number | null =>
  debt !== null && equity !== null && equity !== 0 ? debt / equity : null;

export const calculateDividendYield = (
  trailingDividend: number | null,
  current: number | null
): number | null =>
  trailingDividend !== null && current !== null && current !== 0
    ? (trailingDividend / current) * 100
    : null;

export const calculateCashFlowYield = (
  fcf: number | null,
  marketCap: number | null
): number | null =>
  fcf !== null && marketCap !== null && marketCap !== 0
    ? fcf / marketCap
    : null;

export const calculatePriceToBook = (
  current: number | null,
  bvps: number | null
): number | null =>
  current !== null && bvps !== null && bvps !== 0 ? current / bvps : null;