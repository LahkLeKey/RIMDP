import cors from '@fastify/cors';
import Fastify from 'fastify';
import {serializerCompiler, validatorCompiler, type ZodTypeProvider} from 'fastify-type-provider-zod';

import {authPlugin} from './plugins/auth.plugin.js';
import {envPlugin} from './plugins/env.plugin.js';
import {errorHandlerPlugin} from './plugins/error-handler.plugin.js';
import {prismaPlugin} from './plugins/prisma.plugin.js';
import {analyticsRoutes} from './routes/analytics.route.js';
import {authRoutes} from './routes/auth.route.js';
import {equipmentRoutes} from './routes/equipment.route.js';
import {failureRoutes} from './routes/failure.route.js';
import {repairRoutes} from './routes/repair.route.js';

export const buildApp = () => {
  const app = Fastify({logger: true}).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(envPlugin);
  app.register(cors, {origin: true, credentials: true});
  app.register(prismaPlugin);
  app.register(authPlugin);
  app.register(errorHandlerPlugin);

  app.get('/health', async () => ({ok: true}));
  app.register(authRoutes, {prefix: '/auth'});
  app.register(equipmentRoutes, {prefix: '/equipment'});
  app.register(failureRoutes, {prefix: '/failures'});
  app.register(repairRoutes, {prefix: '/repairs'});
  app.register(analyticsRoutes, {prefix: '/analytics'});

  return app;
};