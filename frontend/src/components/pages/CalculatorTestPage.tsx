import { useState } from 'react';
import { CalculatorForm, ComparisonResults } from '../organisms';
import { Card } from '../atoms';
import type { CalculationResponse } from '../../types/calculation.types';

/**
 * Test page for CalculatorForm and ComparisonResults components
 */
export function CalculatorTestPage() {
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = (calculationResult: CalculationResponse) => {
    setResult(calculationResult);
    setError(null);
    setLoading(false);
    console.log('Calculation result:', calculationResult);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
    console.error('Calculation error:', errorMessage);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Calculadora: Alugar ou Comprar Carro</h1>
      
      <Card>
        <CalculatorForm 
          onCalculate={handleCalculate} 
          onError={handleError}
          onLoadingChange={setLoading}
        />
      </Card>

      <div style={{ marginTop: '2rem' }}>
        <ComparisonResults result={result} loading={loading} error={error} />
      </div>
    </div>
  );
}
