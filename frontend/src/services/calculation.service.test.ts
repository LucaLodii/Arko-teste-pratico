/**
 * Unit tests for calculation.service
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculationService } from './calculation.service';
import { api } from './api';

// Mock the API module
vi.mock('./api', () => ({
    api: {
        post: vi.fn(),
    },
}));

describe('calculationService', () => {
    const mockInput = {
        carValue: 50000,
        monthlyRent: 1500,
        interestRateMonth: 0.01,
        financingTermMonths: 48,
        analysisPeriodMonths: 48,
    };

    const mockCalculationResponse = {
        cashPurchase: { totalCost: 40000, breakdown: {} },
        financedPurchase: { totalCost: 60000, breakdown: {} },
        rental: { totalCost: 72000, monthlyCost: 1500 },
        breakEven: { breakEvenCashMonths: 24, breakEvenFinancedMonths: null },
    };

    const mockTimelineResponse = {
        timeline: [
            { month: 1, cashCost: 1000, financedCost: 1200, rentalCost: 1500 },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('calculate', () => {
        it('should send input to /api/calculate and return data', async () => {
            (api.post as any).mockResolvedValue({ data: mockCalculationResponse });

            const result = await calculationService.calculate(mockInput);

            expect(api.post).toHaveBeenCalledWith('/api/calculate', mockInput);
            expect(result).toEqual(mockCalculationResponse);
        });

        it('should handle API errors', async () => {
            const error = new Error('Network Error');
            (api.post as any).mockRejectedValue(error);

            await expect(calculationService.calculate(mockInput)).rejects.toThrow('Network Error');
        });
    });

    describe('calculateTimeline', () => {
        it('should send input to /api/calculate-timeline and return data', async () => {
            (api.post as any).mockResolvedValue({ data: mockTimelineResponse });

            const result = await calculationService.calculateTimeline(mockInput);

            expect(api.post).toHaveBeenCalledWith(
                '/api/calculate-timeline',
                mockInput,
                { signal: undefined }
            );
            expect(result).toEqual(mockTimelineResponse);
        });

        it('should pass abort signal if provided', async () => {
            (api.post as any).mockResolvedValue({ data: mockTimelineResponse });
            const controller = new AbortController();

            await calculationService.calculateTimeline(mockInput, controller.signal);

            expect(api.post).toHaveBeenCalledWith(
                '/api/calculate-timeline',
                mockInput,
                { signal: controller.signal }
            );
        });
    });
});
