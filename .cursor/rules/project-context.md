# Project Context: Rent vs. Buy Car Calculator

## What is this project?

This is a technical assessment project: a web application that compares the financial viability of **renting a car** (subscription services like Localiza) versus **buying a car** (cash or financed).

---

## 🎯 Objective

Build a full-stack calculator with:

- **Frontend:** React + TypeScript (Vite), beautiful UI/UX
- **Backend:** Node.js + Express API, decoupled architecture
- **Features:** Cash purchase, financed purchase, rental cost comparison
- **Calculations:** Include opportunity cost, depreciation, maintenance, taxes (IPVA)

---

## 🛠 Tech Stack

### Frontend
- React 19 + TypeScript 5 + Vite 7
- Recharts (data visualization)
- CSS Modules (styling)
- Axios (API communication)

### Backend
- Node.js 22 LTS + Express 5 + TypeScript 5
- Zod (input validation)
- CORS (cross-origin requests)

---

## 📋 Key Requirements

1. **Decoupled frontend/backend** (separate folders in this repo)
2. **Input validation** (Zod on backend)
3. **Clean calculation logic** (separate service layer for testability)
4. **Visual break-even point graph** (Recharts)
5. **Professional code structure and documentation**

---

## 🏗 Architecture

See **[architecture.md](./architecture.md)** for detailed architecture guide.

**Quick Summary:**
- **Backend:** Hexagonal Architecture (Ports and Adapters)
  - Domain → Application → Adapters → Infrastructure
- **Frontend:** Atomic Design
  - Atoms → Molecules → Organisms → Templates → Pages

**Ports:**
- Backend API: Port 3000
- Frontend Dev Server: Port 5173

---

## 📊 Financial Calculations

See **[financial-formulas.md](./financial-formulas.md)** for detailed formulas.

**Key Concepts:**
- **Opportunity Cost:** Lost investment returns (Selic/CDI ~13.75% aa)
- **Depreciation:** Car value loss over time (~15-20% per year)
- **Break-even Point:** When buying becomes cheaper than renting
- **IPVA:** ~4% of car value annually
- **Insurance:** ~6% of car value annually

---

## 📝 Development Guidelines

### Code Standards
See **[coding-standards.md](./coding-standards.md)** for detailed standards.

**Quick Rules:**
- TypeScript strict mode ALWAYS
- No `any` (use `unknown` if needed)
- Functional components with hooks
- One component per file
- Services with pure functions

### Commit Rules
See **[commit-rules.md](./commit-rules.md)** for detailed commit guidelines.

**Quick Rules:**
- Use prefixes: `feat:`, `fix:`, `chore:`, etc.
- Portuguese only
- Max 2 lines
- No internal references (FASE 1, BUG 2, etc.)

---

## 🎓 Evaluation Criteria

Recruiters are assessing:

- ✅ **Project structure** and organization
- ✅ **Code quality** and best practices
- ✅ **Problem-solving logic** (especially financial calculations)
- ✅ **Documentation** clarity
- ✅ **TypeScript** usage
- ✅ **Testing** approach (if implemented)

---

## 🚀 Development Approach

### Phase Priorities (1 Week Timeline)

1. **Days 1-2:** Core backend (calculations + API)
2. **Days 3-4:** Frontend UI + integration
3. **Days 5-6:** Charts, polish, testing
4. **Day 7:** Documentation review, final touches

### Focus Areas

1. **Calculation Logic:** Most important - shows problem-solving
2. **Clean Architecture:** Shows senior-level thinking
3. **Code Quality:** TypeScript, validation, error handling
4. **UI/UX:** Professional look, clear results

---

## 📚 Quick References

- **Architecture Details:** [architecture.md](./architecture.md)
- **Coding Standards:** [coding-standards.md](./coding-standards.md)
- **Financial Formulas:** [financial-formulas.md](./financial-formulas.md)
- **Commit Rules:** [commit-rules.md](./commit-rules.md)
- **Project Documentation:** [README.md](../../README.md)
- **Progress Tracking:** [PHASES.md](../../PHASES.md)

---

## 💡 Important Notes

- **Architecture over speed:** Better a well-structured partial implementation than a messy complete one
- **Testable code:** Write code that can be tested (pure functions, dependency injection)
- **Documentation matters:** Clear README and code comments show professionalism
- **TypeScript is your friend:** Use types to catch errors early
- **Financial accuracy:** Double-check calculation formulas

---

## 🎯 Success Criteria

Project is successful when:

- [ ] Backend has clean hexagonal architecture
- [ ] Frontend follows atomic design
- [ ] Financial calculations are accurate and documented
- [ ] API has proper validation and error handling
- [ ] UI is clean and intuitive
- [ ] Results are clearly visualized (chart + table)
- [ ] Code is well-documented
- [ ] README is comprehensive

---

*This is the main context file. Refer to linked documents for detailed guidelines.*
