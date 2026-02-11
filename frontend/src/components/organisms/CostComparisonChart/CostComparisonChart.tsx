import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import type { TimelineDataPoint } from '../../../types/calculation.types';
import styles from './CostComparisonChart.module.css';

export interface CostComparisonChartProps {
  data: TimelineDataPoint[];
  breakEvenCashMonths: number | null;
  breakEvenFinancedMonths: number | null;
}

export function CostComparisonChart({
  data,
  breakEvenCashMonths,
  breakEvenFinancedMonths,
}: CostComparisonChartProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; payload: TimelineDataPoint }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{`Mês ${payload[0].payload.month}`}</p>
          {payload.map((entry) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Evolução dos Custos</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="month"
            label={{ value: 'Mês', position: 'insideBottom', offset: -5 }}
            stroke="var(--color-text-secondary)"
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value, 0)}
            label={{
              value: 'Custo Acumulado',
              angle: -90,
              position: 'insideLeft',
            }}
            stroke="var(--color-text-secondary)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {breakEvenCashMonths !== null && (
            <ReferenceLine
              x={breakEvenCashMonths}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: 'Empate à Vista', position: 'top' }}
            />
          )}
          {breakEvenFinancedMonths !== null && (
            <ReferenceLine
              x={breakEvenFinancedMonths}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{ value: 'Empate Financiado', position: 'top' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="cashCost"
            stroke="#10b981"
            strokeWidth={2}
            name="À Vista"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="financedCost"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Financiado"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="rentalCost"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Aluguel"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
