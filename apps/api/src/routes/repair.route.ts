import {repairCreateSchema, repairUpdateSchema, testReadingCreateSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {RepairService} from '../services/repair.service.js';

const repairParamsSchema = z.object({id: z.string().uuid()});
const repairReadingBodySchema = testReadingCreateSchema.omit({repairId: true});

export const repairRoutes: FastifyPluginAsync = async (app) => {
  const repairService = new RepairService(app.prisma);

  app.post(
      '/', {schema: {body: repairCreateSchema}}, async (request, reply) => {
        const created = await repairService.create(
            request.body as z.infer<typeof repairCreateSchema>);
        return reply.status(201).send(created);
      });

  app.patch(
      '/:id', {schema: {params: repairParamsSchema, body: repairUpdateSchema}},
      async (request) => {
        const {id} = request.params as z.infer<typeof repairParamsSchema>;
        return repairService.update(
            id, request.body as z.infer<typeof repairUpdateSchema>);
      });

  app.post(
      '/:id/readings',
      {schema: {params: repairParamsSchema, body: repairReadingBodySchema}},
      async (request, reply) => {
        const {id} = request.params as z.infer<typeof repairParamsSchema>;
        const reading = await repairService.addTestReading({
          ...(request.body as z.infer<typeof repairReadingBodySchema>),
          repairId: id
        });

        return reply.status(201).send(reading);
      });
};