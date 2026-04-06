import {describe, expect, it} from 'vitest';

import {recommendRepairVsReplace} from './recommendation.service';

describe('recommendRepairVsReplace', () => {
  it('recommends replacement for high failures and low success rate', () => {
    const result = recommendRepairVsReplace({
      equipmentId: '11111111-1111-1111-1111-111111111111',
      failureRate: 0.5,
      repairSuccessRate: 0.3,
      totalFailures: 6
    });

    expect(result.recommendation).toBe('REPLACE');
    expect(result.reason).toContain('replacement');
  });

  it('recommends repair for high success rates', () => {
    const result = recommendRepairVsReplace({
      equipmentId: '22222222-2222-2222-2222-222222222222',
      failureRate: 0.1,
      repairSuccessRate: 0.8,
      totalFailures: 2
    });

    expect(result.recommendation).toBe('REPAIR');
  });

  it('recommends monitor for mixed/insufficient confidence', () => {
    const result = recommendRepairVsReplace({
      equipmentId: '33333333-3333-3333-3333-333333333333',
      failureRate: 0.2,
      repairSuccessRate: 0.6,
      totalFailures: 3
    });

    expect(result.recommendation).toBe('MONITOR');
  });
});