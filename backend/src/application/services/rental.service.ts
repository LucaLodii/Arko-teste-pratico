/**
 * Rental Service
 *
 * Calculates the total cost of renting a car over a specified analysis period.
 * Rental has no ownership costs, depreciation, or opportunity cost.
 *
 * Reference: .cursor/rules/financial-formulas.md § 3 (Aluguel)
 */

import type { CalculationInput, RentalResult } from '../../domain/types';

export class RentalService {
  /**
   * Calculates the total cost of car rental over the analysis period.
   *
   * @param input - Calculation input (monthlyRent, analysisPeriodMonths)
   * @returns RentalResult with totalCost and monthlyCost
   */
  calculate(input: CalculationInput): RentalResult {
    const { monthlyRent, analysisPeriodMonths } = input;
    const totalCost = monthlyRent * analysisPeriodMonths;

    return {
      totalCost,
      monthlyCost: monthlyRent,
    };
  }
}
