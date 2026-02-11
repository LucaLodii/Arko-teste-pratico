/**
 * Unit tests for BreakEvenService
 */

import { BreakEvenService } from '../application/services/break-even.service';
import { CashPurchaseService } from '../application/services/cash-purchase.service';
import { FinancedPurchaseService } from '../application/services/financed-purchase.service';
import { RentalService } from '../application/services/rental.service';
import type { CalculationInput } from '../domain/types';

describe('BreakEvenService', () => {
  let mockCashService: jest.Mocked<CashPurchaseService>;
  let mockFinancedService: jest.Mocked<FinancedPurchaseService>;
  let mockRentalService: jest.Mocked<RentalService>;
  let service: BreakEvenService;

  const createInput = (overrides: Partial<CalculationInput> = {}): CalculationInput => ({
    carValue: 50000,
    monthlyRent: 2200,
    interestRateMonth: 0.015,
    financingTermMonths: 48,
    analysisPeriodMonths: 48,
    ...overrides,
  });

  beforeEach(() => {
    mockCashService = {
      calculate: jest.fn(),
    } as unknown as jest.Mocked<CashPurchaseService>;

    mockFinancedService = {
      calculate: jest.fn(),
    } as unknown as jest.Mocked<FinancedPurchaseService>;

    mockRentalService = {
      calculate: jest.fn(),
    } as unknown as jest.Mocked<RentalService>;

    service = new BreakEvenService(
      mockCashService,
      mockFinancedService,
      mockRentalService
    );
  });

  describe('calculate', () => {
    it('should find break-even month when rental equals cash purchase', () => {
      // Rental starts cheaper, becomes more expensive over time
      mockCashService.calculate.mockImplementation((input) => ({
        totalCost: 50000, // Fixed cash cost
        breakdown: {} as any,
      }));

      mockFinancedService.calculate.mockImplementation((input) => ({
        totalCost: 60000,
        parcela: 0,
        totalJuros: 0,
        breakdown: {} as any,
      }));

      mockRentalService.calculate.mockImplementation((input) => ({
        totalCost: 2000 * input.analysisPeriodMonths, // Linear growth
        monthlyCost: 2000,
      }));

      const input = createInput({ analysisPeriodMonths: 30 });
      const result = service.calculate(input);

      // Rental reaches 50000 at month 25
      expect(result.breakEvenCashMonths).toBe(25);
      expect(result.breakEvenFinancedMonths).toBe(30);
    });

    it('should return null when rental never breaks even', () => {
      mockCashService.calculate.mockReturnValue({
        totalCost: 100000, // Very high fixed cost
        breakdown: {} as any,
      });

      mockFinancedService.calculate.mockReturnValue({
        totalCost: 120000, // Very high fixed cost
        parcela: 0,
        totalJuros: 0,
        breakdown: {} as any,
      });

      mockRentalService.calculate.mockImplementation((input) => ({
        totalCost: 1000 * input.analysisPeriodMonths, // Max 48000
        monthlyCost: 1000,
      }));

      const input = createInput({ analysisPeriodMonths: 48 });
      const result = service.calculate(input);

      expect(result.breakEvenCashMonths).toBeNull();
      expect(result.breakEvenFinancedMonths).toBeNull();
    });

    it('should find break-even for financed before cash when financed is cheaper', () => {
      mockCashService.calculate.mockImplementation((input) => ({
        totalCost: 60000,
        breakdown: {} as any,
      }));

      mockFinancedService.calculate.mockImplementation((input) => ({
        totalCost: 40000,
        parcela: 0,
        totalJuros: 0,
        breakdown: {} as any,
      }));

      mockRentalService.calculate.mockImplementation((input) => ({
        totalCost: 2000 * input.analysisPeriodMonths,
        monthlyCost: 2000,
      }));

      const input = createInput({ analysisPeriodMonths: 40 });
      const result = service.calculate(input);

      // Rental reaches financed (40000) at month 20, cash (60000) at month 30
      expect(result.breakEvenFinancedMonths).toBe(20);
      expect(result.breakEvenCashMonths).toBe(30);
      expect(result.breakEvenFinancedMonths).toBeLessThan(result.breakEvenCashMonths!);
    });

    it('should stop searching early when both break-evens found', () => {
      mockCashService.calculate.mockReturnValue({
        totalCost: 10000,
        breakdown: {} as any,
      });

      mockFinancedService.calculate.mockReturnValue({
        totalCost: 20000,
        parcela: 0,
        totalJuros: 0,
        breakdown: {} as any,
      });

      mockRentalService.calculate.mockImplementation((input) => ({
        totalCost: 1000 * input.analysisPeriodMonths,
        monthlyCost: 1000,
      }));

      const input = createInput({ analysisPeriodMonths: 100 });
      const result = service.calculate(input);

      // Break-evens at month 10 and 20, should stop after month 20
      expect(result.breakEvenCashMonths).toBe(10);
      expect(result.breakEvenFinancedMonths).toBe(20);
      expect(mockCashService.calculate).toHaveBeenCalledTimes(20);
    });
  });
});
