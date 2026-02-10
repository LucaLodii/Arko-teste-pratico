/**
 * Calculation Controller
 *
 * HTTP adapter: validates input, calls use case, formats response.
 * No business logic - only HTTP ↔ domain adaptation.
 *
 * Reference: .cursor/rules/architecture.md (controllers section)
 */

import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import type { CalculateComparisonUseCase } from '../../application/use-cases/calculate-comparison.use-case';
import { validateCalculationInput } from '../validators/calculation-input.validator';

function formatZodError(error: ZodError): Array<{ path: string; message: string }> {
  return error.issues.map((issue) => ({
    path: issue.path.length > 0 ? issue.path.join('.') : '(root)',
    message: issue.message,
  }));
}

export class CalculationController {
  constructor(private readonly calculateComparisonUseCase: CalculateComparisonUseCase) {}

  async calculate(req: Request, res: Response): Promise<void> {
    try {
      const validation = validateCalculationInput(req.body);

      if (!validation.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: formatZodError(validation.error),
        });
        return;
      }

      const result = this.calculateComparisonUseCase.execute(validation.data);
      res.json(result);
    } catch (error) {
      console.error('[CalculationController] Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
