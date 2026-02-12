/**
 * Unit tests for Input atom
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
    it('should render correctly with default props', () => {
        render(<Input value="" onChange={() => { }} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
        render(<Input value="" onChange={() => { }} placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should call onChange when value changes', () => {
        const handleChange = vi.fn();
        render(<Input value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should display value correctly', () => {
        render(<Input value="Current Value" onChange={() => { }} />);
        expect(screen.getByRole('textbox')).toHaveValue('Current Value');
    });

    it('should handle different types (e.g., number)', () => {
        render(<Input type="number" value={10} onChange={() => { }} />);
        // Note: getByRole('textbox') might not work for type="number" in some setups,
        // but usually it triggers implicit role or we can find by display value/placeholder.
        // A safe bet is getByDisplayValue for numbers or simply checking the attribute carefully if we query differently.
        // However, modern testing-library often handles type="number" as a spinbutton.
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        expect(screen.getByRole('spinbutton')).toHaveValue(10);
    });

    it('should apply error styles when error prop is true', () => {
        render(<Input value="" onChange={() => { }} error />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveClass('border-status-error/50');
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Input value="" onChange={() => { }} disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should render icons when provided', () => {
        const LeftIcon = <span data-testid="left-icon">L</span>;
        const RightIcon = <span data-testid="right-icon">R</span>;

        render(
            <Input
                value=""
                onChange={() => { }}
                leftIcon={LeftIcon}
                rightIcon={RightIcon}
            />
        );

        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
});
