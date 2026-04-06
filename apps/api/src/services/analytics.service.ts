import type {Failure, PrismaClient, Repair} from '@prisma/client';
import type {AnalyticsResponse} from '@rimdp/shared';

import {round, safeDivide} from '../utils/metrics.js';

import {recommendRepairVsReplace} from './recommendation.service.js';

export class AnalyticsService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAnalytics(): Promise<AnalyticsResponse> {
    const [equipmentCount, failureCount, repairCount, successfulRepairCount, recurringIssueRows] =
        await Promise.all([
          this.prisma.equipment.count(), this.prisma.failure.count(),
          this.prisma.repair.count(),
          this.prisma.repair.count({where: {status: 'COMPLETED'}}),
          this.prisma.failure.groupBy({
            by: ['symptoms'],
            _count: {symptoms: true},
            orderBy: {_count: {symptoms: 'desc'}},
            take: 5
          })
        ]);

    const repairSuccessRate =
        round(safeDivide(successfulRepairCount, repairCount));

    const trendRows =
        await this.prisma.$queryRaw < Array < {day: Date; count: bigint} >> `
      SELECT date_trunc('day', "occurredAt") AS day, COUNT(*)::bigint AS count
      FROM "Failure"
      GROUP BY day
      ORDER BY day DESC
      LIMIT 14
    `;

    const failureTrends = trendRows
                              .map((row: {day: Date; count: bigint}) => ({
                                     day: row.day.toISOString().slice(0, 10),
                                     count: Number(row.count)
                                   }))
                              .reverse();

    const recurringIssues = recurringIssueRows.map(
        (row: {symptoms: string; _count: {symptoms: number}}) =>
            ({symptoms: row.symptoms, count: row._count.symptoms}));

    const equipment = await this.prisma.equipment.findMany(
        {include: {failures: {include: {repairs: true}}}});

    const recommendations = equipment.map((item) => {
      const totalFailures = item.failures.length;
      const totalRepairs = item.failures.reduce(
          (acc: number, failure: Failure&{repairs: Repair[]}) =>
              acc + failure.repairs.length,
          0);
      const successfulRepairs = item.failures.reduce(
          (acc: number, failure: Failure&{repairs: Repair[]}) => acc +
              failure.repairs
                  .filter((repair: Repair) => repair.status === 'COMPLETED')
                  .length,
          0);

      const failureRate = round(safeDivide(totalFailures, 30));
      const itemRepairSuccessRate =
          round(safeDivide(successfulRepairs, totalRepairs));

      return recommendRepairVsReplace({
        equipmentId: item.id,
        failureRate,
        repairSuccessRate: itemRepairSuccessRate,
        totalFailures
      });
    });

    return {
      dashboard: {
        totalEquipment: equipmentCount,
        totalFailures: failureCount,
        repairSuccessRate
      },
      failureTrends,
      recurringIssues,
      recommendations
    };
  }
}