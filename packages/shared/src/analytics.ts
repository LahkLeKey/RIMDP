import {z} from 'zod';

import {recommendationSchema} from './domain';

export const dashboardStatsSchema = z.object({
  totalEquipment: z.number().int().nonnegative(),
  totalFailures: z.number().int().nonnegative(),
  repairSuccessRate: z.number().min(0).max(1)
});

export const failureTrendPointSchema =
    z.object({day: z.string(), count: z.number().int().nonnegative()});

export const recurringIssueSchema =
    z.object({symptoms: z.string(), count: z.number().int().nonnegative()});

export const analyticsResponseSchema = z.object({
  dashboard: dashboardStatsSchema,
  failureTrends: z.array(failureTrendPointSchema),
  recurringIssues: z.array(recurringIssueSchema),
  recommendations: z.array(recommendationSchema)
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type FailureTrendPoint = z.infer<typeof failureTrendPointSchema>;
export type RecurringIssue = z.infer<typeof recurringIssueSchema>;
export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;