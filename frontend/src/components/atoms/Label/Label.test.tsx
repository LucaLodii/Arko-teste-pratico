/**
 * Unit tests for Label atom
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '../Label';

describe('Label', () => {
    it('should render children correctly', () => {
        render(<Label>Test Label</Label>);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should associate with input via htmlFor', () => {
        render(
            <>
                <Label htmlFor="test-input">Test Label</Label>
                <input id="test-input" />
            </>
        );
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should show asterisk when required is true', () => {
        render(<Label required>Required Label</Label>);
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('*')).toHaveClass('text-status-error');
    });

    it('should apply custom className', () => {
        render(<Label className="custom-class">Custom Label</Label>);
        // Use a regex or check if the element has the class.
        // Note: getByText might return the span for asterisk if present, so be careful.
        const label = screen.getByText('Custom Label').closest('label');
        expect(label).toHaveClass('custom-class');
        expect(label).toHaveClass('text-olive-700'); // preserving base classes
    });
});
