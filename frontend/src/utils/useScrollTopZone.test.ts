/**
 * Unit tests for useScrollTopZone hook
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollTopZone } from './useScrollTopZone';

describe('useScrollTopZone', () => {
    beforeEach(() => {
        // Mock window properties
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    });

    it('should return true initially (when scroll is 0)', () => {
        const { result } = renderHook(() => useScrollTopZone());
        expect(result.current).toBe(true);
    });

    it('should return true when scroll is less than viewport height', () => {
        const { result } = renderHook(() => useScrollTopZone());

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
            window.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toBe(true);
    });

    it('should return false when scroll is equal or greater than viewport height', () => {
        const { result } = renderHook(() => useScrollTopZone());

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
            window.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toBe(false);

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 1500, writable: true });
            window.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toBe(false);
    });

    it('should update whe scrolling back up', () => {
        const { result } = renderHook(() => useScrollTopZone());

        // Scroll down
        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 1200, writable: true });
            window.dispatchEvent(new Event('scroll'));
        });
        expect(result.current).toBe(false);

        // Scroll back up
        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 800, writable: true });
            window.dispatchEvent(new Event('scroll'));
        });
        expect(result.current).toBe(true);
    });
});
