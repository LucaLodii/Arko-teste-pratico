# Project Context: Rent vs. Buy Car Calculator

## What is this project?

This is a technical assessment project: a web application that compares the financial viability of **renting a car** (subscription services like Localiza) versus **buying a car** (cash or financed).

## Objective

Build a full-stack calculator with:

- **Frontend:** React + TypeScript (Vite), beautiful UI/UX
- **Backend:** Node.js + Express API, decoupled architecture
- **Features:** Cash purchase, financed purchase, rental cost comparison
- **Calculations:** Include opportunity cost, depreciation, maintenance, taxes (IPVA)

## Key Requirements

1. **Decoupled frontend/backend** (separate folders in this repo)
2. **Input validation** (suggest Zod/Joi on backend)
3. **Clean calculation logic** (separate utility/service layer for testability)
4. **Visual break-even point graph** (Chart.js/Recharts recommended)
5. **Professional code structure and documentation**

## Architecture

### Backend: Hexagonal Architecture (Ports and Adapters)

```
backend/src/
├── domain/           # Core business logic (entities, value objects)
├── application/      # Use cases and application services
│   └── services/     # Business logic services (calculations)
├── adapters/
│   ├── controllers/  # HTTP request handlers (input adapters)
│   ├── validators/   # Input validation (Zod/Joi)
│   └── repositories/ # Data access (if needed)
├── ports/            # Interfaces (contracts)
└── index.ts          # Infrastructure setup (Express, routes)
```

**Key principles:**
- Core business logic (calculations) is independent of Express
- Controllers adapt HTTP requests to domain operations
- Services contain pure calculation logic
- Easy to test, easy to change infrastructure

### Frontend: Atomic Design

```
frontend/src/
├── components/
│   ├── atoms/        # Basic building blocks (Button, Input, Label)
│   ├── molecules/    # Simple combinations (InputField, Card)
│   ├── organisms/    # Complex components (CalculatorForm, ResultsTable)
│   ├── templates/    # Page layouts
│   └── pages/        # Full pages with data
├── services/         # API communication
├── types/            # TypeScript interfaces
└── utils/            # Helper functions
```

**Key principles:**
- Build from small to large (atoms → molecules → organisms → pages)
- Reusable components with clear responsibilities
- Each component is focused and testable

### Ports

- **Backend:** Port 3000 (Express API)
- **Frontend:** Port 5173 (Vite dev server)

## Evaluation Criteria

Recruiters are assessing:

- **Project structure** and organization
- **Code quality** and best practices
- **Problem-solving logic** (especially financial calculations)
- **Documentation** clarity

## Important Implementation Notes

### Financial Calculations

- **Opportunity Cost:** Critical for "senior" awareness. If $50k goes into a car, calculate the lost investment returns.
- **Depreciation:** Cars lose value over time; factor this into ownership cost.
- **Break-even Point:** Show graphically where buying becomes cheaper than renting.

### Code Organization

- Keep calculation logic in separate services/utils (backend)
- Validate all numeric inputs server-side
- Use proper TypeScript types throughout
- Write clean, testable code

## References

- [README.md](../../README.md) - Complete project documentation and setup instructions
