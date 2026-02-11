/**
 * Calculate Timeline Use Case
 *
 * Orchestrates the timeline calculation for cost-over-time visualization.
 */

import type { CalculationInput, TimelineResponse } from '../../domain/types';
import type { TimelineService } from '../services/timeline.service';

export class CalculateTimelineUseCase {
  constructor(private readonly timelineService: TimelineService) {}

  execute(input: CalculationInput): TimelineResponse {
    const timeline = this.timelineService.calculate(input);
    return { timeline };
  }
}
