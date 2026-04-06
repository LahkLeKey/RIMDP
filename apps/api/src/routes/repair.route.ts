import {repairCreateSchema, repairUpdateSchema, testReadingCreateSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {RepairService} from '../services/repair.service.js';

const repairParamsSchema = z.object({id: z.string().uuid()});
const repairReadingBodySchema = testReadingCreateSchema.omit({repairId: true});
const testReadingResponseSchema = z.object({
  id: z.string().uuid(),
  repairId: z.string().uuid(),
  metric: z.string(),
  value: z.number(),
  unit: z.string(),
  passed: z.boolean(),
  recordedAt: z.string()
});
const failureSummarySchema = z.object({
  id: z.string().uuid(),
  equipmentId: z.string().uuid(),
  componentId: z.string().uuid().nullable().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  symptoms: z.string(),
  description: z.string(),
  occurredAt: z.string()
});
const repairResponseSchema = z.object({
  id: z.string().uuid(),
  failureId: z.string().uuid(),
  technician: z.string(),
  notes: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  rootCause: z.string().nullable().optional(),
  correctiveAction: z.string().nullable().optional(),
  startedAt: z.string(),
  completedAt: z.string().nullable().optional(),
  failure: failureSummarySchema.optional(),
  testReadings: z.array(testReadingResponseSchema).optional()
});

export const repairRoutes: FastifyPluginAsync = async (app) => {
  const repairService = new RepairService(app.prisma);

  app.post(
      '/', {
        schema: {
          tags: ['Repairs'],
          summary: 'Create repair',
          description: 'Creates a repair workflow record for a failure.',
          body: repairCreateSchema,
          security: [{bearerAuth: []}],
          response: {201: repairResponseSchema}
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
          security: [{bearerAuth: []}],
          response: {200: repairResponseSchema}
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
          security: [{bearerAuth: []}],
          response: {201: testReadingResponseSchema}
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