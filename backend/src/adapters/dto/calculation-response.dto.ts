/**
 * Response DTO for POST /api/calculate
 *
 * Re-exports domain types to guarantee alignment and avoid drift.
 * This is the contract for outgoing HTTP responses.
 */

import type {
  CalculationResponse,
  CashPurchaseResult,
  CashPurchaseBreakdown,
  FinancedPurchaseResult,
  FinancedPurchaseBreakdown,
  RentalResult,
  BreakEvenResult,
} from '../../domain/types';

/** Breakdown of costs for cash purchase */
export type CashPurchaseBreakdownDto = CashPurchaseBreakdown;

/** Result of cash purchase calculation */
export type CashPurchaseResultDto = CashPurchaseResult;

/** Breakdown of costs for financed purchase */
export type FinancedPurchaseBreakdownDto = FinancedPurchaseBreakdown;

/** Result of financed purchase calculation */
export type FinancedPurchaseResultDto = FinancedPurchaseResult;

/** Result of rental calculation */
export type RentalResultDto = RentalResult;

/** Break-even analysis result */
export type BreakEvenResultDto = BreakEvenResult;

/** Complete calculation response aggregating all scenarios */
export type CalculationResponseDto = CalculationResponse;
