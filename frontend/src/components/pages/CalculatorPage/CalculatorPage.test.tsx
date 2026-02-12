/**
 * Unit tests for CalculatorPage
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalculatorPage } from '../CalculatorPage';

// Mock child components
vi.mock('../../../organisms/Header', () => ({
    Header: () => <header data-testid="mock-header">Header</header>
}));

vi.mock('../../../organisms/Footer', () => ({
    Footer: () => <footer data-testid="mock-footer">Footer</footer>,
    Copyright: () => <div data-testid="mock-copyright">Copyright</div>
}));

vi.mock('../../../organisms/CalculatorForm', () => ({
    CalculatorForm: ({ onCalculate, onError, onLoadingChange }: any) => (
        <div data-testid="mock-calculator-form">
            <button
                onClick={() => {
                    onLoadingChange(true);
                    setTimeout(() => {
                        onCalculate({ result: 'mock' }, { input: 'mock' });
                        onLoadingChange(false);
                    }, 100);
                }}
            >
                Simulate Calculate
            </button>
            <button onClick={() => onError('Mock Error')}>Simulate Error</button>
        </div>
    )
}));

vi.mock('../../../organisms/ComparisonResults', () => ({
    ComparisonResults: ({ loading, error, result }: any) => (
        <div data-testid="mock-results">
            {loading && <span>Loading...</span>}
            {error && <span>{error}</span>}
            {result && <span>Result Received</span>}
        </div>
    )
}));

vi.mock('../../../molecules', () => ({
    HowToUseCard: ({ title }: any) => <div data-testid="mock-how-to-use">{title}</div>
}));

vi.mock('../../atoms', () => ({
    Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />
}));

describe('CalculatorPage', () => {
    it('should render page structure', () => {
        render(<CalculatorPage />);
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-calculator-form')).toBeInTheDocument();
        expect(screen.getByTestId('mock-results')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('should handle calculation flow', async () => {
        render(<CalculatorPage />);

        const calcBtn = screen.getByText('Simulate Calculate');
        fireEvent.click(calcBtn);

        // Check loading state passed to results
        expect(await screen.findByText('Loading...')).toBeInTheDocument();

        // Check success state
        await waitFor(() => {
            expect(screen.getByText('Result Received')).toBeInTheDocument();
        });
    });

    it('should handle error flow', () => {
        render(<CalculatorPage />);

        const errorBtn = screen.getByText('Simulate Error');
        fireEvent.click(errorBtn);

        expect(screen.getByText('Mock Error')).toBeInTheDocument();
    });
});
