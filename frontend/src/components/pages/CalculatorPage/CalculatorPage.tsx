import { useState } from 'react';
import { Header, Footer, Copyright, CalculatorForm, ComparisonResults, HowToUseCard, MethodologySection, HeroSection, AboutSection } from '../../organisms';
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
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header />

      {/* Container 1: Hero (100vh - Header) */}
      <div className="h-[calc(100vh-4rem)] w-full">
        <HeroSection />
      </div>

      {/* Container 2: Calculator & Results (Como usar -> Resultados) */}
      <div className="w-full bg-sage-50 py-12 md:py-16">
        <main className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <section className="animate-slide-down mb-12">
            <HowToUseCard defaultOpen={true} />
          </section>

          <section id="calculadora" className="scroll-mt-16 animate-slide-down mb-12">
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

          <section id="results" className="scroll-mt-16">
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
      </div>

      {/* Container 3: Methodology (Como calculamos) */}
      <div id="como-calculamos" className="scroll-mt-16 w-full">
        <MethodologySection />
      </div>

      {/* Container 4: About Project (Sobre o projeto) + Footer */}
      <div id="sobre" className="scroll-mt-16 w-full bg-sage-50 px-5 py-12 md:px-10 md:py-16 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-row items-stretch justify-between gap-12 lg:gap-16">
            <section className="w-1/2 shrink-0 min-w-0">
              <AboutSection />
            </section>
            <section className="flex w-1/2 shrink-0 min-w-[200px] flex-col justify-end">
              <Footer />
            </section>
          </div>
          <Copyright />
        </div>
      </div>
    </div>
  );
}
