/**
 * Domain Types for Rent vs. Buy Car Calculator
 * 
 * Pure TypeScript types with no external dependencies.
 * These types represent the core domain concepts of the application.
 */

/**
 * Input data for all calculation scenarios
 */
export interface CalculationInput {
  /** Vehicle purchase price in currency */
  carValue: number;

  /** Monthly rental subscription cost */
  monthlyRent: number;

  /** Monthly interest rate for financing (e.g., 0.015 = 1.5%) */
  interestRateMonth: number;

  /** Loan term in months (e.g., 48) */
  financingTermMonths: number;

  /** Analysis period in months (e.g., 48) */
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

/**
 * Breakdown of costs for cash purchase
 */
export interface CashPurchaseBreakdown {
  /** Total depreciation over the period */
  depreciacao: number;

  /** Total IPVA (vehicle tax) over the period */
  ipva: number;

  /** Total insurance cost over the period */
  seguro: number;

  /** Total maintenance cost over the period */
  manutencao: number;

  /** Opportunity cost of capital invested */
  custoOportunidade: number;
}

/**
 * Result of cash purchase calculation
 */
export interface CashPurchaseResult {
  /** Total cost over the analysis period */
  totalCost: number;

  /** Detailed breakdown of all costs */
  breakdown: CashPurchaseBreakdown;
}

/**
 * Breakdown of costs for financed purchase
 */
export interface FinancedPurchaseBreakdown {
  /** Total amount paid in installments */
  totalParcelas: number;

  /** Total interest paid on the loan */
  totalJuros: number;

  /** Total IPVA (vehicle tax) over the period */
  ipva: number;

  /** Total insurance cost over the period */
  seguro: number;

  /** Total maintenance cost over the period */
  manutencao: number;

  /** Opportunity cost of down payment */
  custoOportunidade: number;
}

/**
 * Result of financed purchase calculation
 */
export interface FinancedPurchaseResult {
  /** Total cost over the analysis period */
  totalCost: number;

  /** Monthly installment amount (Price system) */
  parcela: number;

  /** Total interest paid on the loan */
  totalJuros: number;

  /** Detailed breakdown of all costs */
  breakdown: FinancedPurchaseBreakdown;
}

/**
 * Result of rental calculation
 */
export interface RentalResult {
  /** Total rental cost over the period */
  totalCost: number;

  /** Monthly rental cost */
  monthlyCost: number;
}

/**
 * Break-even analysis result
 */
export interface BreakEvenResult {
  /** Month when rental cost equals cash purchase cost (null if never) */
  breakEvenCashMonths: number | null;

  /** Month when rental cost equals financed purchase cost (null if never) */
  breakEvenFinancedMonths: number | null;
}

/**
 * Complete calculation response aggregating all scenarios
 */
export interface CalculationResponse {
  /** Cash purchase scenario result */
  cashPurchase: CashPurchaseResult;

  /** Financed purchase scenario result */
  financedPurchase: FinancedPurchaseResult;

  /** Rental scenario result */
  rental: RentalResult;

  /** Break-even analysis result */
  breakEven: BreakEvenResult;
}
