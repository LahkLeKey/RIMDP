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
          security: [{bearerAuth: []}]
        }
      },
      async () => analyticsService.getAnalytics());
};