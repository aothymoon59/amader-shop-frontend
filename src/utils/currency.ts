import {
  defaultSystemCurrency,
  type SystemCurrency,
} from "@/redux/features/generalApi/systemSettingsApi";

type FormatCurrencyOptions = {
  decimals?: number;
  fallback?: string;
};

export const formatCurrencyAmount = (
  amount: number | string | null | undefined,
  currency: SystemCurrency = defaultSystemCurrency,
  options: FormatCurrencyOptions = {},
) => {
  if (amount === null || amount === undefined || amount === "") {
    return options.fallback ?? `${currency.symbol}0.00`;
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return options.fallback ?? `${currency.symbol}0.00`;
  }

  return `${currency.symbol}${numericAmount.toFixed(options.decimals ?? 2)}`;
};
