# 🚗 Rent vs. Buy Car Calculator

A full-stack web application that compares the financial viability of **renting a car** (subscription services like Localiza) versus **buying a car** through cash or financed purchase.

This project demonstrates clean architecture, separation of concerns, and professional full-stack development practices with modern technologies.

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
- **Decoupled Design:** Frontend and backend are completely separate
- **RESTful API:** Clean API design with proper HTTP methods
- **Modular Code:** Calculation logic separated into services/utils for testability
- **Type Safety:** Full TypeScript coverage across the stack

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

# Install backend dependencies
cd ../backend
npm install
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
├── .node-version                  # Node.js version (22)
│
├── frontend/                      # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── services/             # API communication
│   │   ├── types/                # TypeScript interfaces
│   │   ├── utils/                # Helper functions
│   │   ├── App.tsx               # Main application component
│   │   └── main.tsx              # Application entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── backend/                       # Node.js + Express + TypeScript
    ├── src/
    │   ├── controllers/          # Request handlers
    │   ├── services/             # Business logic & calculations
    │   ├── validators/           # Input validation schemas
    │   ├── types/                # TypeScript interfaces
    │   ├── routes/               # API route definitions
    │   └── index.ts              # Server entry point
    ├── package.json
    └── tsconfig.json
```

---

## 🧮 Calculation Methodology

### Financial Calculations Include:

1. **Cash Purchase Total Cost:**
   - Initial vehicle price
   - Depreciation over time
   - Maintenance costs
   - Insurance and taxes (IPVA)
   - Opportunity cost (lost investment returns)

2. **Financed Purchase Total Cost:**
   - Down payment
   - Monthly installments with interest
   - Total interest paid
   - Depreciation, maintenance, insurance, taxes
   - Opportunity cost of down payment

3. **Rental Total Cost:**
   - Monthly rental fee × duration
   - Insurance (if not included)
   - No depreciation or opportunity cost concerns

4. **Break-Even Analysis:**
   - Point in time where ownership becomes cheaper than renting
   - Graphical representation of all three scenarios

---

## 💻 Development

### Available Scripts

**Frontend:**
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

**Backend:**
```bash
npm run dev       # Start development server (ts-node)
npm run build     # Compile TypeScript to JavaScript
npm start         # Run compiled production build
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

### Health Check
```
GET /api/health
Response: { "status": "ok" }
```

### Calculate Comparison (To Be Implemented)
```
POST /api/calculate
Body: {
  carValue: number,
  monthlyRent: number,
  interestRate: number,
  financingTerm: number,
  maintenanceCost: number,
  insurance: number,
  ipva: number,
  depreciationRate: number
}
Response: {
  cashPurchase: {...},
  financedPurchase: {...},
  rental: {...},
  breakEvenPoint: number
}
```

---

## 🎨 Design Decisions

### Why This Architecture?

1. **Decoupled Frontend/Backend:** 
   - Independent deployment and scaling
   - Clear separation of concerns
   - Easier to maintain and test

2. **TypeScript Throughout:**
   - Catches errors at compile time
   - Better IDE support and autocomplete
   - Self-documenting code with types

3. **Calculation Logic in Backend:**
   - Centralized business logic
   - Easier to test and validate
   - Consistent results across clients

4. **Vite Instead of Create React App:**
   - Faster development experience
   - Smaller bundle sizes
   - Better performance

5. **Input Validation with Zod/Joi:**
   - Type-safe validation
   - Clear error messages
   - Prevents invalid data processing

---

## 🚢 Deployment

### Recommended Platforms

**Frontend:**
- Vercel
- Netlify
- GitHub Pages

**Backend:**
- Railway
- Render
- Heroku

### Environment Variables

Create `.env` files for each environment:

**Backend `.env`:**
```
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

**Frontend `.env`:**
```
VITE_API_URL=https://your-backend-url.com
```
