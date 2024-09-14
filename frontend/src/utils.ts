export const formatDollar = (value: number | null, locale: string = 'en-US') => {
    if (value !== null && isFinite(value)) {
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value >= 1_000_000_000 ? 0 : 2,
        maximumFractionDigits: value >= 1_000_000_000 ? 0 : 2,
      };
      return new Intl.NumberFormat(locale, options).format(value);
    }
    return "N/A";
  };

export const formatPercent = (value: number | null) =>
    value !== null && isFinite(value) ? (value * 100).toFixed(2) + "%" : "N/A";

export const formatNumber = (value: number | null, locale: string = 'en-US') =>
    value !== null && isFinite(value)
        ? new Intl.NumberFormat(locale).format(value)
        : "N/A";