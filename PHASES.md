# Development Phases

Track progress through each development phase of the Rent vs. Buy Car Calculator project.

Requirements are documented in README, cursor rules (`.cursor/rules/`), and this file.

---

## Context for AI

- One phase = one focused prompt. Do not merge phases.
- Always read referenced docs before implementing.
- Types/domain first (Phase 2), then services, then adapters.
- Keep services pure (no HTTP, no side effects).

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
- [ ] Create `backend/src/domain/types/index.ts`
- [ ] Define `CalculationInput`: carValue, monthlyRent, interestRateMonth, financingTermMonths, analysisPeriodMonths, downPaymentPercent (optional, default 25), maintenanceAnnual (optional), insuranceRateAnnual (optional), ipvaRate (optional), depreciationRate (optional)
- [ ] Define `CashPurchaseResult` (totalCost, breakdown)
- [ ] Define `FinancedPurchaseResult` (totalCost, parcela, totalJuros, breakdown)
- [ ] Define `RentalResult` (totalCost, monthlyCost)
- [ ] Define `BreakEvenResult` with `breakEvenCashMonths: number | null` and `breakEvenFinancedMonths: number | null` (only this type has these fields)
- [ ] Define `CalculationResponse`: cashPurchase, financedPurchase, rental, breakEven (BreakEvenResult)

**Reference:** `.cursor/rules/architecture.md` (domain layer), `.cursor/rules/financial-formulas.md` (field names)

**Constraint:** Do NOT implement any calculation logic or functions. Only types/interfaces.

**Status:** Not started

---

## Phase 3: Backend – Opportunity Cost Service

**Goal:** Implement custo de oportunidade as a reusable pure service.

**Tasks:**
- [ ] Create `backend/src/application/services/opportunity-cost.service.ts`
- [ ] Implement `calculate(capital, years, taxaAnual)`: return number (juros compostos)
- [ ] Use Selic default 0.1375 when taxaAnual not provided
- [ ] Formula: montanteFinal = capital * (1 + taxaAnual)^years; return montanteFinal - capital

**Reference:** `.cursor/rules/financial-formulas.md` § 1.2 (Custo de Oportunidade)

**Constraint:** Service must be pure (no HTTP, no I/O).

**Status:** Not started

---

## Phase 4: Backend – Cash Purchase Service

**Goal:** Implement cash purchase cost calculation in a pure service.

**Before starting:** Read `.cursor/rules/financial-formulas.md` § 1 (Compra à Vista).

**Tasks:**
- [ ] Create `backend/src/application/services/cash-purchase.service.ts`
- [ ] Depreciação exponencial. Usar taxas por ano do § 1.1: array `[0.20, 0.15, 0.15, 0.10, 0.10]`. IPVA e seguro sobre valor depreciado por ano.
- [ ] Implement IPVA (valor depreciado por ano × aliquota)
- [ ] Implement seguro (valor depreciado × taxa)
- [ ] Implement manutenção (fixo anual × anos)
- [ ] Use OpportunityCostService for custo de oportunidade
- [ ] Custo total = valorCarro - valorResidual + ipva + seguro + manutencao + custoOportunidade
- [ ] Return `CashPurchaseResult` with totalCost and breakdown: `{ depreciacao, ipva, seguro, manutencao, custoOportunidade }` (all numbers)

**Reference:** `.cursor/rules/financial-formulas.md` § 1 (Compra à Vista)

**Constraint:** Service must be pure (no HTTP, no side effects).

**Status:** Not started

---

## Phase 5: Backend – Financed Purchase Service

**Goal:** Implement financed purchase cost calculation (Sistema Price).

**Before starting:** Read `.cursor/rules/financial-formulas.md` § 2 (Compra Financiada).

**Tasks:**
- [ ] Create `backend/src/application/services/financed-purchase.service.ts`
- [ ] Calcular entrada = carValue × downPaymentPercent
- [ ] Calcular valorFinanciado = carValue - entrada
- [ ] Implementar `calcularParcelaPrice(valorFinanciado, taxaMensal, parcelas)` (fórmula Price)
- [ ] Total parcelas = parcela × financingTermMonths
- [ ] Total juros = totalParcelas - valorFinanciado
- [ ] Somar custos de propriedade (IPVA, seguro, manutenção) – reutilizar lógica do cash ou duplicar
- [ ] Use OpportunityCostService for custo de oportunidade da entrada
- [ ] Return `FinancedPurchaseResult` (totalCost, parcela, totalJuros, breakdown)
- [ ] breakdown: `{ totalParcelas, totalJuros, ipva, seguro, manutencao, custoOportunidade }` (all numbers)

**Reference:** `.cursor/rules/financial-formulas.md` § 2 (Compra Financiada)

**Constraint:** Service must be pure (no HTTP, no side effects).

**Status:** Not started

---

## Phase 6: Backend – Rental Service

**Goal:** Implement rental cost calculation.

**Tasks:**
- [ ] Create `backend/src/application/services/rental.service.ts`
- [ ] custoTotal = monthlyRent × analysisPeriodMonths
- [ ] Return `RentalResult` (totalCost, monthlyCost)

**Reference:** `.cursor/rules/financial-formulas.md` § 3 (Aluguel)

**Status:** Not started

---

## Phase 7: Backend – Break-Even Service

**Goal:** Calculate when rental cost equals purchase cost (cash and financed separately). Return both.

**Before starting:** Read `.cursor/rules/financial-formulas.md` § 4 and § 1–3 for cost structure.

**Tasks:**
- [ ] Create `backend/src/application/services/break-even.service.ts`
- [ ] BreakEvenService receives CashPurchaseService, FinancedPurchaseService, RentalService, and input (constructor injection)
- [ ] Signature: `calculate(input, cashService, financedService, rentalService): BreakEvenResult`
- [ ] Para cada mês N de 1 até analysisPeriodMonths: chamar cashService, financedService e rentalService com `{ ...input, analysisPeriodMonths: N }` para obter custo acumulado nesse mês
- [ ] Comparar rental vs cash: primeiro mês em que rentalCostAtN >= cashCostAtN → breakEvenCashMonths
- [ ] Comparar rental vs financed: primeiro mês em que rentalCostAtN >= financedCostAtN → breakEvenFinancedMonths
- [ ] Retornar null se nunca atingir equilíbrio
- [ ] Return `BreakEvenResult` with both values

**Reference:** `.cursor/rules/financial-formulas.md` § 4 (Break-Even Point)

**Status:** Not started

---

## Phase 8: Backend – Calculate Comparison Use Case

**Goal:** Orchestrate all services and return unified result.

**Tasks:**
- [ ] Create `backend/src/application/use-cases/calculate-comparison.use-case.ts`
- [ ] Constructor: inject CashPurchaseService, FinancedPurchaseService, RentalService, BreakEvenService
- [ ] execute(input: CalculationInput): CalculationResponse
- [ ] Call cashService, financedService, rentalService with input
- [ ] Pass cashService, financedService, rentalService, and input to breakEvenService.calculate()
- [ ] Aggregate results, return CalculationResponse

**Reference:** `.cursor/rules/architecture.md` (application layer, use case example)

**Status:** Not started

---

## Phase 9: Backend – DTOs and Validation

**Goal:** Define request/response DTOs and validate input with Zod.

**Tasks:**
- [ ] Create `backend/src/adapters/dto/calculation-request.dto.ts` (align with CalculationInput)
- [ ] Create `backend/src/adapters/dto/calculation-response.dto.ts` (align with CalculationResponse)
- [ ] Create `backend/src/adapters/validators/calculation-input.validator.ts` – Zod schema with explicit defaults:
  - `maintenanceAnnual`: 2000
  - `insuranceRateAnnual`: 0.06
  - `ipvaRate`: 0.04
  - `depreciationRate`: array `[0.20, 0.15, 0.15, 0.10, 0.10]` from financial-formulas § 1.1 (when not provided)
- [ ] Export parsed/safe type from validator

**Reference:** `.cursor/rules/architecture.md` (adapters)

**Status:** Not started

---

## Phase 10: Backend – Controller and Routes

**Goal:** HTTP layer: receive POST, validate, call use case, return JSON.

**Tasks:**
- [ ] Create `backend/src/adapters/controllers/calculation.controller.ts` – POST handler: validate body with Zod, call use case, return DTO
- [ ] Create `backend/src/routes/calculation.routes.ts` – POST `/api/calculate` → controller
- [ ] Error handling: Zod errors → 400 with message, other errors → 500

**Reference:** `.cursor/rules/architecture.md` (controllers)

**Constraint:** Do NOT put business logic in the controller. Only: validate, call use case, format response.

**Status:** Not started

---

## Phase 11: Backend – Wire and CORS

**Goal:** Connect routes to Express and enable frontend access.

**Tasks:**
- [ ] In `backend/src/index.ts`: import calculation routes, `app.use('/api', calculationRoutes)`
- [ ] Add CORS middleware: allow origin from env (e.g. `http://localhost:5173`) or `*` for dev
- [ ] Update `backend/.env.example`: PORT, FRONTEND_URL (for CORS)
- [ ] Manually test: `curl -X POST http://localhost:3000/api/calculate -H "Content-Type: application/json" -d '{"carValue":50000,"monthlyRent":2200,"interestRateMonth":0.015,"financingTermMonths":48,"analysisPeriodMonths":48}'`

**Status:** Not started

---

## Phase 12: Frontend – Types, API Service and Formatters

**Goal:** Prepare frontend to talk to backend: types, fetch, currency/percentage formatting.

**Tasks:**
- [ ] Create `frontend/src/types/calculation.types.ts` – mirror CalculationInput and CalculationResponse
- [ ] Create `frontend/src/services/api.ts` – axios/fetch instance with baseURL from `VITE_API_URL` (default `http://localhost:3000`)
- [ ] Create `frontend/src/services/calculation.service.ts` – `calculate(input): Promise<CalculationResponse>`
- [ ] Create `frontend/src/utils/formatters.ts` – `formatCurrency(value)`, `formatPercent(value)`

**Reference:** README (API endpoints), backend types from Phase 2

**Status:** Not started

---

## Phase 13: Frontend – Atoms

**Goal:** Build basic UI atoms (Button, Input, Label, Card).

**Tasks:**
- [ ] Create `frontend/src/components/atoms/Button/` (Button.tsx, styles, index)
- [ ] Create `frontend/src/components/atoms/Input/` – controlled input, type="number" or "text"
- [ ] Create `frontend/src/components/atoms/Label/` – label text
- [ ] Create `frontend/src/components/atoms/Card/` – container
- [ ] Use CSS Modules or plain CSS (per architecture)

**Reference:** `.cursor/rules/architecture.md` (atoms)

**Status:** Not started

---

## Phase 14: Frontend – InputField Molecule

**Goal:** Reusable form field (Label + Input + optional error).

**Tasks:**
- [ ] Create `frontend/src/components/molecules/InputField/` – Label + Input + error message
- [ ] Props: label, value, onChange, error?, type?, placeholder?, min?, max?

**Reference:** `.cursor/rules/architecture.md` (molecules)

**Status:** Not started

---

## Phase 15: Frontend – CalculatorForm Organism

**Goal:** Full form with all inputs and submit, state managed locally.

**Tasks:**
- [ ] Create `frontend/src/components/organisms/CalculatorForm/`
- [ ] State for: carValue, monthlyRent, interestRateMonth, financingTermMonths, analysisPeriodMonths (use sensible defaults from financial-formulas: 50000, 2200, 0.015, 48, 48)
- [ ] Optional collapsible "Avançado": downPaymentPercent, maintenanceAnnual, insuranceRate, ipvaRate (defaults: 25, 2000, 0.06, 0.04)
- [ ] Compose InputField molecules, Button
- [ ] onSubmit: call `calculationService.calculate`, pass result to parent via callback or lift state
- [ ] Handle loading (disable button, "Calculando...") and API errors (show message)

**Reference:** `.cursor/rules/architecture.md` (CalculatorForm organism)

**Status:** Not started

---

## Phase 16: Frontend – ComparisonResults Organism

**Goal:** Display comparison of cash vs financed vs rental. Show both break-even values.

**Tasks:**
- [ ] Create `frontend/src/components/organisms/ComparisonResults/`
- [ ] Props: result (CalculationResponse) | null
- [ ] Show totalCost for each scenario (cards or table)
- [ ] Show both break-even values: "À vista: mês X | Financiado: mês Y" (or "N/A" when null)
- [ ] Show optional breakdown (depreciação, juros, etc.) in expandable section or tooltips
- [ ] Use formatters for currency

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

**Tasks:**
- [ ] Add Recharts to frontend dependencies
- [ ] Create `frontend/src/components/organisms/CostComparisonChart/` – line chart
- [ ] X-axis: months (1 to analysisPeriodMonths), Y-axis: custo acumulado
- [ ] Three lines: compra à vista, compra financiada, aluguel
- [ ] Integrate into ComparisonResults or CalculatorPage
- [ ] For financed: custo acumulado = entrada + parcelas até mês N + custos até mês N

**Reference:** financial-formulas.md (break-even visualization), README

**Status:** Not started

---

## Phase 20: README and Run Locally

**Goal:** Anyone can run the project sem dor de cabeça.

**Tasks:**
- [ ] Update README if needed: install steps, run backend + frontend, env vars
- [ ] Ensure `backend/.env.example` and `frontend/.env.example` list required vars
- [ ] Test clean run: clone → install (front + back) → `npm run dev` both → use app
- [ ] Add "Decisões técnicas" section to README (ou DECISIONS.md): stack, architecture, fórmulas, o que faria com mais tempo

**Status:** Not started

---

## Phase 21: Tests

**Goal:** Add tests after tudo funcionando.

**Tasks:**
- [ ] Backend: Jest + unit test for at least one service (e.g. Price formula in FinancedPurchaseService)
- [ ] Backend: Integration test for POST /api/calculate (Supertest)
- [ ] Frontend (optional): Vitest + test for one component (e.g. formatters or Results display)
- [ ] Ensure `npm test` runs in backend (and frontend if added)

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

## Notes

- Mark phases complete with ✅ as you finish them
- Each phase = one focused prompt for AI
- Backend first (Phases 2–11), then frontend (12–19), then docs + tests + deploy (20–22)
- Before starting a phase, read its Reference docs
- Stick to the specified file paths; do not invent alternatives
- Feel free to add, remove, or reorganize phases as needed
- Keep this file updated to track your progress
