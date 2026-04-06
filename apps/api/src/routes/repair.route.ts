import {repairCreateSchema, repairUpdateSchema, testReadingCreateSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {RepairService} from '../services/repair.service.js';

const repairParamsSchema = z.object({id: z.string().uuid()});
const repairReadingBodySchema = testReadingCreateSchema.omit({repairId: true});

export const repairRoutes: FastifyPluginAsync = async (app) => {
  const repairService = new RepairService(app.prisma);

  app.post(
      '/', {
        schema: {
          tags: ['Repairs'],
          summary: 'Create repair',
          description: 'Creates a repair workflow record for a failure.',
          body: repairCreateSchema,
          security: [{bearerAuth: []}]
        }
      },
      async (request, reply) => {
        const created = await repairService.create(
            request.body as z.infer<typeof repairCreateSchema>);
        return reply.status(201).send(created);
      });

  app.patch(
      '/:id', {
        schema: {
          tags: ['Repairs'],
          summary: 'Update repair',
          description: 'Updates status and notes of an existing repair.',
          params: repairParamsSchema,
          body: repairUpdateSchema,
          security: [{bearerAuth: []}]
        }
      },
      async (request) => {
        const {id} = request.params as z.infer<typeof repairParamsSchema>;
        return repairService.update(
            id, request.body as z.infer<typeof repairUpdateSchema>);
      });

  app.post(
      '/:id/readings', {
        schema: {
          tags: ['Repairs'],
          summary: 'Add repair test reading',
          description:
              'Adds a telemetry/test reading linked to a repair workflow step.',
          params: repairParamsSchema,
          body: repairReadingBodySchema,
          security: [{bearerAuth: []}]
        }
      },
      async (request, reply) => {
        const {id} = request.params as z.infer<typeof repairParamsSchema>;
        const reading = await repairService.addTestReading({
          ...(request.body as z.infer<typeof repairReadingBodySchema>),
          repairId: id
        });

        return reply.status(201).send(reading);
      });
};