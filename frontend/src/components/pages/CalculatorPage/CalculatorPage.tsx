import { useState } from 'react';
import { Header, CalculatorForm, ComparisonResults } from '../../organisms';
import { Card } from '../../atoms';
import type {
  CalculationInput,
  CalculationResponse,
} from '../../../types/calculation.types';
import styles from './CalculatorPage.module.css';

/**
 * Main calculator page: form + results integration
 */
export function CalculatorPage() {
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [input, setInput] = useState<CalculationInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = (
    calculationResult: CalculationResponse,
    calculationInput: CalculationInput
  ) => {
    setResult(calculationResult);
    setInput(calculationInput);
    setError(null);
    setLoading(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.formSection}>
        <Card>
          <CalculatorForm
            onCalculate={handleCalculate}
            onError={handleError}
            onLoadingChange={setLoading}
          />
        </Card>
      </section>

      <section className={styles.resultsSection}>
        <ComparisonResults
          result={result}
          input={input}
          loading={loading}
          error={error}
        />
      </section>
    </div>
  );
}
