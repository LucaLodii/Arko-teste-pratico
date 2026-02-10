/**
 * Calculate Comparison Use Case
 *
 * Orchestrates all calculation services (cash, financed, rental, break-even)
 * and returns a unified comparison result. No business logic - only coordination.
 *
 * Reference: .cursor/rules/architecture.md (application layer, use case example)
 */

import type { CalculationInput, CalculationResponse } from '../../domain/types';
import { CashPurchaseService } from '../services/cash-purchase.service';
import { FinancedPurchaseService } from '../services/financed-purchase.service';
import { RentalService } from '../services/rental.service';
import { BreakEvenService } from '../services/break-even.service';

export class CalculateComparisonUseCase {
  constructor(
    private readonly cashPurchaseService: CashPurchaseService,
    private readonly financedPurchaseService: FinancedPurchaseService,
    private readonly rentalService: RentalService,
    private readonly breakEvenService: BreakEvenService
  ) {}

  /**
   * Executes the full comparison calculation across all scenarios.
   *
   * @param input - Calculation input (car value, rental, financing terms, etc.)
   * @returns CalculationResponse aggregating cash, financed, rental, and break-even results
   */
  execute(input: CalculationInput): CalculationResponse {
    const cashPurchase = this.cashPurchaseService.calculate(input);
    const financedPurchase = this.financedPurchaseService.calculate(input);
    const rental = this.rentalService.calculate(input);
    const breakEven = this.breakEvenService.calculate(input);

    return {
      cashPurchase,
      financedPurchase,
      rental,
      breakEven,
    };
  }
}
