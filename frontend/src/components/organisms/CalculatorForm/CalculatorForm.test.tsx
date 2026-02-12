/**
 * Unit tests for CalculatorForm organism
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalculatorForm } from '../CalculatorForm';
import { calculationService } from '../../../services/calculation.service';

// Mock dependencies
vi.mock('../../molecules', () => ({
    InputField: ({ label, value, onChange, error, ...props }: any) => (
        <div className="mb-4">
            <label>{label}</label>
            <input
                value={value}
                onChange={onChange}
                data-testid={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
                aria-invalid={!!error}
                {...props}
            />
            {error && <span role="alert">{error}</span>}
        </div>
    )
}));

vi.mock('../../atoms', () => ({
    Button: ({ children, loading, fullWidth, onClick, type, ...props }: any) => (
        <button type={type} onClick={onClick} disabled={loading} {...props}>
            {loading ? 'Calculando...' : children}
        </button>
    ),
    Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />
}));

vi.mock('../../../services/calculation.service', () => ({
    calculationService: {
        calculate: vi.fn(),
    }
}));

describe('CalculatorForm', () => {
    const mockOnCalculate = vi.fn();
    const mockOnError = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset implementation to default
        (calculationService.calculate as any).mockReset();
    });

    it('should render all basic fields', () => {
        render(<CalculatorForm onCalculate={mockOnCalculate} />);

        expect(screen.getByText('Valor do Carro')).toBeInTheDocument();
        expect(screen.getByText('Aluguel Mensal')).toBeInTheDocument();
        expect(screen.getByText('Taxa de Juros Mensal (%)')).toBeInTheDocument();
    });

    it('should toggle advanced options', () => {
        render(<CalculatorForm onCalculate={mockOnCalculate} />);

        // Initially hidden
        expect(screen.queryByText('Entrada (%)')).not.toBeInTheDocument();

        const toggleBtn = screen.getByText('Opções Avançadas');
        fireEvent.click(toggleBtn);

        expect(screen.getByText('Entrada (%)')).toBeInTheDocument();
    });

    it('should validate required fields', async () => {
        render(<CalculatorForm onCalculate={mockOnCalculate} />);

        // Set invalid value (e.g. 0 for car value)
        const carInput = screen.getByTestId('input-valor-do-carro');
        fireEvent.change(carInput, { target: { value: '0', type: 'number' } });

        const submitBtn = screen.getByText('Calcular Comparação');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
        });

        expect(screen.getByText('O valor do carro deve ser maior que zero')).toBeInTheDocument();
        expect(mockOnCalculate).not.toHaveBeenCalled();
    });

    it('should submit successfully with valid data', async () => {
        const mockResult = { success: true };
        (calculationService.calculate as any).mockResolvedValue(mockResult);

        render(<CalculatorForm onCalculate={mockOnCalculate} />);

        // Just click submit, assuming default values are valid
        const submitBtn = screen.getByText('Calcular Comparação');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // Check if validation failed
            if (screen.queryByRole('alert')) {
                // Fails the test with a message showing the alert text
                throw new Error('Validation failed with: ' + screen.getByRole('alert').textContent);
            }
            expect(calculationService.calculate).toHaveBeenCalled();
            expect(mockOnCalculate).toHaveBeenCalledWith(mockResult, expect.anything());
        });
    });

    it('should handle service errors', async () => {
        const errorMsg = 'Network Error';
        const mockError = new Error(errorMsg);
        (mockError as any).code = 'ERR_NETWORK';
        (calculationService.calculate as any).mockRejectedValue(mockError);

        render(<CalculatorForm onCalculate={mockOnCalculate} onError={mockOnError} />);

        const submitBtn = screen.getByText('Calcular Comparação');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('Erro ao conectar'));
        });
    });
});
