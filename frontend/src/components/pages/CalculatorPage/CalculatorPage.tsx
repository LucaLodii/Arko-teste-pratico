import { useState } from 'react';
import { Header, Footer, CalculatorForm, ComparisonResults, HowToUseCard, MethodologySection } from '../../organisms';
import { Card } from '../../atoms';
import type {
  CalculationInput,
  CalculationResponse,
} from '../../../types/calculation.types';

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
    <div className="flex min-h-screen flex-col bg-sage-50 font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] flex-grow space-y-12 px-4 py-8 md:px-8 md:py-12">
        <section className="animate-slide-down">
          <HowToUseCard defaultOpen={true} />
        </section>

        <section className="animate-slide-down">
          <Card
            padding="large"
            className="border-t-4 border-t-sage-400 bg-white/80 backdrop-blur-sm"
          >
            <CalculatorForm
              onCalculate={handleCalculate}
              onError={handleError}
              onLoadingChange={setLoading}
            />
          </Card>
        </section>

        <section id="results" className="scroll-mt-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-500 text-sm font-bold text-white shadow-sm">
              3
            </div>
            <h2 className="text-h2">Resultados Comparativos</h2>
          </div>

          <ComparisonResults
            result={result}
            input={input}
            loading={loading}
            error={error}
          />
        </section>
      </main>

      <MethodologySection />

      <Footer />
    </div>
  );
}
