/**
 * Unit tests for Footer organism
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer, Copyright } from '../Footer';

// Mock Icon
vi.mock('../../atoms', () => ({
    Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />
}));

describe('Footer', () => {
    it('should render contact section', () => {
        render(<Footer />);
        expect(screen.getByRole('heading', { name: /Contato/i })).toBeInTheDocument();
    });

    it('should render social links', () => {
        render(<Footer />);

        const linkedin = screen.getByRole('link', { name: /LinkedIn/i });
        expect(linkedin).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
        expect(linkedin).toHaveAttribute('target', '_blank');

        const github = screen.getByRole('link', { name: /GitHub/i });
        expect(github).toHaveAttribute('href', expect.stringContaining('github.com'));

        const email = screen.getByRole('link', { name: /Email/i });
        expect(email).toHaveAttribute('href', expect.stringContaining('mailto:'));
    });

    it('should render correct icons', () => {
        render(<Footer />);
        expect(screen.getByTestId('icon-linkedin')).toBeInTheDocument();
        expect(screen.getByTestId('icon-github')).toBeInTheDocument();
        expect(screen.getByTestId('icon-email')).toBeInTheDocument();
    });
});

describe('Copyright', () => {
    it('should render copyright text with current year', () => {
        render(<Copyright />);
        const year = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${year} - Car Calc`))).toBeInTheDocument();
    });
});
