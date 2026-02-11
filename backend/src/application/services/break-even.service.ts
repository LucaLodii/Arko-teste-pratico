/**
 * Break-Even Service
 *
 * Calculates when rental cost equals purchase cost (cash and financed separately).
 * Orchestrates CashPurchaseService, FinancedPurchaseService, and RentalService
 * to find the crossover points over time.
 *
 * Reference: .cursor/rules/financial-formulas.md § 4 (Break-Even Point)
 */

import type { CalculationInput, BreakEvenResult } from '../../domain/types';
import { CashPurchaseService } from './cash-purchase.service';
import { FinancedPurchaseService } from './financed-purchase.service';
import { RentalService } from './rental.service';

export class BreakEvenService {
  constructor(
    private readonly cashPurchaseService: CashPurchaseService,
    private readonly financedPurchaseService: FinancedPurchaseService,
    private readonly rentalService: RentalService
  ) {}

  /**
   * Calculates the break-even points: first month where rental cost equals or
   * exceeds cash purchase cost, and first month where rental cost equals or
   * exceeds financed purchase cost.
   *
   * @param input - Calculation input (all fields used for scenario calculations)
   * @returns BreakEvenResult with breakEvenCashMonths and breakEvenFinancedMonths (null if never reached)
   */
  calculate(input: CalculationInput): BreakEvenResult {
    const { analysisPeriodMonths } = input;
    let breakEvenCashMonths: number | null = null;
    let breakEvenFinancedMonths: number | null = null;

    for (let month = 1; month <= analysisPeriodMonths; month++) {
      const inputForMonth: CalculationInput = {
        ...input,
        analysisPeriodMonths: month,
      };

      const cashCost = this.cashPurchaseService
        .calculate(inputForMonth)
        .totalCost;
      const financedCost = this.financedPurchaseService
        .calculate(inputForMonth)
        .totalCost;
      const rentalCost = this.rentalService.calculate(inputForMonth).totalCost;

      if (breakEvenCashMonths === null && rentalCost >= cashCost) {
        breakEvenCashMonths = month;
      }

      if (breakEvenFinancedMonths === null && rentalCost >= financedCost) {
        breakEvenFinancedMonths = month;
      }

      if (breakEvenCashMonths !== null && breakEvenFinancedMonths !== null) {
        break;
      }
    }

    return {
      breakEvenCashMonths,
      breakEvenFinancedMonths,
    };
  }
}
