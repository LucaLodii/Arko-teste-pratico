# Car Calc

> Simulador financeiro para comparação de cenários de aquisição de veículos: aluguel, compra à vista ou financiamento.

## Sobre o Projeto

**Car Calc** é um simulador financeiro que compara três cenários de aquisição e uso de veículos:

- **Aluguel mensal** (locadoras)
- **Compra à vista** com análise de custo de oportunidade
- **Financiamento** com simulação de parcelas e juros

O simulador considera depreciação do veículo, custo de oportunidade do capital investido, IPVA, seguro, manutenção e análise de ponto de equilíbrio entre os cenários.

## Funcionalidades

- Simulação de 3 cenários com cálculos financeiros detalhados
- Gráficos comparativos interativos
- Parâmetros personalizáveis (valor do carro, taxa de juros, prazo, entrada)
- Análise de custo de oportunidade baseada na taxa Selic
- Recálculo em tempo real
- Interface responsiva

## Stack Tecnológica

### Frontend
- React 19 com TypeScript
- Vite
- Recharts
- Tailwind CSS
- Arquitetura Atomic Design

### Backend
- Node.js 22 com TypeScript
- Express 5
- Zod para validação
- Arquitetura Hexagonal

### Deploy
- Frontend: Vercel
- Backend: Railway

## Pré-requisitos

- Node.js 22.x ou superior
- npm 10.x ou superior
- Git

## Instalação e Execução

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/Arko-teste-pratico.git
cd Arko-teste-pratico
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

O backend estará disponível em `http://localhost:3000`.

**Variáveis de ambiente (backend/.env):**

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

**Variáveis de ambiente (frontend/.env):**

```env
VITE_API_URL=http://localhost:3000
```

## Documentação da API

### `POST /api/calculate`

Calcula e compara os três cenários de aquisição/uso do veículo.

**Request:**

```json
{
  "carValue": 50000,
  "monthlyRent": 2200,
  "interestRateMonth": 0.015,
  "financingTermMonths": 48,
  "analysisPeriodMonths": 48,
  "downPaymentPercent": 0.25
}
```

**Validações:**
- `carValue`: valor positivo
- `monthlyRent`: valor positivo
- `interestRateMonth`: entre 0 e 1 (ex.: 0.015 = 1,5%)
- `financingTermMonths`: inteiro positivo
- `analysisPeriodMonths`: inteiro positivo
- `downPaymentPercent`: entre 0 e 1 (ex.: 0.25 = 25%)

**Response:**

```json
{
  "rental": {
    "totalCost": 105600,
    "monthlyCost": 2200
  },
  "cashPurchase": {
    "totalCost": 89500,
    "breakdown": {
      "depreciacao": 7500,
      "ipva": 8000,
      "seguro": 12000,
      "manutencao": 9600,
      "custoOportunidade": 17400
    }
  },
  "financedPurchase": {
    "totalCost": 95800,
    "parcela": 1995.83,
    "totalJuros": 12000,
    "breakdown": {
      "totalParcelas": 60000,
      "totalJuros": 12000,
      "depreciacao": 7500,
      "ipva": 8000,
      "seguro": 12000,
      "manutencao": 9600,
      "custoOportunidade": 4500
    }
  },
  "breakEven": {
    "breakEvenCashMonths": 34,
    "breakEvenFinancedMonths": 42
  }
}
```

## Arquitetura

### Backend - Arquitetura Hexagonal

```
backend/
├── src/
│   ├── domain/           # Lógica de negócio
│   ├── application/      # Casos de uso e serviços
│   ├── adapters/         # Controllers, DTOs, validadores
│   └── routes/           # Rotas HTTP
```

### Frontend - Atomic Design

```
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── pages/
│   ├── services/
│   ├── types/
│   └── utils/
```

## Metodologia de Cálculo

- **Depreciação**: exponencial por ano (taxas: 20%, 15%, 15%, 10%, 10%)
- **Custo de oportunidade**: 13.75% ao ano (Taxa Selic)
- **IPVA**: 4% ao ano do valor venal
- **Seguro**: 6% do valor do carro ao ano
- **Manutenção**: R$ 2.000/ano
- **Financiamento**: Sistema Price

## Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Deploy

### Aplicação em Produção

- Frontend: [https://arko-teste-pratico.vercel.app](https://arko-teste-pratico.vercel.app)
- Backend: [https://arko-calculator-backend-production.up.railway.app](https://arko-calculator-backend-production.up.railway.app)

### Configuração de Deploy

**Vercel (Frontend):**
1. Importe o repositório
2. Configure a pasta raiz como `frontend`
3. Adicione `VITE_API_URL` nas variáveis de ambiente

**Railway (Backend):**
1. Importe o repositório
2. Configure a pasta raiz como `backend`
3. Adicione `FRONTEND_URL` nas variáveis de ambiente