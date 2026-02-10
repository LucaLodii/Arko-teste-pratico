/**
 * Zod validation schema for calculation input
 *
 * Validates incoming request body and applies explicit defaults.
 * See financial-formulas.md for default values.
 */

import { z } from 'zod';

/** Default depreciation rates per year (exponential) - financial-formulas § 1.1 */
const DEFAULT_DEPRECIATION_RATE = [0.2, 0.15, 0.15, 0.1, 0.1] as const;

const depreciationRateItem = z
  .number()
  .min(0, 'each depreciation rate must be between 0 and 1')
  .max(1, 'each depreciation rate must be between 0 and 1');

export const CalculationInputSchema = z.object({
  carValue: z.number().positive('carValue must be positive'),
  monthlyRent: z.number().positive('monthlyRent must be positive'),
  interestRateMonth: z
    .number()
    .min(0, 'interestRateMonth must be between 0 and 1')
    .max(1, 'interestRateMonth must be between 0 and 1'),
  financingTermMonths: z
    .number()
    .int('financingTermMonths must be an integer')
    .positive('financingTermMonths must be positive'),
  analysisPeriodMonths: z
    .number()
    .int('analysisPeriodMonths must be an integer')
    .positive('analysisPeriodMonths must be positive'),
  downPaymentPercent: z
    .number()
    .min(0, 'downPaymentPercent must be between 0 and 1')
    .max(1, 'downPaymentPercent must be between 0 and 1')
    .default(0.25),
  maintenanceAnnual: z
    .number()
    .positive('maintenanceAnnual must be positive')
    .default(2000),
  insuranceRateAnnual: z
    .number()
    .min(0, 'insuranceRateAnnual must be between 0 and 1')
    .max(1, 'insuranceRateAnnual must be between 0 and 1')
    .default(0.06),
  ipvaRate: z
    .number()
    .min(0, 'ipvaRate must be between 0 and 1')
    .max(1, 'ipvaRate must be between 0 and 1')
    .default(0.04),
  depreciationRate: z
    .array(depreciationRateItem)
    .min(1, 'depreciationRate must have at least one rate')
    .default([...DEFAULT_DEPRECIATION_RATE]),
});

/** Parsed and validated input type - safe to pass to use case */
export type ValidatedCalculationInput = z.infer<typeof CalculationInputSchema>;

/**
 * Validates request body and returns parsed data or validation errors.
 * Use in controller: const result = validateCalculationInput(req.body);
 */
export function validateCalculationInput(input: unknown) {
  return CalculationInputSchema.safeParse(input);
}
