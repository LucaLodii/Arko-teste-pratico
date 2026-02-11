/**
 * Formatting utilities for Rent vs. Buy Car Calculator
 * Uses Brazilian Portuguese locale (pt-BR)
 */

const BR_LOCALE = 'pt-BR';

/**
 * Formats a number as Brazilian Real (R$)
 * @param value - Numeric value to format
 * @param maximumFractionDigits - Max decimal places (default: 2)
 * @returns Formatted string, e.g. "R$ 50.000,00"
 */
export function formatCurrency(
  value: number,
  maximumFractionDigits = 2
): string {
  if (!Number.isFinite(value)) {
    return 'R$ —';
  }
  return new Intl.NumberFormat(BR_LOCALE, {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a decimal as percentage (e.g. 0.015 → "1,5%")
 * @param value - Decimal value (e.g. 0.015 for 1.5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string, e.g. "1,5%"
 */
export function formatPercent(value: number, decimals = 2): string {
  return new Intl.NumberFormat(BR_LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number with thousand separators using Brazilian locale
 * @param value - Numeric value to format
 * @returns Formatted string, e.g. "50.000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(BR_LOCALE).format(value);
}
