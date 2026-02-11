/**
 * Timeline Service
 *
 * Calculates cumulative costs per month for cash, financed, and rental scenarios.
 * Used for cost-over-time chart visualization.
 */

import type { CalculationInput, TimelineDataPoint } from '../../domain/types';
import type { CashPurchaseService } from './cash-purchase.service';
import type { FinancedPurchaseService } from './financed-purchase.service';
import type { RentalService } from './rental.service';

export class TimelineService {
  constructor(
    private readonly cashPurchaseService: CashPurchaseService,
    private readonly financedPurchaseService: FinancedPurchaseService,
    private readonly rentalService: RentalService
  ) {}

  /**
   * Calculates cost timeline: for each month from 1 to analysisPeriodMonths,
   * returns cumulative costs for cash, financed, and rental scenarios.
   */
  calculate(input: CalculationInput): TimelineDataPoint[] {
    const { analysisPeriodMonths } = input;
    const timeline: TimelineDataPoint[] = [];

    for (let month = 1; month <= analysisPeriodMonths; month++) {
      const inputForMonth: CalculationInput = {
        ...input,
        analysisPeriodMonths: month,
      };

      const cashCost = this.cashPurchaseService.calculate(inputForMonth).totalCost;
      const financedCost =
        this.financedPurchaseService.calculate(inputForMonth).totalCost;
      const rentalCost = this.rentalService.calculate(inputForMonth).totalCost;

      timeline.push({
        month,
        cashCost,
        financedCost,
        rentalCost,
      });
    }

    return timeline;
  }
}
