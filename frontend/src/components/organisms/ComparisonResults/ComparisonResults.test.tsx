/**
 * Unit tests for ComparisonResults organism
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComparisonResults } from '../ComparisonResults';
import { calculationService } from '../../../services/calculation.service';

// Mock dependencies
vi.mock('../../atoms', () => ({
    Card: ({ children, className, highlight }: any) => (
        <div data-testid="mock-card" className={className} data-highlight={highlight}>
            {children}
        </div>
    ),
    Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
    Tooltip: ({ children, content }: any) => <span title={content}>{children}</span>
}));

vi.mock('../../molecules', () => ({
    EmptyResultsState: () => <div data-testid="empty-results">Empty State</div>
}));

vi.mock('../CostComparisonChart', () => ({
    CostComparisonChart: () => <div data-testid="mock-chart">Chart</div>
}));

vi.mock('../../../services/calculation.service', () => ({
    calculationService: {
        calculateTimeline: vi.fn(),
    }
}));

vi.mock('../../../utils/formatters', () => ({
    formatCurrency: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
}));

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    PieChart: () => <div>PieChart</div>,
    Pie: () => <div>Pie</div>,
    Cell: () => <div>Cell</div>,
    Tooltip: () => <div>Tooltip</div>,
    Legend: () => <div>Legend</div>,
}));

// Helper data
const mockResult = {
    cashPurchase: {
        totalCost: 500000,
        breakdown: {
            depreciacao: 50000,
            ipva: 20000,
            seguro: 15000,
            manutencao: 10000,
            custoOportunidade: 405000
        }
    },
    financedPurchase: {
        totalCost: 800000,
        parcela: 3500,
        totalJuros: 300000,
        breakdown: {
            totalParcelas: 420000,
            totalJuros: 300000,
            depreciacao: 50000,
            ipva: 20000,
            seguro: 15000,
            manutencao: 10000,
            custoOportunidade: 0 // Simplification
        }
    },
    rental: {
        totalCost: 600000,
        monthlyCost: 2500
    },
    breakEven: {
        breakEvenCashMonths: 60,
        breakEvenFinancedMonths: null
    }
};

const mockInput = {
    propertyValue: 500000,
    rentalValue: 2500,
    // Add other necessary fields if needed by the component or service call
};

const mockTimelineData = {
    timeline: []
};

describe('ComparisonResults', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render loading skeleton when loading is true', () => {
        const { container } = render(
            <ComparisonResults
                result={null}
                input={null}
                loading={true}
                error={null}
            />
        );
        // Check for skeleton elements
        expect(screen.getByTestId('results-skeleton')).toBeInTheDocument();
    });

    it('should render error message when error is present', () => {
        render(
            <ComparisonResults
                result={null}
                input={null}
                loading={false}
                error="Calculation failed"
            />
        );
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Calculation failed')).toBeInTheDocument();
    });

    it('should render empty state when no result', () => {
        render(
            <ComparisonResults
                result={null}
                input={null}
                loading={false}
                error={null}
            />
        );
        expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    });

    it('should render results and highlight best option', async () => {
        // Determine best option in mock: Cash (500k) < Rental (600k) < Financed (800k)
        // Cash should be highlighted
        (calculationService.calculateTimeline as any).mockResolvedValue(mockTimelineData);

        render(
            <ComparisonResults
                result={mockResult as any}
                input={mockInput as any}
                loading={false}
                error={null}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Compra à Vista')).toBeInTheDocument();
        });

        expect(screen.getByText('R$ 500.000,00')).toBeInTheDocument(); // Cash total

        // Check highlight logic (Cash is best)
        const cards = screen.getAllByTestId('mock-card');
        // We expect 3 main cards. The first one (Cash) should have highlight="success"
        expect(cards[0]).toHaveAttribute('data-highlight', 'success');
        expect(cards[1]).toHaveAttribute('data-highlight', 'none'); // Financed
        expect(cards[2]).toHaveAttribute('data-highlight', 'none'); // Rental
    });

    it('should fetch and display timeline chart', async () => {
        (calculationService.calculateTimeline as any).mockResolvedValue(mockTimelineData);

        render(
            <ComparisonResults
                result={mockResult as any}
                input={mockInput as any}
                loading={false}
                error={null}
            />
        );

        // Initial loading or wait for effect
        expect(calculationService.calculateTimeline).toHaveBeenCalledWith(mockInput, expect.anything());

        await waitFor(() => {
            expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
        });
    });

    it('should handle timeline fetch error gracefully', async () => {
        (calculationService.calculateTimeline as any).mockRejectedValue(new Error('Network error'));

        render(
            <ComparisonResults
                result={mockResult as any}
                input={mockInput as any}
                loading={false}
                error={null}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Não foi possível carregar o gráfico de evolução de custos.')).toBeInTheDocument();
        });
        expect(screen.queryByTestId('mock-chart')).not.toBeInTheDocument();
    });

    it('should toggle detailed breakdown', async () => {
        (calculationService.calculateTimeline as any).mockResolvedValue(mockTimelineData);
        render(
            <ComparisonResults
                result={mockResult as any}
                input={mockInput as any}
                loading={false}
                error={null}
            />
        );

        // Initial state: details hidden
        expect(screen.queryByText('Depreciação')).not.toBeInTheDocument();

        // Click 'Detalhar custos' for Cash option
        const toggleButtons = screen.getAllByText('Detalhar custos');
        fireEvent.click(toggleButtons[0]);

        expect(await screen.findByText('Depreciação')).toBeInTheDocument();
        expect(screen.getByText('R$ 50.000,00')).toBeInTheDocument(); // Depreciation value
    });
});
