/**
 * Unit tests for FinancedPurchaseService
 */

import { FinancedPurchaseService } from '../application/services/financed-purchase.service';
import { OpportunityCostService } from '../application/services/opportunity-cost.service';
import type { CalculationInput } from '../domain/types';

describe('FinancedPurchaseService', () => {
  let mockOpportunityCostService: jest.Mocked<OpportunityCostService>;
  let service: FinancedPurchaseService;

  const createInput = (overrides: Partial<CalculationInput> = {}): CalculationInput => ({
    carValue: 50000,
    monthlyRent: 2200,
    interestRateMonth: 0.015,
    financingTermMonths: 48,
    analysisPeriodMonths: 48,
    ...overrides,
  });

  beforeEach(() => {
    // Mock returns 5000 to isolate FinancedPurchaseService logic
    // Actual value doesn't matter since we're testing service independently
    mockOpportunityCostService = {
      calculate: jest.fn().mockReturnValue(5000),
    } as unknown as jest.Mocked<OpportunityCostService>;
    service = new FinancedPurchaseService(mockOpportunityCostService);
  });

  describe('calculate', () => {
    it('should calculate Sistema Price monthly installment (parcela)', () => {
      const input = createInput({
        carValue: 100000,
        downPaymentPercent: 0.25,
        interestRateMonth: 0.015,
        financingTermMonths: 48,
        analysisPeriodMonths: 48,
      });

      const result = service.calculate(input);

      // valorFinanciado = 75000
      // parcela = 75000 * (i * (1+i)^n) / ((1+i)^n - 1)
      const valorFinanciado = 75000;
      const i = 0.015;
      const n = 48;
      const expectedParcela =
        valorFinanciado *
        (i * Math.pow(1 + i, n)) /
        (Math.pow(1 + i, n) - 1);

      expect(result.parcela).toBeCloseTo(expectedParcela, 2);
      expect(result.parcela).toBeGreaterThan(2000);
      expect(result.parcela).toBeLessThan(2500);
    });

    it('should use simple division when interest rate is 0', () => {
      const input = createInput({
        carValue: 100000,
        downPaymentPercent: 0.25,
        interestRateMonth: 0,
        financingTermMonths: 48,
        analysisPeriodMonths: 48,
      });

      const result = service.calculate(input);

      // valorFinanciado = 75000, parcela = 75000/48 = 1562.50
      expect(result.parcela).toBe(1562.5);
      expect(result.totalJuros).toBe(0);
    });

    it('should calculate down payment with default 25%', () => {
      const input = createInput({ carValue: 100000 });

      const result = service.calculate(input);

      // entrada = 25000
      expect(mockOpportunityCostService.calculate).toHaveBeenCalledWith(25000, 4);
    });

    it('should apply opportunity cost only to down payment, not full car value', () => {
      const input = createInput({
        carValue: 100000,
        downPaymentPercent: 0.2,
        analysisPeriodMonths: 24,
      });

      service.calculate(input);

      // entrada = 20000, anos = 2
      expect(mockOpportunityCostService.calculate).toHaveBeenCalledWith(20000, 2);
    });

    it('should validate total cost includes all components', () => {
      const input = createInput();
      const result = service.calculate(input);

      const expectedTotal =
        result.breakdown.totalParcelas +
        input.carValue * 0.25 + // entrada
        result.breakdown.ipva +
        result.breakdown.seguro +
        result.breakdown.manutencao +
        result.breakdown.depreciacao +
        result.breakdown.custoOportunidade;

      expect(result.totalCost).toBeCloseTo(expectedTotal, 2);
    });

    it('should return breakdown with all required fields', () => {
      const input = createInput();
      const result = service.calculate(input);

      expect(result).toHaveProperty('totalCost');
      expect(result).toHaveProperty('parcela');
      expect(result).toHaveProperty('totalJuros');
      expect(result.breakdown).toHaveProperty('totalParcelas');
      expect(result.breakdown).toHaveProperty('totalJuros');
      expect(result.breakdown).toHaveProperty('depreciacao');
      expect(result.breakdown).toHaveProperty('ipva');
      expect(result.breakdown).toHaveProperty('seguro');
      expect(result.breakdown).toHaveProperty('manutencao');
      expect(result.breakdown).toHaveProperty('custoOportunidade');
    });

    it('should cap installments paid at financing term when analysis period is longer', () => {
      const input = createInput({
        analysisPeriodMonths: 60,
        financingTermMonths: 48,
      });

      const result = service.calculate(input);

      // Should only pay 48 installments, not 60
      expect(result.breakdown.totalParcelas).toBeCloseTo(
        result.parcela * 48,
        2
      );
    });

    it('should handle zero down payment', () => {
      const input = createInput({
        carValue: 50000,
        downPaymentPercent: 0,
      });
      const result = service.calculate(input);

      // entrada = 0, valorFinanciado = 50000
      expect(mockOpportunityCostService.calculate).toHaveBeenCalledWith(0, 4);
      expect(result.breakdown.custoOportunidade).toBe(5000); // mocked value
    });

    it('should handle 100% down payment (cash-like)', () => {
      const input = createInput({
        carValue: 50000,
        downPaymentPercent: 1.0,
      });
      const result = service.calculate(input);

      // valorFinanciado = 0, parcela = 0
      expect(result.parcela).toBe(0);
      expect(result.breakdown.totalParcelas).toBe(0);
      expect(result.breakdown.totalJuros).toBe(0);
    });

    it('should handle analysis period much longer than financing term', () => {
      const input = createInput({
        analysisPeriodMonths: 120,
        financingTermMonths: 24,
      });
      const result = service.calculate(input);

      // Should only pay 24 installments
      expect(result.breakdown.totalParcelas).toBeCloseTo(
        result.parcela * 24,
        2
      );
    });

    it('should handle very short financing term (6 months)', () => {
      const input = createInput({
        carValue: 10000,
        financingTermMonths: 6,
        analysisPeriodMonths: 6,
      });
      const result = service.calculate(input);

      // High monthly payment, low total interest
      expect(result.parcela).toBeGreaterThan(1000);
      expect(result.breakdown.totalJuros).toBeLessThan(500);
    });
  });
});
