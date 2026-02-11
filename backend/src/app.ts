/**
 * Express app factory – composition root (infrastructure layer).
 * Exported for integration testing with Supertest.
 *
 * Reference: .cursor/rules/architecture.md (Infrastructure section)
 */

import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { OpportunityCostService } from './application/services/opportunity-cost.service';
import { CashPurchaseService } from './application/services/cash-purchase.service';
import { FinancedPurchaseService } from './application/services/financed-purchase.service';
import { RentalService } from './application/services/rental.service';
import { BreakEvenService } from './application/services/break-even.service';
import { TimelineService } from './application/services/timeline.service';
import { CalculateComparisonUseCase } from './application/use-cases/calculate-comparison.use-case';
import { CalculateTimelineUseCase } from './application/use-cases/calculate-timeline.use-case';
import { CalculationController } from './adapters/controllers/calculation.controller';
import { createCalculationRoutes } from './routes/calculation.routes';

export function createApp(): express.Application {
  const app = express();

  // CORS: allow comma-separated FRONTEND_URL for multiple envs (staging + production)
  // When FRONTEND_URL is unset, use origin: true (allow all). Using ['*'] fails because
  // cors treats array elements as literals—'*' in array does not mean wildcard.
  const allowedOrigins = process.env.FRONTEND_URL?.split(',').map((o) => o.trim()).filter(Boolean);
  const corsOrigin = allowedOrigins?.length ? allowedOrigins : true;
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  // Swagger API docs
  const swaggerPath = path.resolve(process.cwd(), 'src', 'swagger.yaml');
  const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
  const swaggerDocument = YAML.parse(swaggerFile);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Dependency injection: services
  const opportunityCostService = new OpportunityCostService();
  const cashPurchaseService = new CashPurchaseService(opportunityCostService);
  const financedPurchaseService = new FinancedPurchaseService(opportunityCostService);
  const rentalService = new RentalService();
  const breakEvenService = new BreakEvenService(
    cashPurchaseService,
    financedPurchaseService,
    rentalService
  );
  const timelineService = new TimelineService(
    cashPurchaseService,
    financedPurchaseService,
    rentalService
  );

  // Use cases and controller
  const calculateComparisonUseCase = new CalculateComparisonUseCase(
    cashPurchaseService,
    financedPurchaseService,
    rentalService,
    breakEvenService
  );
  const calculateTimelineUseCase = new CalculateTimelineUseCase(timelineService);
  const calculationController = new CalculationController(
    calculateComparisonUseCase,
    calculateTimelineUseCase
  );

  // API routes: /api/health, /api/calculate
  const calculationRoutes = createCalculationRoutes(calculationController);
  const apiRouter = express.Router();
  apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
  apiRouter.use(calculationRoutes);
  app.use('/api', apiRouter);

  return app;
}
