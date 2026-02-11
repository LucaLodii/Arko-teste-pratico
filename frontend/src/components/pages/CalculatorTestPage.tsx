import { useState } from 'react';
import { CalculatorForm } from '../organisms';
import { Card } from '../atoms';
import type { CalculationResponse } from '../../types/calculation.types';
import { formatCurrency } from '../../utils/formatters';

/**
 * Test page for CalculatorForm component
 * This can be used to verify Phase 15 implementation
 */
export function CalculatorTestPage() {
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (calculationResult: CalculationResponse) => {
    setResult(calculationResult);
    setError(null);
    console.log('Calculation result:', calculationResult);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error('Calculation error:', errorMessage);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Calculadora: Alugar ou Comprar Carro</h1>
      
      <Card>
        <CalculatorForm 
          onCalculate={handleCalculate} 
          onError={handleError}
        />
      </Card>

      {error && (
        <Card style={{ marginTop: '2rem', backgroundColor: '#fee2e2', border: '1px solid #ef4444' }}>
          <h2 style={{ color: '#991b1b' }}>Erro</h2>
          <p style={{ color: '#991b1b' }}>{error}</p>
        </Card>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Resultados</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <Card>
              <h3>Compra à Vista</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formatCurrency(result.cashPurchase.totalCost)}
              </p>
            </Card>

            <Card>
              <h3>Compra Financiada</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formatCurrency(result.financedPurchase.totalCost)}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Parcela: {formatCurrency(result.financedPurchase.parcela)}
              </p>
            </Card>

            <Card>
              <h3>Aluguel</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formatCurrency(result.rental.totalCost)}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Mensal: {formatCurrency(result.rental.monthlyCost)}
              </p>
            </Card>
          </div>

          <Card style={{ marginTop: '1rem' }}>
            <h3>Break-Even (Ponto de Equilíbrio)</h3>
            <p>
              <strong>Aluguel vs Compra à Vista:</strong>{' '}
              {result.breakEven.breakEvenCashMonths !== null
                ? `Empata no mês ${result.breakEven.breakEvenCashMonths}`
                : 'Nunca empata no período analisado'}
            </p>
            <p>
              <strong>Aluguel vs Compra Financiada:</strong>{' '}
              {result.breakEven.breakEvenFinancedMonths !== null
                ? `Empata no mês ${result.breakEven.breakEvenFinancedMonths}`
                : 'Nunca empata no período analisado'}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
