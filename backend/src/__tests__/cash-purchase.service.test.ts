/**
 * Unit tests for CashPurchaseService
 */

import { CashPurchaseService } from '../application/services/cash-purchase.service';
import { OpportunityCostService } from '../application/services/opportunity-cost.service';
import type { CalculationInput } from '../domain/types';

describe('CashPurchaseService', () => {
  let mockOpportunityCostService: jest.Mocked<OpportunityCostService>;
  let service: CashPurchaseService;

  const createInput = (overrides: Partial<CalculationInput> = {}): CalculationInput => ({
    carValue: 50000,
    monthlyRent: 2200,
    interestRateMonth: 0.015,
    financingTermMonths: 48,
    analysisPeriodMonths: 48,
    ...overrides,
  });

  beforeEach(() => {
    mockOpportunityCostService = {
      calculate: jest.fn().mockReturnValue(10000),
    } as unknown as jest.Mocked<OpportunityCostService>;
    service = new CashPurchaseService(mockOpportunityCostService);
  });

  describe('calculate', () => {
    it('should calculate total cost with all components', () => {
      const input = createInput();
      const result = service.calculate(input);

      expect(result).toHaveProperty('totalCost');
      expect(result).toHaveProperty('breakdown');
      expect(result.breakdown).toHaveProperty('depreciacao');
      expect(result.breakdown).toHaveProperty('ipva');
      expect(result.breakdown).toHaveProperty('seguro');
      expect(result.breakdown).toHaveProperty('manutencao');
      expect(result.breakdown).toHaveProperty('custoOportunidade');
    });

    it('should verify totalCost formula: carValue - depreciation + ipva + seguro + manutencao + custoOportunidade', () => {
      const input = createInput();
      const result = service.calculate(input);

      const expectedTotal =
        input.carValue -
        result.breakdown.depreciacao +
        result.breakdown.ipva +
        result.breakdown.seguro +
        result.breakdown.manutencao +
        result.breakdown.custoOportunidade;

      expect(result.totalCost).toBeCloseTo(expectedTotal, 2);
    });

    it('should use mocked opportunity cost in calculation', () => {
      mockOpportunityCostService.calculate.mockReturnValue(5000);
      const input = createInput({ analysisPeriodMonths: 24 });

      const result = service.calculate(input);

      expect(mockOpportunityCostService.calculate).toHaveBeenCalledWith(
        50000,
        2
      );
      expect(result.breakdown.custoOportunidade).toBe(5000);
    });

    it('should apply depreciation with default rates [0.2, 0.15, 0.15, 0.1, 0.1]', () => {
      const input = createInput({ analysisPeriodMonths: 12 });
      const result = service.calculate(input);

      // Year 1: 50000 * 0.8 = 40000, depreciation = 10000
      expect(result.breakdown.depreciacao).toBeCloseTo(10000, 0);
    });

    it('should handle partial year calculations (30 months = 2 years + 6 months)', () => {
      const input = createInput({ analysisPeriodMonths: 30 });
      const result = service.calculate(input);

      expect(mockOpportunityCostService.calculate).toHaveBeenCalledWith(
        50000,
        2.5
      );
      // Maintenance: 2 full years + 6 months = 2000*2 + 2000*0.5 = 5000
      expect(result.breakdown.manutencao).toBeCloseTo(5000, 0);
    });

    it('should accept custom depreciation rates', () => {
      const input = createInput({
        analysisPeriodMonths: 12,
        depreciationRate: [0.5], // 50% first year
      });
      const result = service.calculate(input);

      // Year 1: 50000 * 0.5 = 25000, depreciation = 25000
      expect(result.breakdown.depreciacao).toBeCloseTo(25000, 0);
    });

    it('should use custom ipvaRate, insuranceRateAnnual, maintenanceAnnual when provided', () => {
      const input = createInput({
        analysisPeriodMonths: 12,
        ipvaRate: 0.03,
        insuranceRateAnnual: 0.05,
        maintenanceAnnual: 3000,
      });
      const result = service.calculate(input);

      // IPVA: 50000 * 0.03 = 1500
      expect(result.breakdown.ipva).toBeCloseTo(1500, 0);
      // Insurance: 50000 * 0.05 = 2500
      expect(result.breakdown.seguro).toBeCloseTo(2500, 0);
      // Maintenance: 3000
      expect(result.breakdown.manutencao).toBe(3000);
    });
  });
});
