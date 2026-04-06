import {failureCreateSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {FailureService} from '../services/failure.service.js';

const failureQuerySchema =
    z.object({equipmentId: z.string().uuid().optional()});

export const failureRoutes: FastifyPluginAsync = async (app) => {
  const failureService = new FailureService(app.prisma);

  app.get('/', {schema: {querystring: failureQuerySchema}}, async (request) => {
    const query = request.query as z.infer<typeof failureQuerySchema>;
    return failureService.list(query.equipmentId);
  });

  app.post(
      '/',
      {preHandler: [app.authenticate], schema: {body: failureCreateSchema}},
      async (request, reply) => {
        const created = await failureService.create(
            request.body as z.infer<typeof failureCreateSchema>);
        return reply.status(201).send(created);
      });
};