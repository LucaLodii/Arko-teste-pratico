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

export interface CostComparisonChartProps {
  data: TimelineDataPoint[];
  breakEvenCashMonths: number | null;
  breakEvenFinancedMonths: number | null;
}

const SCENARIO_COLORS = {
  cash: '#58764E',
  financed: '#C89F65',
  rental: '#64748B',
} as const;

export function CostComparisonChart({
  data,
  breakEvenCashMonths,
  breakEvenFinancedMonths,
}: CostComparisonChartProps) {
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string; payload: TimelineDataPoint }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="z-50 rounded-lg border border-olive-700 bg-olive-900 p-3 text-xs shadow-xl">
          <p className="mb-2 border-b border-olive-700 pb-1 font-medium text-sage-200">
            Mês {payload[0].payload.month}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="mb-1 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-olive-100">{entry.name}</span>
              </div>
              <span className="font-mono font-bold text-white">
                {formatCurrency(entry.value, 0)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="font-sans">
      <h3 className="mb-4 text-xl font-semibold text-olive-900">Evolução dos Custos</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E3DF" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#687764', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
            label={{
              value: 'Meses',
              position: 'insideBottomRight',
              offset: -5,
              fill: '#859281',
              fontSize: 12,
            }}
          />
          <YAxis
            tick={{ fill: '#687764', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value, 0)}
            dx={-10}
            width={60}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#ACC8A2', strokeWidth: 1 }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#1A2517',
              paddingTop: '0px',
            }}
          />
          {breakEvenCashMonths !== null && (
            <ReferenceLine
              x={breakEvenCashMonths}
              stroke="#5B8C9B"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'Empate à Vista',
                position: 'insideTopRight',
                fill: '#5B8C9B',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          )}
          {breakEvenFinancedMonths !== null && (
            <ReferenceLine
              x={breakEvenFinancedMonths}
              stroke="#5B8C9B"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'Empate Financiado',
                position: 'insideTopRight',
                fill: '#5B8C9B',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="cashCost"
            name="À Vista"
            stroke={SCENARIO_COLORS.cash}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: SCENARIO_COLORS.cash }}
          />
          <Line
            type="monotone"
            dataKey="financedCost"
            name="Financiado"
            stroke={SCENARIO_COLORS.financed}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: SCENARIO_COLORS.financed }}
          />
          <Line
            type="monotone"
            dataKey="rentalCost"
            name="Aluguel"
            stroke={SCENARIO_COLORS.rental}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: SCENARIO_COLORS.rental }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
