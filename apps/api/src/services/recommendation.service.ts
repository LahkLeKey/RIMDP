import type {Recommendation} from '@rimdp/shared';

type RecommendationInput = {
  equipmentId: string; failureRate: number; repairSuccessRate: number;
  totalFailures: number;
};

const DEFAULT_FAILURE_THRESHOLD = 4;
const MIN_REPAIR_SUCCESS_RATE = 0.5;

export const recommendRepairVsReplace =
    (input: RecommendationInput): Recommendation => {
      const {equipmentId, failureRate, repairSuccessRate, totalFailures} =
          input;

      if (totalFailures > DEFAULT_FAILURE_THRESHOLD &&
          repairSuccessRate < MIN_REPAIR_SUCCESS_RATE) {
        return {
          equipmentId,
          recommendation: 'REPLACE',
          reason:
              'High failure volume with low repair success indicates replacement.',
          failureRate,
          repairSuccessRate
        };
      }

      if (repairSuccessRate >= 0.75) {
        return {
          equipmentId,
          recommendation: 'REPAIR',
          reason: 'Repairs are consistently successful and cost-effective.',
          failureRate,
          repairSuccessRate
        };
      }

      return {
        equipmentId,
        recommendation: 'MONITOR',
        reason: 'Collect more telemetry before deciding on replacement.',
        failureRate,
        repairSuccessRate
      };
    };