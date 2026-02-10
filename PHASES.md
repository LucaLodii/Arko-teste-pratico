# Development Phases

Track progress through each development phase of the Rent vs. Buy Car Calculator project.

Requirements are documented in README, cursor rules (`.cursor/rules/`), and this file.

---

## Context for AI

- One phase = one focused prompt. Do not merge phases.
- Always read referenced docs before implementing.
- Types/domain first (Phase 2), then services, then adapters.
- Keep services pure (no HTTP, no side effects).
- All calculation services receive `CalculationInput` and extract needed fields internally for consistency.
- Follow dependency injection: services inject dependencies via constructor.
- Use exponential depreciation with rates [0.20, 0.15, 0.15, 0.10, 0.10] for realistic vehicle depreciation.
- IPVA and insurance are calculated on depreciated value per year, not original value.
- Opportunity cost applies to: full car value (cash purchase) OR down payment only (financed purchase).
- Update Swagger spec (`backend/src/swagger.yaml`) whenever API contracts change (new endpoints, changed request/response schemas).

---

## Implementation Summary (Phases 1–8)

**Data flow:** `CalculationInput` → Services → `*Result` types → Use Case → `CalculationResponse`

```
CalculationInput
      │
      ├──► OpportunityCostService.calculate(capital, years) → number
      │
      ├──► CashPurchaseService.calculate(input) → CashPurchaseResult { totalCost, breakdown }
      │         └── injects OpportunityCostService (full car value)
      │
      ├──► FinancedPurchaseService.calculate(input) → FinancedPurchaseResult { totalCost, parcela, totalJuros, breakdown }
      │         └── injects OpportunityCostService (down payment only)
      │
      ├──► RentalService.calculate(input) → RentalResult { totalCost, monthlyCost }
      │         └── no dependencies
      │
      ├──► BreakEvenService.calculate(input) → BreakEvenResult { breakEvenCashMonths, breakEvenFinancedMonths }
      │         └── injects CashPurchaseService, FinancedPurchaseService, RentalService
      │
      └──► CalculateComparisonUseCase.execute(input) → CalculationResponse
                 └── injects CashPurchaseService, FinancedPurchaseService, RentalService, BreakEvenService
```

**Shared defaults:** Depreciation rates [0.20, 0.15, 0.15, 0.10, 0.10], maintenance R$ 2,000/year, insurance 6%, IPVA 4%. Cash and Financed services use identical depreciation logic for ownership costs.

**Next phases:** Phase 9 (DTOs and Zod validation), Phase 10 (Controller and routes).

---

## Phase 1: Environment Setup ✅

**Goal:** Set up development environment and project scaffolding.

**Tasks:**
- [x] Install Node.js v22 LTS (fnm recommended)
- [x] Create `.node-version` file for Node version pinning
- [x] Scaffold frontend (Vite + React + TypeScript)
- [x] Scaffold backend (Express + TypeScript)
- [x] Add basic server health check endpoint
- [x] Create documentation structure (README, PROJECT, PHASES)
- [x] Set up Cursor rules for AI context

**Status:** ✅ Complete

---

## Phase 2: Backend – Domain Types

**Goal:** Define TypeScript types/interfaces for calculation input and output. No logic yet.

**Tasks:**
- [x] Create `backend/src/domain/types/index.ts`
- [x] Define `CalculationInput`: carValue, monthlyRent, interestRateMonth, financingTermMonths, analysisPeriodMonths, downPaymentPercent (optional, default 25), maintenanceAnnual (optional), insuranceRateAnnual (optional), ipvaRate (optional), depreciationRate (optional)
- [x] Define `CashPurchaseResult` (totalCost, breakdown)
- [x] Define `FinancedPurchaseResult` (totalCost, parcela, totalJuros, breakdown)
- [x] Define `RentalResult` (totalCost, monthlyCost)
- [x] Define `BreakEvenResult` with `breakEvenCashMonths: number | null` and `breakEvenFinancedMonths: number | null` (only this type has these fields)
- [x] Define `CalculationResponse`: cashPurchase, financedPurchase, rental, breakEven (BreakEvenResult)

**Reference:** `.cursor/rules/architecture.md` (domain layer), `.cursor/rules/financial-formulas.md` (field names)

**Note:** For this MVP, we use plain TypeScript interfaces instead of full entity classes or value objects. This is acceptable for a stateless calculation service. The architecture.md mentions entities/ and value-objects/ folders, but they're optional for this scope.

**Constraint:** Do NOT implement any calculation logic or functions. Only types/interfaces.

**Status:** ✅ Complete

---

## Phase 3: Backend – Opportunity Cost Service

**Goal:** Implement custo de oportunidade as a reusable pure service.

**Tasks:**
- [x] Create `backend/src/application/services/opportunity-cost.service.ts`
- [x] Class-based service: `export class OpportunityCostService`
- [x] Method signature: `calculate(capital: number, years: number, taxaAnual?: number): number`
- [x] Default taxa: use Selic 0.1375 (13.75%) when taxaAnual not provided
- [x] Formula (compound interest):
  - `montanteFinal = capital * Math.pow(1 + taxaAnual, years)`
  - `return montanteFinal - capital` (returns only the earnings, not principal)
- [x] Example: R$ 50,000 for 3 years at 13.75% = R$ 23,456 opportunity cost

**Reference:** `.cursor/rules/financial-formulas.md` § 1.2 (Custo de Oportunidade)

**Constraint:** Service must be pure (no HTTP, no I/O, no side effects).

**Status:** ✅ Complete

---

## Phase 4: Backend – Cash Purchase Service ✅

**Goal:** Implement cash purchase cost calculation in a pure service.

**Before starting:** Read `.cursor/rules/financial-formulas.md` § 1 (Compra à Vista).

**Tasks:**
- [x] Create `backend/src/application/services/cash-purchase.service.ts`
- [x] Constructor: inject OpportunityCostService
- [x] Depreciação exponencial: Calcular valor residual iterando por cada ano usando taxas `[0.20, 0.15, 0.15, 0.10, 0.10]` do § 1.1
  - For each year: `valorAtual *= (1 - taxa[ano])`
  - Depreciation = `valorInicial - valorResidual`
- [x] IPVA: calcular sobre o valor depreciado de cada ano (valor no início do ano × aliquota), acumular todos os anos
- [x] Seguro: calcular sobre o valor depreciado de cada ano (valor no início do ano × taxa), acumular todos os anos
- [x] Manutenção: valor fixo anual × anos completos (usar `Math.floor(analysisPeriodMonths / 12)`)
- [x] Custo de oportunidade: usar OpportunityCostService.calculate(carValue, anos, taxaAnual) - capital imobilizado no carro
- [x] Custo total = Preço de Compra - Depreciação + IPVA + Seguro + Manutenção + Custo de Oportunidade (per § 1)
- [x] Return `CashPurchaseResult` with totalCost and breakdown: `{ depreciacao, ipva, seguro, manutencao, custoOportunidade }` (all numbers)
- [x] Method signature: `calculate(input: CalculationInput): CashPurchaseResult` (per architecture)

**Reference:** `.cursor/rules/financial-formulas.md` § 1 (Compra à Vista), § 1.1 (taxas), § 1.2 (custo de oportunidade)

**Important:** Convert months to years: `anos = Math.floor(analysisPeriodMonths / 12)`. Use years for depreciation iteration. Partial years: only complete years are counted (proration not implemented).

**Constraint:** Service must be pure (no HTTP, no side effects).

**Status:** ✅ Complete

---

## Phase 5: Backend – Financed Purchase Service ✅

**Goal:** Implement financed purchase cost calculation (Sistema Price).

**Before starting:** Read `.cursor/rules/financial-formulas.md` § 2 (Compra Financiada).

**Tasks:**
- [x] Create `backend/src/application/services/financed-purchase.service.ts`
- [x] Constructor: inject OpportunityCostService (for down payment opportunity cost)
- [x] Calcular entrada = carValue × downPaymentPercent
- [x] Calcular valorFinanciado = carValue - entrada
- [x] Implementar cálculo da parcela usando Sistema Price (fórmula § 2.1):
  - `PMT = PV × [i × (1 + i)^n] / [(1 + i)^n - 1]`
  - Where: PV = valorFinanciado, i = interestRateMonth, n = financingTermMonths
- [x] Calcular totalParcelas = parcela × min(analysisPeriodMonths, financingTermMonths)
- [x] Calcular totalJuros (full term: totalParcelas - valorFinanciado; partial: proportional)
- [x] Calcular custos de propriedade (IPVA, seguro, manutenção): reutilizar lógica de depreciação exponencial do cash-purchase
  - Use mesmas taxas `[0.20, 0.15, 0.15, 0.10, 0.10]` para valor depreciado
  - IPVA e seguro sobre valor depreciado por ano
  - Manutenção como fixo anual
- [x] Calcular custo de oportunidade: OpportunityCostService.calculate(entrada, anos) - apenas sobre a entrada
- [x] Custo total = entrada + totalParcelas + ipva + seguro + manutencao + depreciacao + custoOportunidade (per § 2)
- [x] Return `FinancedPurchaseResult` with totalCost, parcela, totalJuros, and breakdown: `{ totalParcelas, totalJuros, ipva, seguro, manutencao, custoOportunidade }` (all numbers)
- [x] Method signature: `calculate(input: CalculationInput): FinancedPurchaseResult`

**Reference:** `.cursor/rules/financial-formulas.md` § 2 (Compra Financiada), § 2.1 (Sistema Price)

**Important:** 
- If analysisPeriodMonths < financingTermMonths: only count parcelas paid until analysisPeriodMonths
- If analysisPeriodMonths >= financingTermMonths: count all financingTermMonths parcelas
- Convert months to years for ownership costs (IPVA, seguro, manutenção): `anos = Math.floor(analysisPeriodMonths / 12)`

**Constraint:** Service must be pure (no HTTP, no side effects).

**Status:** ✅ Complete

---

## Phase 6: Backend – Rental Service ✅

**Goal:** Implement rental cost calculation (simplest service).

**Tasks:**
- [x] Create `backend/src/application/services/rental.service.ts`
- [x] Class-based service: `export class RentalService`
- [x] Method: `calculate(input: CalculationInput): RentalResult`
- [x] Implementation: `totalCost = monthlyRent × analysisPeriodMonths`
- [x] Return `RentalResult` with:
  - `totalCost`: total cost over the entire period
  - `monthlyCost`: same as input.monthlyRent (constant monthly cost)
- [x] No dependencies (no constructor injection needed)

**Reference:** `.cursor/rules/financial-formulas.md` § 3 (Aluguel)

**Note:** This is the simplest service - rental has no ownership costs, depreciation, or opportunity cost.

**Status:** ✅ Complete

---

## Phase 7: Backend – Break-Even Service

**Goal:** Calculate when rental cost equals purchase cost (cash and financed separately). Return both break-even points.

**Before starting:** Read `.cursor/rules/financial-formulas.md` § 4 and § 1–3 for cost structure.

**Tasks:**
- [x] Create `backend/src/application/services/break-even.service.ts`
- [x] Constructor: inject CashPurchaseService, FinancedPurchaseService, RentalService (dependency injection per architecture)
- [x] Method signature: `calculate(input: CalculationInput): BreakEvenResult`
- [x] Algoritmo:
  - Para cada mês N de 1 até analysisPeriodMonths:
    - Criar novo input com `analysisPeriodMonths: N`
    - Chamar cashService.calculate(inputN) para obter cashCost acumulado até mês N
    - Chamar financedService.calculate(inputN) para obter financedCost acumulado até mês N
    - Chamar rentalService.calculate(inputN) para obter rentalCost acumulado até mês N
  - Encontrar breakEvenCashMonths: primeiro mês onde rentalCost >= cashCost (ou null se nunca atingir)
  - Encontrar breakEvenFinancedMonths: primeiro mês onde rentalCost >= financedCost (ou null se nunca atingir)
- [x] Return `BreakEvenResult` with `{ breakEvenCashMonths, breakEvenFinancedMonths }` (both number | null)

**Reference:** `.cursor/rules/financial-formulas.md` § 4 (Break-Even Point)

**Note:** This service orchestrates the other three services to find the crossover points over time.

**Status:** ✅ Complete

---

## Phase 8: Backend – Calculate Comparison Use Case

**Goal:** Orchestrate all services and return unified result.

**Tasks:**
- [x] Create `backend/src/application/use-cases/calculate-comparison.use-case.ts`
- [x] Constructor: inject CashPurchaseService, FinancedPurchaseService, RentalService, BreakEvenService (all four services)
- [x] Method: `execute(input: CalculationInput): CalculationResponse`
- [x] Implementation:
  - Call `cashPurchase = cashService.calculate(input)`
  - Call `financedPurchase = financedService.calculate(input)`
  - Call `rental = rentalService.calculate(input)`
  - Call `breakEven = breakEvenService.calculate(input)` (services already injected in BreakEvenService constructor)
  - Aggregate and return: `{ cashPurchase, financedPurchase, rental, breakEven }`
- [x] Return type must match `CalculationResponse` from domain types

**Reference:** `.cursor/rules/architecture.md` (application layer, use case example)

**Status:** ✅ Complete

---

## Phase 9: Backend – DTOs and Validation

**Goal:** Define request/response DTOs and validate input with Zod.

**Tasks:**
- [x] Create `backend/src/adapters/dto/calculation-request.dto.ts` (align with CalculationInput)
- [x] Create `backend/src/adapters/dto/calculation-response.dto.ts` (align with CalculationResponse)
- [x] Create `backend/src/adapters/validators/calculation-input.validator.ts` – Zod schema with explicit defaults:
  - Required fields: carValue, monthlyRent, interestRateMonth, financingTermMonths, analysisPeriodMonths (all positive numbers)
  - `downPaymentPercent`: default 0.25 (25%)
  - `maintenanceAnnual`: default 2000
  - `insuranceRateAnnual`: default 0.06 (6%)
  - `ipvaRate`: default 0.04 (4%)
  - `depreciationRate`: default array `[0.20, 0.15, 0.15, 0.10, 0.10]` from financial-formulas § 1.1
- [x] Add validation rules: all numbers must be positive, rates between 0-1, periods in months (positive integers)
- [x] Export parsed/safe type from validator

**Reference:** `.cursor/rules/architecture.md` (adapters), `.cursor/rules/financial-formulas.md` (defaults)

**Note:** When DTOs change, update `backend/src/swagger.yaml` schemas to match. DTOs define the API contract.

**Status:** ✅ Complete

---

## Phase 10: Backend – Controller and Routes

**Goal:** HTTP layer: receive POST, validate, call use case, return JSON.

**Tasks:**
- [x] Create `backend/src/adapters/controllers/calculation.controller.ts`
  - Class-based controller with constructor injection of CalculateComparisonUseCase
  - Method: `async calculate(req: Request, res: Response): Promise<void>`
  - Steps: 1) Validate req.body with Zod schema, 2) Call useCase.execute(validatedInput), 3) Return JSON response
  - Error handling: try-catch block, Zod errors → 400 with validation details, other errors → 500 with generic message
- [x] Create `backend/src/routes/calculation.routes.ts`
  - Express Router instance
  - POST `/calculate` → controller.calculate (note: no `/api` prefix in routes, added in index.ts)
  - Export router
- [x] Follow architecture pattern: controller only adapts HTTP ↔ domain, NO business logic

**Reference:** `.cursor/rules/architecture.md` (controllers section, data flow)

**Constraint:** Do NOT put business logic in the controller. Only: validate, call use case, format response.

**Important:** After adding or modifying endpoints, update `backend/src/swagger.yaml`:
- Add new paths for new endpoints
- Update request/response schemas for modified endpoints
- Keep HTTP methods, status codes, and error responses documented

**Status:** ✅ Complete

---

## Phase 11: Backend – Wire and CORS

**Goal:** Connect routes to Express and enable frontend access with dependency injection.

**Tasks:**
- [x] Install cors: `npm install cors` and `npm install --save-dev @types/cors`
- [x] In `backend/src/index.ts`:
  - Import and configure CORS middleware: `app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))`
  - Instantiate all services with proper dependency injection:
    - `opportunityCostService = new OpportunityCostService()`
    - `cashPurchaseService = new CashPurchaseService(opportunityCostService)`
    - `financedPurchaseService = new FinancedPurchaseService(opportunityCostService)`
    - `rentalService = new RentalService()`
    - `breakEvenService = new BreakEvenService(cashPurchaseService, financedPurchaseService, rentalService)`
    - `calculateComparisonUseCase = new CalculateComparisonUseCase(cashPurchaseService, financedPurchaseService, rentalService, breakEvenService)`
    - `calculationController = new CalculationController(calculateComparisonUseCase)`
  - Create routes with controller instance: `const calculationRoutes = createCalculationRoutes(calculationController)`
  - Mount routes: `app.use('/api', calculationRoutes)`
- [x] Update `backend/.env.example`: add PORT=3000, FRONTEND_URL=http://localhost:5173
- [x] Manual test with curl: `curl -X POST http://localhost:3000/api/calculate -H "Content-Type: application/json" -d '{"carValue":50000,"monthlyRent":2200,"interestRateMonth":0.015,"financingTermMonths":48,"analysisPeriodMonths":48}'`
- [x] Verify response has all fields: cashPurchase, financedPurchase, rental, breakEven with correct structure

**Reference:** `.cursor/rules/architecture.md` (Infrastructure section)

**Status:** ✅ Complete

---

## Phase 12: Frontend – Types, API Service and Formatters

**Goal:** Prepare frontend to talk to backend: types, fetch, currency/percentage formatting.

**Tasks:**
- [x] Create `frontend/src/types/calculation.types.ts` – mirror CalculationInput and CalculationResponse
- [x] Create `frontend/src/services/api.ts` – axios/fetch instance with baseURL from `VITE_API_URL` (default `http://localhost:3000`)
- [x] Create `frontend/src/services/calculation.service.ts` – `calculate(input): Promise<CalculationResponse>`
- [x] Create `frontend/src/utils/formatters.ts` – `formatCurrency(value)`, `formatPercent(value)`

**Reference:** README (API endpoints), backend types from Phase 2

**Status:** Complete

---

## Phase 13: Frontend – Atoms

**Goal:** Build basic UI atoms (Button, Input, Label, Card).

**Tasks:**
- [x] Create `frontend/src/components/atoms/Button/` (Button.tsx, styles, index)
- [x] Create `frontend/src/components/atoms/Input/` – controlled input, type="number" or "text"
- [x] Create `frontend/src/components/atoms/Label/` – label text
- [x] Create `frontend/src/components/atoms/Card/` – container
- [x] Use CSS Modules or plain CSS (per architecture)

**Reference:** `.cursor/rules/architecture.md` (atoms)

**Status:** Complete

---

## Phase 14: Frontend – InputField Molecule

**Goal:** Reusable form field (Label + Input + optional error).

**Tasks:**
- [x] Create `frontend/src/components/molecules/InputField/` – Label + Input + error message
- [x] Props: label, value, onChange, error?, type?, placeholder?, min?, max?

**Reference:** `.cursor/rules/architecture.md` (molecules)

**Status:** Complete

---

## Phase 15: Frontend – CalculatorForm Organism

**Goal:** Full form with all inputs and submit, state managed locally.

**Tasks:**
- [ ] Create `frontend/src/components/organisms/CalculatorForm/`
- [ ] Basic inputs state (always visible):
  - carValue (default: 50000)
  - monthlyRent (default: 2200)
  - interestRateMonth (default: 0.015 - display as 1.5% with proper formatting)
  - financingTermMonths (default: 48)
  - analysisPeriodMonths (default: 48)
- [ ] Optional collapsible "Opções Avançadas" section with:
  - downPaymentPercent (default: 0.25 - display as 25%)
  - maintenanceAnnual (default: 2000)
  - insuranceRateAnnual (default: 0.06 - display as 6%)
  - ipvaRate (default: 0.04 - display as 4%)
- [ ] Compose InputField molecules for each field, Button for submit
- [ ] Input type="number" with proper min/max/step attributes
- [ ] onSubmit handler: validate, call `calculationService.calculate(input)`, pass result to parent via callback
- [ ] Loading state: disable button and show "Calculando..." while waiting
- [ ] Error handling: display API errors in user-friendly format

**Reference:** `.cursor/rules/architecture.md` (organisms), financial-formulas.md (defaults)

**Status:** Not started

---

## Phase 16: Frontend – ComparisonResults Organism

**Goal:** Display comparison of cash vs financed vs rental with break-even analysis.

**Tasks:**
- [ ] Create `frontend/src/components/organisms/ComparisonResults/`
- [ ] Props: result (CalculationResponse | null), loading (boolean), error (string | null)
- [ ] Main display section (cards or table):
  - Cash Purchase: totalCost formatted as currency
  - Financed Purchase: totalCost, monthly installment (parcela), total interest paid
  - Rental: totalCost, monthly cost
- [ ] Break-even section (prominent display):
  - "Aluguel vs Compra à Vista: empata no mês X" (or "Nunca empata" if null)
  - "Aluguel vs Compra Financiada: empata no mês Y" (or "Nunca empata" if null)
  - Add tooltips explaining what break-even means
- [ ] Expandable breakdown sections for each scenario:
  - Cash: depreciação, IPVA, seguro, manutenção, custo de oportunidade
  - Financed: total parcelas, total juros, IPVA, seguro, manutenção, custo de oportunidade
  - Rental: just total (no breakdown)
- [ ] Use formatCurrency and formatPercent from utils/formatters.ts
- [ ] Show loading state and errors gracefully

**Reference:** domain/types/index.ts (CalculationResponse structure)

**Status:** Not started

---

## Phase 17: Frontend – Page and App Integration

**Goal:** Single page with form + results, wired into App.

**Tasks:**
- [ ] Create `frontend/src/components/pages/CalculatorPage/` or `templates/MainLayout/` + page
- [ ] State: result (CalculationResponse | null), loading, error
- [ ] Compose CalculatorForm + ComparisonResults
- [ ] Pass onCalculate callback from form to update result state
- [ ] In `App.tsx`: render CalculatorPage, basic layout (header optional)
- [ ] Verify: run front + back, fill form, submit, see results

**Status:** Not started

---

## Phase 18: Frontend – Styling and Polish

**Goal:** Interface bonita e fácil de usar (extra que conta ponto).

**Tasks:**
- [ ] Improve layout: spacing, typography, max-width container
- [ ] Responsive: mobile-friendly (stack inputs, readable on small screens)
- [ ] Loading/error states: clear feedback
- [ ] Optional: light/dark theme or consistent color palette
- [ ] Optional: tooltips for IPVA, custo de oportunidade, Sistema Price

**Status:** Not started

---

## Phase 19: Frontend – Cost-over-Time Chart

**Goal:** Visual comparison of costs over time (extra que conta ponto).

**Before starting:** This requires calling the backend multiple times with different analysisPeriodMonths values OR implementing a new endpoint that returns time-series data.

**Tasks:**
- [ ] Add Recharts dependency: `npm install recharts`
- [ ] Option A - Frontend calculates (simpler):
  - Make multiple API calls with analysisPeriodMonths from 1 to max
  - Cache original input, loop from 1 to analysisPeriodMonths calling API
  - Aggregate totalCost for each scenario at each month
- [ ] Option B - Backend endpoint (better):
  - Create new endpoint `/api/calculate-timeline` that returns array of costs per month
  - Returns: `{ month: number, cashCost: number, financedCost: number, rentalCost: number }[]`
- [ ] Create `frontend/src/components/organisms/CostComparisonChart/`
- [ ] Use Recharts LineChart component:
  - X-axis: months (1 to analysisPeriodMonths)
  - Y-axis: custo acumulado (formatted as currency)
  - Three lines: "À Vista" (cash), "Financiado" (financed), "Aluguel" (rental)
  - Different colors for each line, legend, tooltips with currency formatting
- [ ] Integrate into ComparisonResults component (below the summary cards)
- [ ] Add visual markers for break-even points if available

**Reference:** financial-formulas.md § 4 (break-even visualization), README

**Status:** Not started

---

## Phase 20: README and Run Locally

**Goal:** Anyone can run the project sem dor de cabeça.

**Tasks:**
- [ ] Update README.md with complete documentation:
  - Project overview and purpose
  - Tech stack (Node 22, Express 5, React 19, TypeScript, Vite 7)
  - Architecture overview (link to .cursor/rules/architecture.md)
  - Installation steps: `npm install` in both backend and frontend
  - Environment setup: copy .env.example to .env in both folders
  - Run instructions: `npm run dev` in backend (port 3000), `npm run dev` in frontend (port 5173)
  - API documentation: POST /api/calculate with example request/response
- [ ] Verify `backend/.env.example` has: PORT, FRONTEND_URL
- [ ] Create `frontend/.env.example` with: VITE_API_URL=http://localhost:3000
- [ ] Test clean run from scratch:
  1. Delete node_modules in both folders
  2. Run `npm install` in backend and frontend
  3. Copy .env.example files
  4. Start both servers
  5. Test form submission end-to-end
- [ ] Add "Decisões Técnicas" section to README:
  - Why Hexagonal Architecture (testability, separation of concerns)
  - Why Atomic Design (component reusability, scalability)
  - Financial formula decisions (exponential depreciation, compound interest)
  - What would be added with more time (database persistence, user accounts, additional scenarios)

**Status:** Not started

---

## Phase 21: Tests

**Goal:** Add tests after tudo funcionando (improves score).

**Tasks:**
- [ ] Backend: Set up Jest + TypeScript support
  - `npm install --save-dev jest @types/jest ts-jest`
  - Create jest.config.js with ts-jest preset
- [ ] Backend unit tests (create `backend/src/__tests__/` folder):
  - Test OpportunityCostService.calculate with known values
  - Test Sistema Price formula in FinancedPurchaseService (parcela calculation)
  - Test depreciation logic in CashPurchaseService
  - Mock dependencies where needed (jest.mock)
- [ ] Backend integration test:
  - Install Supertest: `npm install --save-dev supertest @types/supertest`
  - Test POST /api/calculate end-to-end with valid input → expect 200 and valid structure
  - Test POST /api/calculate with invalid input → expect 400 with Zod error
- [ ] Frontend (optional, bonus points):
  - Vitest already configured with Vite
  - Test formatters (formatCurrency, formatPercent)
  - Test InputField molecule rendering
- [ ] Update package.json scripts: `"test": "jest"` in backend, `"test": "vitest"` in frontend
- [ ] Ensure all tests pass: `npm test` in both folders

**Reference:** `.cursor/rules/architecture.md` (Testing Strategy)

**Status:** Not started

---

## Phase 22: Deploy (You Handle)

**Goal:** Deploy when everything is done so they can access easily.

**Tasks:**
- [ ] You: Deploy backend (Railway, Render, etc.) and frontend (Vercel, Netlify)
- [ ] Set env vars: VITE_API_URL, FRONTEND_URL for CORS
- [ ] Add live URL to README and submission
- [ ] Reference: README "Deployment" section

**Status:** Not started

---

## API Documentation Maintenance

**Swagger Spec Location:** `backend/src/swagger.yaml`

**When to update:**
- ✅ New endpoint added → Add path definition with parameters, request body, responses
- ✅ Endpoint modified → Update the path definition (changed parameters, request/response)
- ✅ Request/response DTO changed → Update corresponding schema in `components/schemas`
- ✅ New error responses → Add response codes and schemas
- ✅ Query/path parameters changed → Update parameter definitions

**When you don't need to update:**
- ❌ Internal refactoring (no API contract change)
- ❌ Frontend-only changes
- ❌ Bug fixes that don't change the API contract

**Access the docs:** Start backend and visit `http://localhost:3000/api-docs`

---

## Notes

- Mark phases complete with ✅ as you finish them
- Each phase = one focused prompt for AI
- Backend first (Phases 2–11), then frontend (12–19), then docs + tests + deploy (20–22)
- Before starting a phase, read its Reference docs
- Stick to the specified file paths; do not invent alternatives
- Feel free to add, remove, or reorganize phases as needed
- Keep this file updated to track your progress

---

## Architecture Compliance Checklist

Before completing each phase, verify:

**Backend Services (Phases 3-7):**
- ✓ Services are class-based with dependency injection via constructor
- ✓ Services receive full `CalculationInput` and extract needed fields
- ✓ Services are pure functions (no HTTP, no I/O, no side effects)
- ✓ Services use exponential depreciation with rates [0.20, 0.15, 0.15, 0.10, 0.10]
- ✓ IPVA and insurance calculated on depreciated value per year
- ✓ Opportunity cost on full car value (cash) or down payment only (financed)

**Backend Application Layer (Phase 8):**
- ✓ Use case orchestrates services via constructor-injected dependencies
- ✓ Use case has no business logic, only coordination
- ✓ Returns domain types directly (CalculationResponse)

**Backend Adapters (Phases 9-10):**
- ✓ Controller only adapts HTTP ↔ domain (validate, call use case, format)
- ✓ No business logic in controller
- ✓ Zod validation with proper defaults from financial-formulas.md
- ✓ Error handling: Zod → 400, others → 500

**Backend Infrastructure (Phase 11):**
- ✓ Dependency injection wiring in index.ts
- ✓ Services instantiated in correct order (dependencies first)
- ✓ CORS configured for frontend access

**Frontend Components (Phases 13-17):**
- ✓ Atomic Design: atoms → molecules → organisms → templates/pages
- ✓ Components follow single responsibility principle
- ✓ State management appropriate for component level
- ✓ Type safety with TypeScript throughout

**Overall:**
- ✓ Dependencies point inward (toward domain)
- ✓ Domain layer has zero external dependencies
- ✓ Type definitions match between frontend and backend
- ✓ All defaults match financial-formulas.md specifications
