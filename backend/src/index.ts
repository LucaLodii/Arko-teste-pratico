/**
 * Backend entry point – composition root (infrastructure layer).
 * Wires services, use case, controller, and routes.
 *
 * Reference: .cursor/rules/architecture.md (Infrastructure section)
 */

import cors from "cors";
import express from "express";
import { OpportunityCostService } from "./application/services/opportunity-cost.service";
import { CashPurchaseService } from "./application/services/cash-purchase.service";
import { FinancedPurchaseService } from "./application/services/financed-purchase.service";
import { RentalService } from "./application/services/rental.service";
import { BreakEvenService } from "./application/services/break-even.service";
import { CalculateComparisonUseCase } from "./application/use-cases/calculate-comparison.use-case";
import { CalculationController } from "./adapters/controllers/calculation.controller";
import { createCalculationRoutes } from "./routes/calculation.routes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

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

// Use case and controller
const calculateComparisonUseCase = new CalculateComparisonUseCase(
  cashPurchaseService,
  financedPurchaseService,
  rentalService,
  breakEvenService
);
const calculationController = new CalculationController(calculateComparisonUseCase);

// API routes: /api/health, /api/calculate
const calculationRoutes = createCalculationRoutes(calculationController);
const apiRouter = express.Router();
apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));
apiRouter.use(calculationRoutes); // POST /calculate
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
