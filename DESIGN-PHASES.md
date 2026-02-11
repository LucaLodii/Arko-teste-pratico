# Design Implementation Phases

Track progress through each phase of migrating the frontend from CSS Modules to Tailwind CSS with the design system from `GEMINI_DESIGN_PROMPT_PT-BR.md`.

Requirements are documented in `GEMINI_DESIGN_PROMPT_PT-BR.md`, `GeminiResponse/` folder, and this file.

---

## Project Requirements Alignment

This design migration implements the **"Interface bonita / fácil de usar"** extra from the original project brief. The core product must remain intact:

**Original brief:** Create a site that compares if it's worth more to rent a car (Localiza-style) or buy it, with simulations for:
- Compra à vista (Cash purchase)
- Compra financiada (Financed purchase)

**Required form fields (must be preserved):**
- Valor do carro (car value)
- Valor do aluguel mensal (monthly rent)
- Taxa de juros (interest rate)
- Prazo do financiamento (financing term)
- Período de análise (analysis period)
- Opções avançadas: entrada, manutenção anual, seguro, IPVA

**Comparison output (must display all three):**
- Compra à Vista (total cost + breakdown)
- Compra Financiada (total cost, parcela, juros + breakdown)
- Aluguel (total cost, monthly cost)

**Tech stack (unchanged):** React + TypeScript (front), Node.js + Express (back), front and back separate.

**Validation:** After design migration, the app must still run locally without hassle (per README) and remain deployable. Do not alter calculation logic, API calls, or data flow.

---

## Context for AI

- One phase = one focused prompt. Do not merge phases.
- Always read referenced docs before implementing.
- Migration order: setup → atoms → molecules → organisms → pages.
- Fix import paths: organisms use `../../atoms`, molecules use `../../atoms`, atoms use relative paths within atoms.
- Preserve all existing logic and props; only replace CSS Modules with Tailwind classes.
- The `GeminiResponse/Molecules` file duplicates Atoms content; use the corrected InputField implementation (Label + Input + Tooltip + Icon).
- Replace `any` types with proper types from `frontend/src/types/calculation.types.ts`.
- Keep `GeminiResponse/` folder as reference; do not delete it until migration is complete.

---

## Implementation Summary (Phases 0–7)

**Design system flow:** Tailwind config → Atoms → Molecules → Organisms → Page

```
TailwindConfig (colors, shadows, animations)
      │
      ├──► Atoms (Icon, Spinner, Label, Tooltip, Input, Button, Card)
      │
      ├──► Molecules (InputField = Label + Input + Tooltip + Error)
      │         └── uses: Label, Input, Tooltip, Icon
      │
      ├──► Organisms
      │         ├── Header (uses Icon)
      │         ├── Footer (uses Icon)
      │         ├── CostComparisonChart (Recharts + scenario colors)
      │         ├── ComparisonResults (uses Card, CostComparisonChart)
      │         └── CalculatorForm (uses InputField, Button)
      │
      └──► CalculatorPage
                 └── composes: Header, CalculatorForm, ComparisonResults, Footer
```

**Color palette:** Soft Sage (#ACC8A2), Deep Olive (#1A2517), scenario colors (cash, financed, rental), semantic colors (success, error, warning, info).

**Reference:** `GeminiResponse/` folder contains all design implementations.

---

## Phase 0: Tailwind Setup

**Goal:** Install and configure Tailwind CSS with the custom design system.

**Tasks:**
- [ ] Install Tailwind: `npm install -D tailwindcss postcss autoprefixer` (in `frontend/`)
- [ ] Initialize config: `npx tailwindcss init -p`
- [ ] Replace `tailwind.config.js` with content from `GeminiResponse/TailwindConfig`
  - Include sage/olive color palette (50–900)
  - Include scenario colors (cash, financed, rental)
  - Include semantic colors (status.success, status.error, status.warning, status.info)
  - Include custom shadows (soft, glow) and animations (slide-down, shimmer)
- [ ] Update `frontend/src/index.css` with content from `GeminiResponse/GlobalCssAndTypografy`
  - Add `@tailwind base; @tailwind components; @tailwind utilities;`
  - Add typography utilities (.text-h1, .text-h2, .text-h3, .text-body, .text-small, .text-currency)
  - Add body styles (bg-sage-50, text-olive-900, antialiased)
- [ ] Add Tailwind content paths to `tailwind.config.js`: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- [ ] Verify: run `npm run dev` and confirm no build errors
- [ ] Verify: add a test class like `className="text-sage-400"` to any component and confirm it renders

**Reference:** `GeminiResponse/TailwindConfig`, `GeminiResponse/GlobalCssAndTypografy`

**Status:** Pending

---

## Phase 1: Fix GeminiResponse Issues

**Goal:** Address critical issues before migration so components work correctly.

**Tasks:**
- [ ] Create proper `InputField` molecule in `frontend/src/components/molecules/InputField/InputField.tsx`
  - Props: label, id, error (string | boolean), helperText?, tooltip?, fullWidth?, and all InputHTMLAttributes
  - Layout: Label row (with optional Tooltip icon) + Input + Error/Helper message
  - Imports: `Input`, `Label` from `../../atoms`; `Tooltip` from `../../atoms/Tooltip`; `Icon` from `../../atoms/Icon`
  - Use `aria-invalid`, `aria-describedby` for accessibility
- [ ] Update `frontend/src/components/atoms/index.ts` to export Icon and Tooltip
  - Add `export * from './Icon';` and `export * from './Tooltip';`
- [ ] Ensure `Tooltip.tsx` file exists (not `ToolTip.tsx`); rename if needed for case consistency
- [ ] Document import path rules: organisms at `organisms/X/` import from `../../atoms`; molecules at `molecules/X/` import from `../../atoms`

**Reference:** `GEMINI_DESIGN_PROMPT_PT-BR.md` (InputField molecule specification), corrected InputField implementation discussed in conversation

**Constraint:** Do not migrate any component yet; only fix the InputField and exports so subsequent phases can rely on them.

**Status:** Pending

---

## Phase 2: Atoms Migration

**Goal:** Replace all atom components with Tailwind-styled versions. Order matters (no dependencies first).

**Migration order:**
1. Icon (no dependencies)
2. Spinner (no dependencies)
3. Label (no dependencies)
4. Tooltip (depends on Icon)
5. Input (standalone)
6. Button (depends on Spinner)
7. Card (standalone)

**For each atom:**
- [ ] **Icon:** Replace `frontend/src/components/atoms/Icon/Icon.tsx` with `GeminiResponse/Icon`; fix imports; delete `Icon.module.css`
- [ ] **Spinner:** Replace `frontend/src/components/atoms/Spinner/Spinner.tsx` with `GeminiResponse/Atoms` Spinner section; delete `Spinner.module.css`
- [ ] **Label:** Replace `frontend/src/components/atoms/Label/Label.tsx` with `GeminiResponse/Atoms` Label section; delete `Label.module.css`
- [ ] **Tooltip:** Replace `frontend/src/components/atoms/Tooltip/Tooltip.tsx` with `GeminiResponse/ToolTip`; fix import of Icon; delete `Tooltip.module.css`
- [ ] **Input:** Replace `frontend/src/components/atoms/Input/Input.tsx` with `GeminiResponse/Atoms` Input section; delete `Input.module.css`
- [ ] **Button:** Replace `frontend/src/components/atoms/Button/Button.tsx` with `GeminiResponse/Atoms` Button section; fix Spinner import; delete `Button.module.css`
- [ ] **Card:** Replace `frontend/src/components/atoms/Card/Card.tsx` with `GeminiResponse/Atoms` Card section; delete `Card.module.css`

**Per-component checklist:**
- Replace `.tsx` content with GeminiResponse version
- Fix import paths to match `frontend/src/components/` structure
- Remove all `import styles from './X.module.css'` and `className={styles.xxx}`
- Delete the corresponding `.module.css` file
- Verify component renders (visual check in dev server)

**Reference:** `GeminiResponse/Atoms`, `GeminiResponse/Icon`, `GeminiResponse/ToolTip`

**Status:** Pending

---

## Phase 3: Molecules Migration

**Goal:** Replace InputField with Tailwind-styled version that composes atoms correctly.

**Tasks:**
- [ ] Replace `frontend/src/components/molecules/InputField/InputField.tsx` with the corrected InputField implementation (from Phase 1)
- [ ] Ensure imports: `Input`, `Label` from `../../atoms`; `Tooltip` from `../../atoms/Tooltip`; `Icon` from `../../atoms/Icon`
- [ ] Props must include: label, id, error?, helperText?, tooltip?, fullWidth?, and standard input props (value, onChange, name, type, placeholder, etc.)
- [ ] Delete `frontend/src/components/molecules/InputField/InputField.module.css`
- [ ] Update `frontend/src/components/molecules/index.ts` if needed
- [ ] Test: render InputField in CalculatorForm (or a test page) with tooltip, error, and helperText variants

**Reference:** Phase 1 InputField specification, `GEMINI_DESIGN_PROMPT_PT-BR.md` (InputField = Label + Input + Error + tooltip)

**Status:** Pending

---

## Phase 4: Organisms Migration

**Goal:** Replace all organism components with Tailwind-styled versions. Order matters due to dependencies.

**Migration order:**
1. Header (depends only on atoms)
2. Footer (depends only on atoms)
3. CostComparisonChart (Recharts styling, no dependencies on other organisms)
4. ComparisonResults (depends on Card, CostComparisonChart)
5. CalculatorForm (depends on InputField, Button)

**Tasks:**
- [ ] **Header:** Replace `frontend/src/components/organisms/Header/Header.tsx` with `GeminiResponse/Header`; fix Icon import path; delete `Header.module.css`
- [ ] **Footer:** Replace `frontend/src/components/organisms/Footer/Footer.tsx` with `GeminiResponse/Footer`; fix Icon import path; delete `Footer.module.css`
- [ ] **CostComparisonChart:** Replace `frontend/src/components/organisms/CostComparisonChart/CostComparisonChart.tsx` with `GeminiResponse/CostComparisonChart`; preserve props for `data` from API; delete `CostComparisonChart.module.css`
- [ ] **ComparisonResults:** Replace `frontend/src/components/organisms/ComparisonResults/ComparisonResults.tsx` with `GeminiResponse/ComparisonResults`; fix imports (Card, CostComparisonChart); replace mock types with `CalculationResponse`, `CalculationInput` from `frontend/src/types/calculation.types.ts`; delete `ComparisonResults.module.css`
- [ ] **CalculatorForm:** Replace `frontend/src/components/organisms/CalculatorForm/CalculatorForm.tsx` with `GeminiResponse/CalculatorForm`; fix imports (Button, InputField); replace mock types with `CalculationInput`, `CalculationResponse`; ensure form calls `calculationService.calculate` and `onCalculate`/`onError`/`onLoadingChange`; delete `CalculatorForm.module.css`
- [ ] **CalculatorForm validation:** Preserve all required fields: carValue, monthlyRent, interestRateMonth, financingTermMonths, analysisPeriodMonths; advanced: downPaymentPercent, maintenanceAnnual, insuranceRateAnnual, ipvaRate

**Per-organism checklist:**
- Replace `.tsx` content
- Fix import paths (organisms use `../../atoms`, `../../molecules`)
- Replace `any` with proper types from `calculation.types.ts`
- Preserve all callbacks and state logic
- Delete `.module.css` file
- Verify functionality (form submit, results display, chart render)

**Logic Preservation (CRITICAL):** GeminiResponse components are styling-only; they use mocks. Do NOT copy their logic. Merge styling with current implementation.

- **CalculatorForm:** Keep `calculationService.calculate(input)` and `onCalculate`/`onError`/`onLoadingChange`. Keep conversion to API format: `interestRateMonth / 100`, `downPaymentPercent / 100`, `insuranceRateAnnual / 100`, `ipvaRate / 100` (backend expects decimals 0–1). Keep validation and `initialValues` support. Keep `onError` optional.
- **ComparisonResults:** Keep `calculationService.calculateTimeline(input)` and `useEffect` for chart data. Keep `result` and `input` from props; use real data from `result.cashPurchase`, `result.financedPurchase`, `result.rental`, `result.breakEven` — do not use hardcoded scenario data in GeminiResponse.
- **CostComparisonChart:** Preserve `data` prop from timeline API; pass `timelineData` from ComparisonResults.

**Reference:** `GeminiResponse/Header`, `GeminiResponse/Footer`, `GeminiResponse/CostComparisonChart`, `GeminiResponse/ComparisonResults`, `GeminiResponse/CalculatorForm`

**Status:** Pending

---

## Phase 5: Page Integration

**Goal:** Update CalculatorPage to use migrated components and remove inline header/footer.

**Tasks:**
- [ ] Replace `frontend/src/components/pages/CalculatorPage/CalculatorPage.tsx` with layout from `GeminiResponse/CalculatorPage`
- [ ] Use separate Header and Footer organism components (import from `../../organisms/Header`, `../../organisms/Footer`)
- [ ] Do not use inline header/footer markup; use `<Header />` and `<Footer />`
- [ ] Preserve state: result, input, loading, error
- [ ] Preserve callbacks: handleCalculate, handleError, onLoadingChange
- [ ] Delete `frontend/src/components/pages/CalculatorPage/CalculatorPage.module.css`
- [ ] Update `frontend/src/App.tsx` if it imports App.css; remove or simplify to use Tailwind-only
- [ ] Verify: full page renders, form submits, results display, chart shows, Header/Footer render correctly

**Reference:** `GeminiResponse/CalculatorPage`, `GEMINI_DESIGN_PROMPT_PT-BR.md` (page structure)

**Status:** Pending

---

## Phase 6: Missing Features and Polish

**Goal:** Implement features that were specified in the prompt but not fully delivered in GeminiResponse.

**Tasks:**
- [ ] **Break-even markers in chart:** Add vertical dashed ReferenceLine components to CostComparisonChart at `breakEvenCashMonths` and `breakEvenFinancedMonths` (from `result.breakEven`); show label "Break-even: Mês X"
- [ ] **Shimmer on skeleton:** Update ResultsSkeleton in ComparisonResults to use `animate-shimmer` (from tailwind.config) instead of only `animate-pulse`; apply shimmer background gradient to skeleton blocks
- [ ] **Micro-interactions:** Verify 300ms transitions on expand/collapse (Opções Avançadas, card details); verify hover states on buttons and links
- [ ] **Focus rings:** Ensure all interactive elements have visible focus-visible rings (Tailwind `focus-visible:ring-2`)
- [ ] **Tooltip on break-even section:** Add Tooltip with info icon explaining "Ponto de equilíbrio" per prompt specification

**Reference:** `GEMINI_DESIGN_PROMPT_PT-BR.md` (Design do Gráfico, Seção de Ponto de Equilíbrio, Estados de Carregamento)

**Status:** Pending

---

## Phase 7: Quality Assurance

**Goal:** Ensure design migration meets acceptance criteria and accessibility standards.

**Tasks:**
- [ ] **Responsive testing:** Test at 320px (iPhone SE), 375px, 768px (tablet), 1024px+ (desktop); verify form, cards, chart, and layout adapt correctly
- [ ] **Touch targets:** Verify buttons and links have minimum 48px height on mobile
- [ ] **Accessibility:** Run contrast check (WCAG AA); verify keyboard navigation (Tab, Enter, Escape); verify focus states visible; verify ARIA labels preserved
- [ ] **Performance:** Check for layout shift when loading (skeleton should match final content size); verify no heavy animations that cause jank
- [ ] **Cleanup:** Delete all remaining `.module.css` files in `frontend/src/components/`
- [ ] **TypeScript:** Run `npm run build` and resolve any type errors
- [ ] **E2E flow:** Fill form, submit, verify results display; expand card details; verify chart and break-even section
- [ ] **Requirements verification:** Confirm all three scenarios display (Compra à Vista, Compra Financiada, Aluguel); confirm all form fields present and functional; confirm app runs locally per README

**Reference:** `GEMINI_DESIGN_PROMPT_PT-BR.md` (Checklist de Validação Final)

**Status:** Pending

---

## Notes

- Mark phases complete with ✅ as you finish them
- Each phase = one focused prompt for AI
- Do not skip Phase 0 (setup) or Phase 1 (fixes); they block everything else
- Before starting a phase, read its Reference docs
- Stick to the specified file paths; do not invent alternatives
- Keep `GeminiResponse/` folder as reference until migration is complete
- Feel free to add, remove, or reorganize phases as needed
- Keep this file updated to track your progress

---

## Architecture Compliance Checklist

Before completing each phase, verify:

**Tailwind Setup (Phase 0):**
- ✓ tailwind.config.js includes sage, olive, scenario, status colors
- ✓ Custom shadows and animations defined
- ✓ index.css has typography utilities and body styles
- ✓ Content paths include all src files

**Atoms (Phase 2):**
- ✓ All atoms use Tailwind classes only (no CSS Modules)
- ✓ Icon and Tooltip exported from atoms/index.ts
- ✓ Button uses Spinner for loading state
- ✓ Props and logic preserved from original components

**Molecules (Phase 3):**
- ✓ InputField composes Label + Input + optional Tooltip + Error/Helper
- ✓ Imports correct (../../atoms, ../../atoms/Tooltip, ../../atoms/Icon)
- ✓ Supports tooltip, error, helperText props

**Organisms (Phase 4):**
- ✓ Import paths use ../../atoms, ../../molecules
- ✓ Types from calculation.types.ts (no any)
- ✓ CalculatorForm calls calculationService and parent callbacks
- ✓ ComparisonResults receives real data from API

**Page (Phase 5):**
- ✓ CalculatorPage uses Header and Footer organisms
- ✓ State and callbacks preserved
- ✓ No inline header/footer markup

**Polish (Phase 6):**
- ✓ Break-even markers visible on chart when data present
- ✓ Skeleton uses shimmer animation
- ✓ Transitions and focus states work

**Quality (Phase 7):**
- ✓ Mobile responsive at 320px–1024px+
- ✓ Touch targets ≥ 48px
- ✓ No .module.css files remain
- ✓ Build passes, no console errors

**Overall:**
- ✓ Atomic Design hierarchy preserved
- ✓ All styling via Tailwind (no CSS Modules)
- ✓ Brazilian currency format (R$ 50.000,00)
- ✓ Sage/olive palette applied consistently

**Project Requirements (Original Brief):**
- ✓ Three scenarios displayed: Compra à Vista, Compra Financiada, Aluguel
- ✓ Form has all required fields: car value, monthly rent, interest rate, financing term, analysis period, advanced options
- ✓ Rent vs buy comparison functional (Localiza-style)
- ✓ App runs locally without hassle per README
- ✓ No calculation logic or API integration changed
