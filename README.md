# 🚗 Rent vs. Buy Car Calculator

A full-stack web application that compares the financial viability of **renting a car** (subscription services like Localiza) versus **buying a car** through cash or financed purchase.

This project demonstrates clean architecture, separation of concerns, and professional full-stack development practices with modern technologies.

---

## 🌐 Live Demo

> **Update these URLs after deploying** (see [DEPLOYMENT.md](DEPLOYMENT.md))

- **Application:** _https://your-app.vercel.app_ (replace after frontend deploy)
- **API Documentation:** _https://your-backend.railway.app/api-docs_ (replace after backend deploy)

Try the calculator directly in your browser once deployed!

---

## 🎯 Project Overview

### What It Does

This calculator helps users make informed financial decisions by comparing three scenarios:

1. **Long-term Car Rental:** Monthly subscription costs over time
2. **Cash Purchase:** Buying a vehicle outright with full payment
3. **Financed Purchase:** Buying through a loan with interest rates

### Key Features

- **Comprehensive Financial Analysis:**
  - Vehicle depreciation calculation
  - Opportunity cost of capital (investment returns lost)
  - IPVA/vehicle taxes, insurance, and maintenance costs
  - Interest rate calculations for financing
  - Break-even point analysis

- **Visual Comparison:**
  - Interactive charts showing cost comparison over time
  - Break-even point visualization
  - Clear, intuitive results display

- **Input Validation:**
  - Server-side validation using Zod/Joi
  - Type-safe API with TypeScript
  - Error handling and user feedback

---

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript 5** - Type safety and better developer experience
- **Vite 7** - Fast build tool and development server
- **Chart.js / Recharts** - Data visualization
- **ESLint** - Code quality and consistency

### Backend
- **Node.js 22 LTS** - JavaScript runtime
- **Express 5** - Web framework for APIs
- **TypeScript 5** - Type-safe backend code
- **Zod / Joi** - Input validation
- **ts-node** - TypeScript execution for development

### Architecture
- **Hexagonal Architecture (Backend):** Clean separation between domain, application, and adapters layers
- **Atomic Design (Frontend):** Component hierarchy from atoms to pages for maximum reusability
- **Decoupled Design:** Frontend and backend are completely separate
- **RESTful API:** Clean API design with proper HTTP methods
- **Type Safety:** Full TypeScript coverage across the stack

For detailed architecture documentation, see [.cursor/rules/architecture.md](.cursor/rules/architecture.md)

---

## 🚀 How to Run

### Prerequisites

- **Node.js v22 LTS** (recommended)
- **npm** (comes with Node.js)
- Optional: [fnm](https://github.com/Schniz/fnm) for Node version management

> The project includes a `.node-version` file that automatically switches to Node 22 if you use fnm.

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Arko-teste-pratico

# Install frontend dependencies
cd frontend
npm install
cp .env.example .env

# Install backend dependencies
cd ../backend
npm install
cp .env.example .env
```

### Running the Application

**1. Start the Backend Server:**

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3000`

**2. Start the Frontend (in a new terminal):**

```bash
cd frontend
npm run dev
```

The application will open at `http://localhost:5173`

### Port Configuration

| Service  | Port | URL |
|----------|------|-----|
| Backend API | 3000 | http://localhost:3000 |
| Frontend | 5173 | http://localhost:5173 |

---

## 📁 Project Structure

```
Arko-teste-pratico/
├── README.md                      # This file
├── PHASES.md                      # Development phases and progress
├── PROJECT.md                     # Project summary
├── .node-version                  # Node.js version (22)
│
├── frontend/                      # React 19 + TypeScript + Vite 7
│   ├── src/
│   │   ├── components/           # Atomic Design components
│   │   │   ├── atoms/           # Button, Input, Label, Card, Icon, Spinner, Tooltip
│   │   │   ├── molecules/       # InputField
│   │   │   ├── organisms/       # CalculatorForm, ComparisonResults, CostComparisonChart, Header
│   │   │   └── pages/           # CalculatorPage
│   │   ├── services/            # API communication (api.ts, calculation.service.ts)
│   │   ├── types/               # TypeScript interfaces (calculation.types.ts)
│   │   ├── utils/               # Helper functions (formatters.ts)
│   │   ├── App.tsx               # Main application component
│   │   └── main.tsx              # Application entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                       # Node.js 22 + Express 5 + TypeScript
│   ├── src/
│   │   ├── domain/               # Core business entities
│   │   │   └── types/           # CalculationInput, CalculationResponse, etc.
│   │   ├── application/          # Business logic layer
│   │   │   ├── services/        # OpportunityCost, CashPurchase, FinancedPurchase, Rental, BreakEven, Timeline
│   │   │   └── use-cases/       # CalculateComparisonUseCase, CalculateTimelineUseCase
│   │   ├── adapters/             # External interface layer
│   │   │   ├── controllers/     # HTTP request handlers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   └── validators/      # Input validation (Zod)
│   │   ├── routes/              # API route definitions
│   │   ├── swagger.yaml         # OpenAPI 3.0 specification
│   │   └── index.ts             # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── .cursor/rules/                 # AI context (architecture, formulas, standards)
```

---

## 🧮 Calculation Methodology

### Financial Calculations (Backend Services)

1. **Cash Purchase** (`CashPurchaseService`):
   - Total cost = Preço de Compra - Depreciação + IPVA + Seguro + Manutenção + Custo de Oportunidade
   - Exponential depreciation [20%, 15%, 15%, 10%, 10%] per year
   - IPVA and insurance on depreciated value per year
   - Opportunity cost on full car value (Selic 13.75% default)

2. **Financed Purchase** (`FinancedPurchaseService`):
   - Total cost = Entrada + Total Parcelas + IPVA + Seguro + Manutenção + Depreciação + Custo de Oportunidade
   - Sistema Price for monthly installments
   - Ownership costs same as cash (depreciation, IPVA, insurance, maintenance)
   - Opportunity cost on down payment only

3. **Rental** (`RentalService` – Phase 6):
   - Total cost = monthlyRent × analysisPeriodMonths
   - No depreciation or opportunity cost

4. **Break-Even** (`BreakEvenService` – Phase 7):
   - Month when rental cost equals cash purchase cost
   - Month when rental cost equals financed purchase cost

---

## 💻 Development

### Available Scripts

**Frontend:**
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm test          # Run unit tests (Vitest)
```

**Backend:**
```bash
npm run dev       # Start development server (ts-node)
npm run build     # Compile TypeScript to JavaScript
npm start         # Run compiled production build
npm test          # Run unit and integration tests (Jest)
npm run test:coverage   # Run tests with coverage report
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output will be in frontend/dist/
```

**Backend:**
```bash
cd backend
npm run build
# Output will be in backend/dist/
npm start         # Run the compiled server
```

---

## 📋 API Endpoints

> **Interactive API Documentation:** The backend includes Swagger UI for testing endpoints interactively. Start the backend server and visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Health Check
```
GET /api/health
Response: { "status": "ok" }
```

### Calculate Comparison

**Endpoint:** `POST /api/calculate`

**Example Request:**
```json
{
  "carValue": 50000,
  "monthlyRent": 2200,
  "interestRateMonth": 0.015,
  "financingTermMonths": 48,
  "analysisPeriodMonths": 48,
  "downPaymentPercent": 0.25,
  "maintenanceAnnual": 2000,
  "insuranceRateAnnual": 0.06,
  "ipvaRate": 0.04
}
```

**Example Response:**
```json
{
  "cashPurchase": {
    "totalCost": 83009.67,
    "breakdown": {
      "depreciacao": 23990,
      "ipva": 6116,
      "seguro": 9174,
      "manutencao": 8000,
      "custoOportunidade": 33709.67
    }
  },
  "financedPurchase": {
    "totalCost": 121082.42,
    "parcela": 1101.56,
    "totalJuros": 15375,
    "breakdown": {
      "totalParcelas": 52875,
      "totalJuros": 15375,
      "ipva": 6116,
      "seguro": 9174,
      "manutencao": 8000,
      "custoOportunidade": 8427.42
    }
  },
  "rental": {
    "totalCost": 105600,
    "monthlyCost": 2200
  },
  "breakEven": {
    "breakEvenCashMonths": 29,
    "breakEvenFinancedMonths": null
  }
}
```

**Schema Reference:**
- All monetary values are in BRL (R$)
- Interest rates are decimals (0.015 = 1.5%)
- Percentages are decimals (0.25 = 25%)
- Optional fields: `downPaymentPercent`, `maintenanceAnnual`, `insuranceRateAnnual`, `ipvaRate`, `depreciationRate`

---

## Decisões Técnicas

### Por que Arquitetura Hexagonal?

- **Testabilidade:** Lógica de negócio isolada da infraestrutura (Express, HTTP) permite testes unitários puras nos services
- **Separação de responsabilidades:** O domínio nunca depende de frameworks externos
- **Flexibilidade:** Fácil trocar adapters (ex: REST → GraphQL) sem alterar o core
- **Limites claros:** Services são funções puras, controllers apenas adaptam HTTP ↔ domínio

### Por que Atomic Design?

- **Reutilização de componentes:** Construção do pequeno (Button) ao grande (CalculatorPage)
- **Escalabilidade:** Fácil adicionar features compondo atoms e molecules existentes
- **Manutenibilidade:** Cada componente tem responsabilidade única
- **Consistência visual:** Atoms compartilhados garantem UI uniforme

### Decisões sobre Fórmulas Financeiras

- **Depreciação exponencial:** Mais realista que linear (carros perdem valor mais rápido no início)
- **Juros compostos para custo de oportunidade:** Reflete retornos reais de investimento ao longo do tempo
- **IPVA/Seguro sobre valor depreciado:** Cálculo preciso em relação ao mercado real
- **Sistema Price para financiamento:** Método de amortização padrão no Brasil

### O que seria adicionado com mais tempo

- **Persistência em banco de dados** (PostgreSQL/MongoDB) para salvar cálculos e histórico
- **Sistema de autenticação** com JWT para experiências personalizadas
- **Cenários adicionais:** Leasing, financiamento de seminovos, cálculo de valor de troca
- **Testes unitários e de integração** com Jest/Vitest (estrutura já planejada)
- **Integração com dados em tempo real:** API Tabela FIPE para valores de carros, API taxa Selic
- **Gráficos avançados:** Evolução mês a mês, análise de sensibilidade
- **Geração de relatório PDF** com resultados da comparação

---

## 🚢 Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step deployment instructions.

### Recommended Platforms

**Frontend:**
- **Vercel** (recommended) – Automatic deploys from Git, optimized for Vite/React
- Netlify
- GitHub Pages

**Backend:**
- **Railway** (recommended) – Easy setup, free tier, auto-deploys from Git
- Render
- Heroku

### Deployed Infrastructure

After deployment, your app will run on:

- **Frontend:** Vercel or Netlify (automatic deploys from main branch)
- **Backend:** Railway or Render (automatic deploys from main branch)
- **SSL:** Automatic HTTPS on both platforms
- **Monitoring:** Platform logs + optional Vercel Analytics

### Environment Variables

**Backend** (set in Railway/Render dashboard):
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Frontend** (set in Vercel/Netlify dashboard):
```
VITE_API_URL=https://your-backend-url.railway.app
```

For multiple environments (staging + production), use comma-separated origins:
```
FRONTEND_URL=https://staging.vercel.app,https://production.vercel.app
```

### Smoke Tests

After deploying, verify the deployment:

```bash
# Test local backend
cd backend && npm run smoke-test

# Test production (replace with your backend URL)
cd backend && npm run smoke-test:prod -- https://your-backend.railway.app
```
