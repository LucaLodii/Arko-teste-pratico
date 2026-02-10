/**
 * Calculation routes
 *
 * POST /calculate → CalculationController.calculate
 * Note: /api prefix is added when mounting in index.ts
 */

import { Router } from 'express';
import type { CalculationController } from '../adapters/controllers/calculation.controller';

export function createCalculationRoutes(controller: CalculationController): Router {
  const router = Router();
  router.post('/calculate', (req, res) => controller.calculate(req, res));
  return router;
}
