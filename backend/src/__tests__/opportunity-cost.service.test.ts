/**
 * Unit tests for OpportunityCostService
 */

import { OpportunityCostService } from '../application/services/opportunity-cost.service';

describe('OpportunityCostService', () => {
  let service: OpportunityCostService;

  beforeEach(() => {
    service = new OpportunityCostService();
  });

  describe('calculate', () => {
    it('should return 0 when interest rate is 0', () => {
      const result = service.calculate(50000, 3, 0);
      expect(result).toBe(0);
    });

    it('should return 0 when years is 0', () => {
      const result = service.calculate(50000, 0, 0.1);
      expect(result).toBe(0);
    });

    it('should calculate opportunity cost with default Selic rate (13.75%)', () => {
      const result = service.calculate(50000, 3);
      // R$ 50,000 for 3 years at 13.75% → approximately R$ 23,456
      expect(result).toBeGreaterThan(23000);
      expect(result).toBeLessThan(24000);
      expect(result).toBeCloseTo(23591, -2);
    });

    it('should calculate opportunity cost with custom interest rate', () => {
      const result = service.calculate(100000, 2, 0.1);
      // 100000 * (1.1^2 - 1) = 100000 * 0.21 = 21000
      expect(result).toBeCloseTo(21000, 2);
    });

    it('should verify compound interest formula: capital × (1 + rate)^years - capital', () => {
      const capital = 10000;
      const years = 5;
      const rate = 0.08;
      const result = service.calculate(capital, years, rate);
      const expected = capital * Math.pow(1 + rate, years) - capital;
      expect(result).toBe(expected);
    });

    it('should handle fractional years', () => {
      const result = service.calculate(50000, 2.5, 0.1);
      const expected = 50000 * Math.pow(1.1, 2.5) - 50000;
      expect(result).toBeCloseTo(expected, 2);
    });
  });
});
