# 🚗 Car Calc

Aplicação web que compara a viabilidade financeira de **alugar**, **comprar à vista** ou **financiar** um carro.

## 🎯 Recursos

- Cálculo de depreciação, IPVA, seguro e manutenção
- Análise de custo de oportunidade
- Comparação de cenários com gráficos interativos
- Análise de ponto de equilíbrio

---

## 🛠 Stack

**Frontend:** React 19, TypeScript, Vite, Recharts  
**Backend:** Node.js 22, Express 5, TypeScript, Zod  
**Arquitetura:** Hexagonal (backend) + Atomic Design (frontend)

---

## 🚀 Executar Localmente

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev  # http://localhost:3000

# Frontend (novo terminal)
cd frontend
npm install
cp .env.example .env
npm run dev  # http://localhost:5173
```

---

## 📋 API

**POST** `/api/calculate`

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

Retorna comparação detalhada entre aluguel, compra à vista e financiamento.

## ⚙️ Variáveis de Ambiente

**Backend:** `FRONTEND_URL=https://your-frontend-url`  
**Frontend:** `VITE_API_URL=https://your-backend-url`