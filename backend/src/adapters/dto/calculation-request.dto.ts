/**
 * Request DTO for POST /api/calculate
 *
 * Aligns with CalculationInput from domain types.
 * This is the contract for incoming HTTP requests.
 *
 * Note: Use CalculationInputSchema from validators for runtime validation.
 * This type documents the expected shape before validation.
 */

export interface CalculationRequestDto {
  /** Vehicle purchase price in currency (required) */
  carValue: number;

  /** Monthly rental subscription cost (required) */
  monthlyRent: number;

  /** Monthly interest rate for financing (e.g., 0.015 = 1.5%) (required) */
  interestRateMonth: number;

  /** Loan term in months (e.g., 48) (required) */
  financingTermMonths: number;

  /** Analysis period in months (e.g., 48) (required) */
  analysisPeriodMonths: number;

  /** Down payment percentage (optional, default 25%) */
  downPaymentPercent?: number;

  /** Annual maintenance cost (optional, default 2000) */
  maintenanceAnnual?: number;

  /** Annual insurance rate (optional, default 0.06 = 6%) */
  insuranceRateAnnual?: number;

  /** IPVA tax rate (optional, default 0.04 = 4%) */
  ipvaRate?: number;

  /** Depreciation rates per year (optional, defaults: [0.20, 0.15, 0.15, 0.10, 0.10]) */
  depreciationRate?: number[];
}
