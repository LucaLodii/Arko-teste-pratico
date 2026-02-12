/**
 * Unit tests for Button atom
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
    it('should render with children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should call onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick handler when clicked test 2', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show loading state', () => {
        render(<Button loading>Loading</Button>);
        // When loading, the button text might change or a spinner might appear.
        // Based on implementation, children might be hidden or replaced.
        // Let's assume the button is disabled during loading.
        expect(screen.getByRole('button')).toBeDisabled();
        // You might want to check for a specific class or loading indicator if your component has one.
        // For example: expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByText('Calculando...')).toBeInTheDocument();
    });

    it('should apply variant classes', () => {
        render(<Button variant="secondary">Secondary</Button>);
        // Check for a class specific to secondary variant. 
        // This depends on your css module or tailwind classes.
        // Example: expect(container.firstChild).toHaveClass('bg-white');
        // Adjust expectation based on actual implementation.
        expect(screen.getByRole('button')).toHaveClass('bg-white');
    });

    it('should render full width when fullWidth is true', () => {
        render(<Button fullWidth>Full Width</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    })
});
