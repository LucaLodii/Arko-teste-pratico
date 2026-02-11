/**
 * Unit tests for TimelineService
 */

import { TimelineService } from '../application/services/timeline.service';
import type { CashPurchaseService } from '../application/services/cash-purchase.service';
import type { FinancedPurchaseService } from '../application/services/financed-purchase.service';
import type { RentalService } from '../application/services/rental.service';
import type { CalculationInput } from '../domain/types';

describe('TimelineService', () => {
  let mockCashService: jest.Mocked<CashPurchaseService>;
  let mockFinancedService: jest.Mocked<FinancedPurchaseService>;
  let mockRentalService: jest.Mocked<RentalService>;
  let service: TimelineService;

  const createInput = (overrides: Partial<CalculationInput> = {}): CalculationInput => ({
    carValue: 50000,
    monthlyRent: 2200,
    interestRateMonth: 0.015,
    financingTermMonths: 48,
    analysisPeriodMonths: 48,
    ...overrides,
  });

  beforeEach(() => {
    // Mock services return predictable values based on month
    mockCashService = {
      calculate: jest.fn().mockImplementation((input) => ({
        totalCost: 50000 + 100 * input.analysisPeriodMonths,
        breakdown: {} as any,
      })),
    } as unknown as jest.Mocked<CashPurchaseService>;

    mockFinancedService = {
      calculate: jest.fn().mockImplementation((input) => ({
        totalCost: 60000 + 200 * input.analysisPeriodMonths,
        parcela: 0,
        totalJuros: 0,
        breakdown: {} as any,
      })),
    } as unknown as jest.Mocked<FinancedPurchaseService>;

    mockRentalService = {
      calculate: jest.fn().mockImplementation((input) => ({
        totalCost: 2000 * input.analysisPeriodMonths,
        monthlyCost: 2000,
      })),
    } as unknown as jest.Mocked<RentalService>;

    service = new TimelineService(
      mockCashService,
      mockFinancedService,
      mockRentalService
    );
  });

  describe('calculate', () => {
    it('should return timeline array with length equal to analysisPeriodMonths', () => {
      const input = createInput({ analysisPeriodMonths: 12 });
      const timeline = service.calculate(input);

      expect(Array.isArray(timeline)).toBe(true);
      expect(timeline.length).toBe(12);
    });

    it('should have first point with month: 1', () => {
      const input = createInput({ analysisPeriodMonths: 24 });
      const timeline = service.calculate(input);

      expect(timeline[0].month).toBe(1);
    });

    it('should have last point with month: analysisPeriodMonths', () => {
      const input = createInput({ analysisPeriodMonths: 36 });
      const timeline = service.calculate(input);

      expect(timeline[timeline.length - 1].month).toBe(36);
    });

    it('should call services with incrementing analysisPeriodMonths', () => {
      const input = createInput({ analysisPeriodMonths: 3 });
      service.calculate(input);

      expect(mockCashService.calculate).toHaveBeenCalledTimes(3);
      expect(mockFinancedService.calculate).toHaveBeenCalledTimes(3);
      expect(mockRentalService.calculate).toHaveBeenCalledTimes(3);

      // Check that analysisPeriodMonths increments
      expect(mockCashService.calculate.mock.calls[0][0].analysisPeriodMonths).toBe(1);
      expect(mockCashService.calculate.mock.calls[1][0].analysisPeriodMonths).toBe(2);
      expect(mockCashService.calculate.mock.calls[2][0].analysisPeriodMonths).toBe(3);
    });

    it('should return correct structure for each timeline point', () => {
      const input = createInput({ analysisPeriodMonths: 5 });
      const timeline = service.calculate(input);

      timeline.forEach((point, index) => {
        expect(point).toHaveProperty('month', index + 1);
        expect(point).toHaveProperty('cashCost');
        expect(point).toHaveProperty('financedCost');
        expect(point).toHaveProperty('rentalCost');
        expect(typeof point.cashCost).toBe('number');
        expect(typeof point.financedCost).toBe('number');
        expect(typeof point.rentalCost).toBe('number');
      });
    });

    it('should use mocked service values in timeline points', () => {
      const input = createInput({ analysisPeriodMonths: 2 });
      const timeline = service.calculate(input);

      // Month 1: cash = 50000 + 100*1 = 50100
      expect(timeline[0].cashCost).toBe(50100);
      expect(timeline[0].financedCost).toBe(60200);
      expect(timeline[0].rentalCost).toBe(2000);

      // Month 2: cash = 50000 + 100*2 = 50200
      expect(timeline[1].cashCost).toBe(50200);
      expect(timeline[1].financedCost).toBe(60400);
      expect(timeline[1].rentalCost).toBe(4000);
    });
  });
});
