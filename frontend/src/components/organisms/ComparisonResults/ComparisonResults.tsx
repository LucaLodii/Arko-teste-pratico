import { useEffect, useState } from 'react';
import { Card, Icon, Tooltip } from '../../atoms';
import { EmptyResultsState } from '../../molecules';
import { CostComparisonChart } from '../CostComparisonChart';
import { calculationService } from '../../../services/calculation.service';
import { formatCurrency } from '../../../utils/formatters';
import type {
  CalculationInput,
  CalculationResponse,
  TimelineResponse,
} from '../../../types/calculation.types';

export interface ComparisonResultsProps {
  result: CalculationResponse | null;
  input: CalculationInput | null;
  loading: boolean;
  error: string | null;
}

const BREAK_EVEN_TOOLTIP =
  'Ponto de equilíbrio: o mês em que o custo acumulado do aluguel se iguala ao custo acumulado da compra. Antes desse mês, o aluguel é mais vantajoso; depois, a compra passa a ser.';

const shimmerClass =
  'relative overflow-hidden bg-olive-100 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

function ResultsSkeleton() {
  return (
    <div className="space-y-12" data-testid="results-skeleton">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-64 rounded-2xl border border-white/20 shadow-sm ${shimmerClass}`}
          />
        ))}
      </div>
      <div className={`h-96 w-full rounded-2xl shadow-sm ${shimmerClass}`} />
      <div className={`h-40 w-full rounded-2xl bg-olive-900/10 shadow-sm ${shimmerClass}`} />
    </div>
  );
}

export function ComparisonResults({
  result,
  input,
  loading,
  error,
}: ComparisonResultsProps) {
  const [cashExpanded, setCashExpanded] = useState(false);
  const [financedExpanded, setFinancedExpanded] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  useEffect(() => {
    if (result && input) {
      const abortController = new AbortController();

      setTimelineLoading(true);
      setTimelineData(null);
      setTimelineError(null);
      calculationService
        .calculateTimeline(input, abortController.signal)
        .then((data) => {
          setTimelineData(data);
          setTimelineError(null);
        })
        .catch((err) => {
          if (err?.name !== 'AbortError' && err?.code !== 'ERR_CANCELED') {
            setTimelineData(null);
            setTimelineError('Não foi possível carregar o gráfico de evolução de custos.');
          }
        })
        .finally(() => setTimelineLoading(false));

      return () => abortController.abort();
    } else {
      setTimelineData(null);
      setTimelineError(null);
    }
  }, [result, input]);

  if (error) {
    return (
      <div
        className="animate-slide-down rounded-xl border border-status-error/20 bg-red-50 p-8 text-center text-status-error"
        role="alert"
      >
        <div className="mb-3 flex justify-center">
          <Icon name="error" size="lg" />
        </div>
        <p className="text-lg font-bold">Não foi possível calcular</p>
        <p className="mt-1 text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (loading) {
    return <ResultsSkeleton />;
  }

  if (!result) {
    return <EmptyResultsState />;
  }

  const { cashPurchase, financedPurchase, rental, breakEven } = result;

  const totals = [
    { id: 'cash', total: cashPurchase.totalCost },
    { id: 'financed', total: financedPurchase.totalCost },
    { id: 'rental', total: rental.totalCost },
  ];
  const bestOptionId = totals.reduce((prev, curr) =>
    prev.total < curr.total ? prev : curr
  ).id;

  return (
    <div
      className="animate-slide-down space-y-12"
      role="region"
      aria-label="Resultados da comparação"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          padding="large"
          highlight={bestOptionId === 'cash' ? 'success' : 'none'}
          className="flex h-full flex-col"
        >
          <div className="mb-4">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-olive-500">
              Compra à Vista
              {bestOptionId === 'cash' && (
                <Icon name="check" size="sm" className="text-sage-600" />
              )}
            </h3>
            <p className="text-3xl font-bold tracking-tight text-olive-900 font-mono">
              {formatCurrency(cashPurchase.totalCost)}
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-olive-50">
            <button
              type="button"
              onClick={() => setCashExpanded((prev) => !prev)}
              aria-expanded={cashExpanded}
              aria-controls="cash-breakdown"
              className="flex w-full min-h-[48px] items-center justify-between py-3 text-sm font-medium text-sage-600 transition-colors hover:text-sage-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-1 rounded"
            >
              {cashExpanded ? 'Ocultar detalhes' : 'Detalhar custos'}
              <span
                className={`transition-transform duration-300 ${cashExpanded ? 'rotate-180' : ''}`}
              >
                <Icon name="chevron-down" size="sm" />
              </span>
            </button>
            {cashExpanded && (
              <div
                id="cash-breakdown"
                className="mt-4 space-y-2 border-t border-olive-50 pt-4 text-sm text-olive-600"
                role="region"
              >
                <div className="flex justify-between">
                  <span>Depreciação</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(cashPurchase.breakdown.depreciacao)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IPVA</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(cashPurchase.breakdown.ipva)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Seguro</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(cashPurchase.breakdown.seguro)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Manutenção</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(cashPurchase.breakdown.manutencao)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Custo de Oportunidade</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(cashPurchase.breakdown.custoOportunidade)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          padding="large"
          highlight={bestOptionId === 'financed' ? 'success' : 'none'}
          className="flex h-full flex-col"
        >
          <div className="mb-4">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-olive-500">
              Compra Financiada
              {bestOptionId === 'financed' && (
                <Icon name="check" size="sm" className="text-sage-600" />
              )}
            </h3>
            <p className="text-3xl font-bold tracking-tight text-olive-900 font-mono">
              {formatCurrency(financedPurchase.totalCost)}
            </p>
            <p className="mt-1 text-sm text-olive-500">
              Parcela: <span className="font-medium">{formatCurrency(financedPurchase.parcela)}</span>/mês
            </p>
            <p className="mt-1 text-sm text-olive-500">
              Total em juros: <span className="font-medium">{formatCurrency(financedPurchase.totalJuros)}</span>
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-olive-50">
            <button
              type="button"
              onClick={() => setFinancedExpanded((prev) => !prev)}
              aria-expanded={financedExpanded}
              aria-controls="financed-breakdown"
              className="flex w-full min-h-[48px] items-center justify-between py-3 text-sm font-medium text-sage-600 transition-colors hover:text-sage-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-1 rounded"
            >
              {financedExpanded ? 'Ocultar detalhes' : 'Detalhar custos'}
              <span
                className={`transition-transform duration-300 ${financedExpanded ? 'rotate-180' : ''}`}
              >
                <Icon name="chevron-down" size="sm" />
              </span>
            </button>
            {financedExpanded && (
              <div
                id="financed-breakdown"
                className="mt-4 space-y-2 border-t border-olive-50 pt-4 text-sm text-olive-600"
                role="region"
              >
                <div className="flex justify-between">
                  <span>Total Parcelas</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(financedPurchase.breakdown.totalParcelas)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Juros</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(financedPurchase.breakdown.totalJuros)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Depreciação</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(financedPurchase.breakdown.depreciacao)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IPVA</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(financedPurchase.breakdown.ipva)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Seguro</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(financedPurchase.breakdown.seguro)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Manutenção</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(financedPurchase.breakdown.manutencao)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Custo de Oportunidade</span>
                  <span className="font-medium text-olive-800 font-mono">
                    {formatCurrency(financedPurchase.breakdown.custoOportunidade)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          padding="large"
          highlight={bestOptionId === 'rental' ? 'success' : 'none'}
          className="flex h-full flex-col"
        >
          <div>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-olive-500">
              Aluguel
              {bestOptionId === 'rental' && (
                <Icon name="check" size="sm" className="text-sage-600" />
              )}
            </h3>
            <p className="text-3xl font-bold tracking-tight text-olive-900 font-mono">
              {formatCurrency(rental.totalCost)}
            </p>
            <p className="mt-1 text-sm text-olive-500">
              Custo mensal: <span className="font-medium">{formatCurrency(rental.monthlyCost)}</span>
            </p>
          </div>
        </Card>
      </div>

      {timelineLoading && (
        <Card padding="large">
          <div className={`h-[300px] w-full rounded-lg ${shimmerClass}`} />
        </Card>
      )}
      {timelineError && !timelineLoading && (
        <Card padding="large">
          <div className="flex items-start gap-3 rounded-lg border border-status-error/20 bg-red-50 p-4 text-status-error">
            <Icon name="error" size="sm" className="shrink-0" />
            <span>{timelineError}</span>
          </div>
        </Card>
      )}
      {timelineData && !timelineLoading && (
        <div className="rounded-2xl bg-white p-6 shadow-soft md:p-8">
          <CostComparisonChart
            data={timelineData.timeline}
            breakEvenCashMonths={breakEven.breakEvenCashMonths}
            breakEvenFinancedMonths={breakEven.breakEvenFinancedMonths}
          />
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl bg-olive-900 p-6 text-white md:p-8">
        <div className="pointer-events-none absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-sage-500 opacity-20 blur-3xl" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="hidden rounded-lg bg-white/10 p-3 text-sage-300 sm:block">
            <Tooltip content={BREAK_EVEN_TOOLTIP} position="bottom">
              <Icon name="info" size="md" />
            </Tooltip>
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-sage-50">
              Ponto de Equilíbrio
              <span className="sm:hidden">
                <Tooltip content={BREAK_EVEN_TOOLTIP} position="bottom">
                  <Icon name="info" size="sm" />
                </Tooltip>
              </span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-olive-100">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-400" />
                <p>
                  Aluguel vs Compra à Vista:{' '}
                  <span className="font-bold text-white">
                    {breakEven.breakEvenCashMonths !== null
                      ? `Empata no mês ${breakEven.breakEvenCashMonths}`
                      : 'Nunca empata'}
                  </span>
                </p>
              </li>
              <li className="flex items-center gap-2 text-olive-100">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-400" />
                <p>
                  Aluguel vs Compra Financiada:{' '}
                  <span className="font-bold text-white">
                    {breakEven.breakEvenFinancedMonths !== null
                      ? `Empata no mês ${breakEven.breakEvenFinancedMonths}`
                      : 'Nunca empata'}
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
