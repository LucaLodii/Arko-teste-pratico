/**
 * Unit tests for InputField molecule
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InputField } from '../InputField';

// Mock dependencies to focus on InputField logic
vi.mock('../../atoms', () => ({
    Label: ({ children, htmlFor, required }: any) => (
        <label htmlFor={htmlFor} data-testid="mock-label">
            {children}
            {required && <span>*</span>}
        </label>
    ),
    Input: (props: any) => <input data-testid="mock-input" {...props} />,
    Tooltip: ({ children, content }: any) => <div data-testid="mock-tooltip" title={content}>{children}</div>,
    Icon: ({ name }: any) => <span data-testid={`mock-icon-${name}`} />
}));

describe('InputField', () => {
    const defaultProps = {
        label: 'Test Field',
        value: '',
        onChange: vi.fn(),
    };

    it('should render correct structure', () => {
        render(<InputField {...defaultProps} />);
        expect(screen.getByTestId('mock-label')).toHaveTextContent('Test Field');
        expect(screen.getByTestId('mock-input')).toBeInTheDocument();
    });

    it('should generate id if not provided', () => {
        render(<InputField {...defaultProps} />);
        const input = screen.getByTestId('mock-input');
        const label = screen.getByTestId('mock-label');
        const inputId = input.getAttribute('id');
        const labelFor = label.getAttribute('for');

        expect(inputId).toBeTruthy();
        expect(inputId).toBe(labelFor);
    });

    it('should use provided id', () => {
        render(<InputField {...defaultProps} id="custom-id" />);
        const input = screen.getByTestId('mock-input');
        expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('should render tooltip when provided', () => {
        render(<InputField {...defaultProps} tooltip="Help text" />);
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toHaveAttribute('title', 'Help text');
    });

    it('should display error message', () => {
        render(<InputField {...defaultProps} error="Error message" />);
        expect(screen.getByRole('alert')).toHaveTextContent('Error message');
        expect(screen.getByTestId('mock-icon-error')).toBeInTheDocument();

        const input = screen.getByTestId('mock-input');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-error'));
    });

    it('should display helper text when no error', () => {
        render(<InputField {...defaultProps} helperText="Helper text" />);
        expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should prioritize error over helper text', () => {
        render(<InputField {...defaultProps} error="Error" helperText="Helper" />);
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should handle different input types correctly', () => {
        const { rerender } = render(<InputField {...defaultProps} type="number" />);
        expect(screen.getByTestId('mock-input')).toHaveAttribute('type', 'number');

        rerender(<InputField {...defaultProps} type="email" />);
        expect(screen.getByTestId('mock-input')).toHaveAttribute('type', 'email');

        // Should fallback to text for unsupported types if logic dictates, 
        // but here we just check if it passes through or gets sanitized as per component logic.
        // The component says: type={(type === 'number' || type === 'email' ? type : 'text') ...}
        rerender(<InputField {...defaultProps} type={"tel" as any} />); // 'tel' not in whitelist
        expect(screen.getByTestId('mock-input')).toHaveAttribute('type', 'text');
    });
});
