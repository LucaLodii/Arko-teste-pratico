/**
 * Unit tests for CalculatorPage
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalculatorPage } from '../CalculatorPage';

// Mock Three.js dependencies
vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }: any) => <div>{children}</div>,
    useFrame: vi.fn(),
    useThree: () => ({ camera: { position: [0, 0, 0] }, size: { width: 0, height: 0 } }),
}));

vi.mock('three', () => ({
    Vector3: class { set() { } },
    Color: class { },
}));

// Mock the entire organisms module to avoid loading real components (and Three.js)
vi.mock('../../organisms', () => ({
    Header: () => <div data-testid="mock-header">Header</div>,
    Footer: () => <div data-testid="mock-footer">Footer</div>,
    Copyright: () => <div data-testid="mock-copyright">Copyright</div>,
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
    ),
    ComparisonResults: ({ loading, error, result }: any) => (
        <div data-testid="mock-results">
            {loading && <span>Loading...</span>}
            {error && <span>{error}</span>}
            {result && <span>Result Received</span>}
        </div>
    ),
    HeroSection: () => <div data-testid="mock-hero">Hero</div>,
    MethodologySection: () => <div data-testid="mock-methodology">Methodology</div>,
    AboutSection: () => <div data-testid="mock-about">About</div>,
    HowToUseCard: ({ title }: any) => <div data-testid="mock-how-to-use">{title}</div>
}));

vi.mock('../../atoms', () => ({
    Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
    Card: ({ children }: any) => <div>{children}</div>
}));

describe('CalculatorPage', () => {
    it('should render page structure', () => {
        render(<CalculatorPage />);
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
        expect(screen.getByTestId('mock-how-to-use')).toBeInTheDocument();
        expect(screen.getByTestId('mock-calculator-form')).toBeInTheDocument();
        expect(screen.getByTestId('mock-results')).toBeInTheDocument();
        expect(screen.getByTestId('mock-methodology')).toBeInTheDocument();
        expect(screen.getByTestId('mock-about')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
        expect(screen.getByTestId('mock-copyright')).toBeInTheDocument();
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
