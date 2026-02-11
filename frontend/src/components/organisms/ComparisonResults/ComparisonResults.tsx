import { useEffect, useState } from 'react';
import { Card, Icon } from '../../atoms';
import { CostComparisonChart } from '../CostComparisonChart';
import { calculationService } from '../../../services/calculation.service';
import { formatCurrency } from '../../../utils/formatters';
import type {
  CalculationInput,
  CalculationResponse,
  TimelineResponse,
} from '../../../types/calculation.types';
import styles from './ComparisonResults.module.css';

export interface ComparisonResultsProps {
  result: CalculationResponse | null;
  input: CalculationInput | null;
  loading: boolean;
  error: string | null;
}

const BREAK_EVEN_TOOLTIP =
  'Ponto de equilíbrio: o mês em que o custo acumulado do aluguel se iguala ao custo acumulado da compra. Antes desse mês, o aluguel é mais vantajoso; depois, a compra passa a ser.';

export function ComparisonResults({
  result,
  input,
  loading,
  error,
}: ComparisonResultsProps) {
  const [cashExpanded, setCashExpanded] = useState(false);
  const [financedExpanded, setFinancedExpanded] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(
    null
  );
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
        .catch((error) => {
          if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
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
      <div className={styles.container} role="alert">
        <div className={styles.error}>
          <Icon name="error" />
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.cardsGrid}>
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="large" className={styles.card}>
              <div className={styles.skeleton}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonValue} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Icon name="info" />
          Preencha o formulário acima para ver os resultados
        </div>
      </div>
    );
  }

  const { cashPurchase, financedPurchase, rental, breakEven } = result;

  return (
    <div className={styles.container} role="region" aria-label="Resultados da comparação">
      <div className={styles.cardsGrid}>
        <Card padding="large" className={styles.card}>
          <h3 className={styles.cardTitle}>Compra à Vista</h3>
          <p className={styles.totalCost}>{formatCurrency(cashPurchase.totalCost)}</p>
          <button
            type="button"
            className={styles.breakdownToggle}
            onClick={() => setCashExpanded((prev) => !prev)}
            aria-expanded={cashExpanded}
            aria-controls="cash-breakdown"
          >
            {cashExpanded ? '▼' : '▶'} Detalhar custos
          </button>
          {cashExpanded && (
            <div id="cash-breakdown" className={styles.breakdown} role="region">
              <div className={styles.breakdownRow}>
                <span>Depreciação</span>
                <span>{formatCurrency(cashPurchase.breakdown.depreciacao)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>IPVA</span>
                <span>{formatCurrency(cashPurchase.breakdown.ipva)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Seguro</span>
                <span>{formatCurrency(cashPurchase.breakdown.seguro)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Manutenção</span>
                <span>{formatCurrency(cashPurchase.breakdown.manutencao)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Custo de Oportunidade</span>
                <span>{formatCurrency(cashPurchase.breakdown.custoOportunidade)}</span>
              </div>
            </div>
          )}
        </Card>

        <Card padding="large" className={styles.card}>
          <h3 className={styles.cardTitle}>Compra Financiada</h3>
          <p className={styles.totalCost}>{formatCurrency(financedPurchase.totalCost)}</p>
          <p className={styles.secondaryInfo}>
            Parcela: {formatCurrency(financedPurchase.parcela)}/mês
          </p>
          <p className={styles.secondaryInfo}>
            Total em juros: {formatCurrency(financedPurchase.totalJuros)}
          </p>
          <button
            type="button"
            className={styles.breakdownToggle}
            onClick={() => setFinancedExpanded((prev) => !prev)}
            aria-expanded={financedExpanded}
            aria-controls="financed-breakdown"
          >
            {financedExpanded ? '▼' : '▶'} Detalhar custos
          </button>
          {financedExpanded && (
            <div id="financed-breakdown" className={styles.breakdown} role="region">
              <div className={styles.breakdownRow}>
                <span>Total Parcelas</span>
                <span>{formatCurrency(financedPurchase.breakdown.totalParcelas)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Total Juros</span>
                <span>{formatCurrency(financedPurchase.breakdown.totalJuros)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Depreciação</span>
                <span>{formatCurrency(financedPurchase.breakdown.depreciacao)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>IPVA</span>
                <span>{formatCurrency(financedPurchase.breakdown.ipva)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Seguro</span>
                <span>{formatCurrency(financedPurchase.breakdown.seguro)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Manutenção</span>
                <span>{formatCurrency(financedPurchase.breakdown.manutencao)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Custo de Oportunidade</span>
                <span>{formatCurrency(financedPurchase.breakdown.custoOportunidade)}</span>
              </div>
            </div>
          )}
        </Card>

        <Card padding="large" className={styles.card}>
          <h3 className={styles.cardTitle}>Aluguel</h3>
          <p className={styles.totalCost}>{formatCurrency(rental.totalCost)}</p>
          <p className={styles.secondaryInfo}>
            Custo mensal: {formatCurrency(rental.monthlyCost)}
          </p>
        </Card>
      </div>

      {timelineLoading && (
        <Card padding="large" className={styles.chartSkeleton}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonTitle} />
            <div className={styles.chartSkeletonPlaceholder} />
          </div>
        </Card>
      )}
      {timelineError && !timelineLoading && (
        <Card padding="large">
          <div className={styles.error}>
            <Icon name="error" />
            {timelineError}
          </div>
        </Card>
      )}
      {timelineData && !timelineLoading && (
        <CostComparisonChart
          data={timelineData.timeline}
          breakEvenCashMonths={breakEven.breakEvenCashMonths}
          breakEvenFinancedMonths={breakEven.breakEvenFinancedMonths}
        />
      )}

      <div className={styles.breakEvenSection}>
        <h3 className={styles.breakEvenTitle}>
          Ponto de Equilíbrio
          <span
            className={styles.tooltipIcon}
            title={BREAK_EVEN_TOOLTIP}
            aria-label={BREAK_EVEN_TOOLTIP}
          >
            ℹ
          </span>
        </h3>
        <div className={styles.breakEvenItems}>
          <p className={styles.breakEvenItem}>
            Aluguel vs Compra à Vista:{' '}
            {breakEven.breakEvenCashMonths !== null
              ? `empata no mês ${breakEven.breakEvenCashMonths}`
              : 'Nunca empata'}
          </p>
          <p className={styles.breakEvenItem}>
            Aluguel vs Compra Financiada:{' '}
            {breakEven.breakEvenFinancedMonths !== null
              ? `empata no mês ${breakEven.breakEvenFinancedMonths}`
              : 'Nunca empata'}
          </p>
        </div>
      </div>
    </div>
  );
}
