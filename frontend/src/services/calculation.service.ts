import { api } from './api';
import type {
  CalculationInput,
  CalculationResponse,
  TimelineResponse,
} from '../types/calculation.types';

/**
 * Calculation service for Rent vs. Buy Car Calculator API
 */
export const calculationService = {
  /**
   * Sends calculation input to the backend and returns the comparison result.
   * @param input - Calculation parameters (car value, rent, rates, etc.)
   * @returns Promise with CalculationResponse containing cash, financed, rental, and break-even results
   */
  async calculate(input: CalculationInput): Promise<CalculationResponse> {
    const response = await api.post<CalculationResponse>('/api/calculate', input);
    return response.data;
  },

  /**
   * Fetches cost timeline for chart visualization.
   * @param input - Same calculation parameters as calculate
   * @param signal - Optional AbortSignal to cancel the request
   * @returns Promise with TimelineResponse containing monthly cost data
   */
  async calculateTimeline(
    input: CalculationInput,
    signal?: AbortSignal
  ): Promise<TimelineResponse> {
    const response = await api.post<TimelineResponse>(
      '/api/calculate-timeline',
      input,
      { signal }
    );
    return response.data;
  },
};
