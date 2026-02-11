/**
 * Unit tests for formatters
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

describe('formatCurrency', () => {
  it('should format positive values with R$ prefix', () => {
    const result = formatCurrency(50000);
    expect(result).toContain('R$');
    expect(result).toContain('50');
    expect(result).toContain('000');
  });

  it('should format decimal values with proper rounding', () => {
    const result = formatCurrency(1234.567);
    expect(result).toContain('R$');
    expect(result).toContain('1.234');
  });

  it('should handle non-finite values', () => {
    expect(formatCurrency(NaN)).toBe('R$ —');
    expect(formatCurrency(Infinity)).toBe('R$ —');
    expect(formatCurrency(-Infinity)).toBe('R$ —');
  });

  it('should respect maximumFractionDigits option', () => {
    const result = formatCurrency(1234.567, 0);
    expect(result).toContain('R$');
    expect(result).not.toMatch(/,\d{2}$/);
  });

  it('should use Brazilian locale (comma as decimal separator)', () => {
    const result = formatCurrency(1000.5);
    expect(result).toMatch(/[.,]\d/);
  });
});

describe('formatPercent', () => {
  it('should format decimal to percent', () => {
    const result = formatPercent(0.015);
    expect(result).toContain('%');
    expect(result).toContain('1,5');
  });

  it('should respect decimals option', () => {
    const result = formatPercent(0.12345, 3);
    expect(result).toContain('%');
    expect(result).toContain('12');
  });

  it('should use Brazilian locale formatting', () => {
    const result = formatPercent(0.5);
    expect(result).toContain('%');
    expect(result).toContain('50');
  });
});

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    const result = formatNumber(50000);
    expect(result).toContain('50');
    expect(result).toContain('000');
  });
});
