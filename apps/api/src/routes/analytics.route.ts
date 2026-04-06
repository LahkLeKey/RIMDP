import type {FastifyPluginAsync} from 'fastify';

import {AnalyticsService} from '../services/analytics.service.js';

export const analyticsRoutes: FastifyPluginAsync = async (app) => {
  const analyticsService = new AnalyticsService(app.prisma);

  app.get('/', async () => analyticsService.getAnalytics());
};