import {describe, expect, it} from 'vitest';

import {analyticsResponseSchema, dashboardStatsSchema, failureTrendPointSchema, recurringIssueSchema} from './analytics';
import * as shared from './index';

describe('analytics schemas', () => {
  it('validates dashboard stats boundaries', () => {
    expect(dashboardStatsSchema.parse(
               {totalEquipment: 10, totalFailures: 3, repairSuccessRate: 0.9}))
        .toEqual(
            {totalEquipment: 10, totalFailures: 3, repairSuccessRate: 0.9});

    expect(
        () => dashboardStatsSchema.parse(
            {totalEquipment: -1, totalFailures: 3, repairSuccessRate: 1.2}))
        .toThrow();
  });

  it('validates trend and recurring issue points', () => {
    expect(failureTrendPointSchema.parse({day: '2026-04-05', count: 2}).count)
        .toBe(2);
    expect(recurringIssueSchema.parse({symptoms: 'Signal dropout', count: 4}))
        .toEqual({symptoms: 'Signal dropout', count: 4});
  });

  it('validates full analytics response object', () => {
    const parsed = analyticsResponseSchema.parse({
      dashboard: {totalEquipment: 3, totalFailures: 5, repairSuccessRate: 0.6},
      failureTrends: [{day: '2026-04-05', count: 2}],
      recurringIssues: [{symptoms: 'Pressure spikes', count: 2}],
      recommendations: [{
        equipmentId: '11111111-1111-1111-1111-111111111111',
        recommendation: 'REPAIR',
        reason: 'Success rate high',
        failureRate: 0.1,
        repairSuccessRate: 0.8
      }]
    });

    expect(parsed.recommendations[0]?.recommendation).toBe('REPAIR');
  });

  it('re-exports public API from index module', () => {
    expect(shared).toHaveProperty('equipmentStatusSchema');
    expect(shared).toHaveProperty('analyticsResponseSchema');
  });
});