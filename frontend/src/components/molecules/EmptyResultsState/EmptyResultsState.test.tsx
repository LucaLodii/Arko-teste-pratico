/**
 * Unit tests for EmptyResultsState molecule
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyResultsState } from '../EmptyResultsState';

// Mock Icon since it is an external dependency
vi.mock('../../atoms', () => ({
    Icon: ({ name, className }: any) => <span data-testid={`icon-${name}`} className={className} />
}));

describe('EmptyResultsState', () => {
    it('should render default message when no message prop provided', () => {
        render(<EmptyResultsState />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/Seus resultados aparecerão aqui/i)).toBeInTheDocument();
        expect(screen.getByText(/Preencha o formulário acima/i)).toBeInTheDocument();
        expect(screen.getByTestId('icon-chart-pie-empty')).toBeInTheDocument();
    });

    it('should render custom message when provided', () => {
        const customMessage = "Custom empty message";
        render(<EmptyResultsState message={customMessage} />);
        expect(screen.getByText(customMessage)).toBeInTheDocument();
        expect(screen.queryByText(/Preencha o formulário acima/i)).not.toBeInTheDocument();
    });
});
