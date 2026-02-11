/**
 * Unit tests for RentalService
 */

import { RentalService } from '../application/services/rental.service';
import type { CalculationInput } from '../domain/types';

describe('RentalService', () => {
  let service: RentalService;

  const createInput = (overrides: Partial<CalculationInput> = {}): CalculationInput => ({
    carValue: 50000,
    monthlyRent: 2200,
    interestRateMonth: 0.015,
    financingTermMonths: 48,
    analysisPeriodMonths: 48,
    ...overrides,
  });

  beforeEach(() => {
    service = new RentalService();
  });

  describe('calculate', () => {
    it('should calculate total cost as monthlyRent × analysisPeriodMonths', () => {
      const input = createInput({ monthlyRent: 2000, analysisPeriodMonths: 12 });
      const result = service.calculate(input);

      expect(result.totalCost).toBe(24000);
    });

    it('should return monthlyCost equal to input monthlyRent', () => {
      const input = createInput({ monthlyRent: 1500 });
      const result = service.calculate(input);

      expect(result.monthlyCost).toBe(1500);
    });

    it('should handle short periods (1 month)', () => {
      const input = createInput({ monthlyRent: 3000, analysisPeriodMonths: 1 });
      const result = service.calculate(input);

      expect(result.totalCost).toBe(3000);
      expect(result.monthlyCost).toBe(3000);
    });

    it('should handle long periods (120 months)', () => {
      const input = createInput({ monthlyRent: 2500, analysisPeriodMonths: 120 });
      const result = service.calculate(input);

      expect(result.totalCost).toBe(300000);
      expect(result.monthlyCost).toBe(2500);
    });

    it('should have no depreciation or opportunity cost in breakdown', () => {
      const input = createInput();
      const result = service.calculate(input);

      expect(result).toHaveProperty('totalCost');
      expect(result).toHaveProperty('monthlyCost');
      expect(result).not.toHaveProperty('breakdown');
    });
  });
});
