# Phase 15 - CalculatorForm Testing Checklist

## Test Environment Setup ✅

- [x] Backend server running at http://localhost:3000
- [x] Frontend dev server running at http://localhost:5173
- [x] Backend API tested and working correctly

## Manual Testing Checklist

### 1. Initial Render ✓
Open http://localhost:5173 in your browser and verify:
- [ ] Form renders without errors
- [ ] All 5 basic input fields are visible with correct default values:
  - Valor do Carro: 50000
  - Aluguel Mensal: 2200
  - Taxa de Juros Mensal (%): 1.5
  - Prazo do Financiamento (meses): 48
  - Período de Análise (meses): 48
- [ ] "Opções Avançadas" toggle button is visible
- [ ] Submit button shows "Calcular Comparação"

### 2. Advanced Options Toggle ✓
- [ ] Click "▶ Opções Avançadas" button
- [ ] Section expands with smooth animation
- [ ] Four additional fields appear:
  - Entrada (%): 25
  - Manutenção Anual (R$): 2000
  - Taxa de Seguro Anual (%): 6
  - Taxa IPVA (%): 4
- [ ] Button changes to "▼ Opções Avançadas"
- [ ] Click again to collapse section

### 3. Form Validation - Empty/Invalid Values ✓
Test each field by clearing it or entering invalid values:
- [ ] Clear "Valor do Carro" → Error: "O valor do carro deve ser maior que zero"
- [ ] Enter 0 in "Aluguel Mensal" → Error: "O aluguel mensal deve ser maior que zero"
- [ ] Enter 0 or 150 in "Taxa de Juros Mensal" → Error shown
- [ ] Enter 0 or 150 in "Prazo do Financiamento" → Error: "O prazo deve estar entre 1 e 120 meses"
- [ ] Enter 0 or 150 in "Período de Análise" → Error: "O período deve estar entre 1 e 120 meses"
- [ ] Expand advanced, enter -10 in "Entrada (%)" → Error: "A entrada deve estar entre 0% e 100%"
- [ ] Enter 150 in "Taxa de Seguro Anual" → Error: "A taxa de seguro deve estar entre 0% e 100%"

### 4. Form Submission with Valid Data ✓
- [ ] Fill form with default values (or modify as needed)
- [ ] Click "Calcular Comparação"
- [ ] Button text changes to "Calculando..."
- [ ] Button becomes disabled during calculation
- [ ] All input fields become disabled during calculation
- [ ] Results appear below form after ~1-2 seconds

### 5. Results Display ✓
Verify the results section shows:
- [ ] Three cards with calculated totals:
  - Compra à Vista: R$ 83.009,67 (or similar)
  - Compra Financiada: R$ 121.082,42 with "Parcela: R$ 1.101,56"
  - Aluguel: R$ 105.600,00 with "Mensal: R$ 2.200,00"
- [ ] Break-even section shows:
  - "Aluguel vs Compra à Vista: Empata no mês 29" (or similar)
  - "Aluguel vs Compra Financiada: Nunca empata no período analisado" (or similar)

### 6. Error Handling - Network Error ✓
- [ ] Stop the backend server (Ctrl+C in backend terminal)
- [ ] Try to submit the form
- [ ] Error message appears: "Erro ao conectar com o servidor. Verifique sua conexão."
- [ ] Restart backend server: `cd backend && npm run dev`

### 7. Error Handling - Invalid API Response ✓
- [ ] Enter extremely large values (e.g., carValue: 999999999999)
- [ ] Submit form
- [ ] Verify error is handled gracefully (no crash)
- [ ] Error message appears at form level

### 8. Percentage Field Conversion ✓
Verify percentage fields are handled correctly:
- [ ] Enter 1.5 in "Taxa de Juros Mensal" field
- [ ] Submit form
- [ ] Check browser console Network tab → Request payload should show "interestRateMonth": 0.015 (divided by 100)
- [ ] Same for Entrada, Seguro, and IPVA fields

### 9. Loading State Interaction ✓
- [ ] Submit form
- [ ] While "Calculando..." is showing:
  - [ ] Try clicking submit button → should not submit again
  - [ ] Try changing input values → fields should be disabled
  - [ ] Try toggling advanced options → should still work

### 10. Responsive Design ✓
Test on different screen sizes:
- [ ] Desktop (1920x1080): Two-column grid layout for fields
- [ ] Tablet (768x1024): Two-column grid maintained
- [ ] Mobile (375x667): Single column layout, full-width button
- [ ] All fields remain usable and readable

### 11. Accessibility ✓
- [ ] Tab through all form fields → proper focus order
- [ ] Press Enter in last field → form submits
- [ ] Screen reader announces errors (check with browser dev tools)
- [ ] "Opções Avançadas" button has proper aria-expanded attribute
- [ ] Error messages have role="alert"

### 12. Multiple Calculations ✓
- [ ] Submit form with default values
- [ ] Results appear
- [ ] Modify some values (e.g., change car value to 80000)
- [ ] Submit again
- [ ] New results replace old results
- [ ] No duplicate results shown

## Expected Backend API Response

For default values, the API should return:
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
    "totalJuros": 15375.00,
    "breakdown": {
      "totalParcelas": 52875.00,
      "totalJuros": 15375.00,
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

## Testing Complete ✅

Once all items above are checked, Phase 15 implementation is verified and complete!

## Next Steps

Phase 16: Implement ComparisonResults organism component to display these results in a more sophisticated way.
