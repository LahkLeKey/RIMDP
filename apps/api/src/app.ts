import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import {jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider} from 'fastify-type-provider-zod';

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

  app.register(swagger, {
    openapi: {
      info: {
        title: 'RIMDP API',
        description: 'Repair Intelligence & Maintenance Decision Platform API',
        version: '1.0.0'
      },
      servers: [{url: 'http://localhost:4000'}],
      components: {
        securitySchemes:
            {bearerAuth: {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}}
      }
    },
    transform: jsonSchemaTransform
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {docExpansion: 'list', deepLinking: false},
    staticCSP: true,
    transformSpecificationClone: true
  });

  app.get('/openapi.json', async () => app.swagger());

  app.addHook('onRequest', async (request, reply) => {
    const routePath = (request.url ?? '').split('?')[0] ?? '';
    const isPublicRoute = routePath === '/health' ||
        routePath === '/auth/login' || routePath === '/openapi.json' ||
        routePath.startsWith('/docs');

    if (isPublicRoute) {
      return;
    }

    await app.authenticate(request, reply);
  });

  app.get('/health', async () => ({ok: true}));
  app.register(authRoutes, {prefix: '/auth'});
  app.register(equipmentRoutes, {prefix: '/equipment'});
  app.register(failureRoutes, {prefix: '/failures'});
  app.register(repairRoutes, {prefix: '/repairs'});
  app.register(analyticsRoutes, {prefix: '/analytics'});

  return app;
};