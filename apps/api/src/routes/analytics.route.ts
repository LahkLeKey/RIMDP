import {analyticsResponseSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';

import {AnalyticsService} from '../services/analytics.service.js';

export const analyticsRoutes: FastifyPluginAsync = async (app) => {
  const analyticsService = new AnalyticsService(app.prisma);

  app.get(
      '/', {
        schema: {
          tags: ['Analytics'],
          summary: 'Get analytics',
          description:
              'Returns dashboard metrics, trends, recurring issues, and recommendations.',
          security: [{bearerAuth: []}],
          response: {200: analyticsResponseSchema}
        }
      },
      async () => analyticsService.getAnalytics());
};