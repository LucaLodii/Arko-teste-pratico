/**
 * Unit tests for formatters
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

const NBSP = '\u00A0'; // Non-breaking space used by Intl.NumberFormat for currency

describe('formatCurrency', () => {
  it('should format positive values with R$ prefix', () => {
    expect(formatCurrency(50000)).toBe(`R$${NBSP}50.000`);
  });

  it('should format decimal values with proper rounding', () => {
    expect(formatCurrency(1234.567)).toBe(`R$${NBSP}1.234,57`);
  });

  it('should handle non-finite values', () => {
    expect(formatCurrency(NaN)).toBe('R$ —');
    expect(formatCurrency(Infinity)).toBe('R$ —');
    expect(formatCurrency(-Infinity)).toBe('R$ —');
  });

  it('should respect maximumFractionDigits option', () => {
    expect(formatCurrency(1234.567, 0)).toBe(`R$${NBSP}1.235`);
  });

  it('should use Brazilian locale (comma as decimal separator)', () => {
    expect(formatCurrency(1000.5)).toBe(`R$${NBSP}1.000,5`);
  });
});

describe('formatPercent', () => {
  it('should format decimal to percent', () => {
    expect(formatPercent(0.015)).toBe('1,50%');
  });

  it('should respect decimals option', () => {
    expect(formatPercent(0.12345, 3)).toBe('12,345%');
  });

  it('should use Brazilian locale formatting', () => {
    expect(formatPercent(0.5)).toBe('50,00%');
  });
});

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    expect(formatNumber(50000)).toBe('50.000');
  });
});
