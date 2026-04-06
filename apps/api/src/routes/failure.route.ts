import {failureCreateSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {FailureService} from '../services/failure.service.js';

const failureQuerySchema =
    z.object({equipmentId: z.string().uuid().optional()});
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
  testReadings: z.array(z.object({
                   id: z.string().uuid(),
                   repairId: z.string().uuid(),
                   metric: z.string(),
                   value: z.number(),
                   unit: z.string(),
                   passed: z.boolean(),
                   recordedAt: z.string()
                 })).optional()
});
const failureResponseSchema = z.object({
  id: z.string().uuid(),
  equipmentId: z.string().uuid(),
  componentId: z.string().uuid().nullable().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  symptoms: z.string(),
  description: z.string(),
  occurredAt: z.string(),
  repairs: z.array(repairResponseSchema),
  equipment: z.object({
                id: z.string().uuid(),
                name: z.string(),
                model: z.string(),
                serialNumber: z.string(),
                location: z.string(),
                status: z.enum(['ACTIVE', 'DEPRECATED', 'PHASED_OUT']),
                createdAt: z.string(),
                updatedAt: z.string()
              }).optional(),
  component: z.object({
                id: z.string().uuid(),
                equipmentId: z.string().uuid(),
                name: z.string(),
                pcbReference: z.string(),
                partNumber: z.string().nullable().optional(),
                createdAt: z.string()
              })
                 .nullable()
                 .optional()
});

export const failureRoutes: FastifyPluginAsync = async (app) => {
  const failureService = new FailureService(app.prisma);

  app.get(
      '/', {
        schema: {
          tags: ['Failures'],
          summary: 'List failures',
          description: 'Returns failures, optionally filtered by equipment id.',
          querystring: failureQuerySchema,
          security: [{bearerAuth: []}],
          response: {200: z.array(failureResponseSchema)}
        }
      },
      async (request) => {
        const query = request.query as z.infer<typeof failureQuerySchema>;
        return failureService.list(query.equipmentId);
      });

  app.post(
      '/', {
        schema: {
          tags: ['Failures'],
          summary: 'Create failure',
          description:
              'Creates a new failure incident for equipment/component.',
          body: failureCreateSchema,
          security: [{bearerAuth: []}],
          response: {201: failureResponseSchema}
        }
      },
      async (request, reply) => {
        const created = await failureService.create(
            request.body as z.infer<typeof failureCreateSchema>);
        return reply.status(201).send(created);
      });
};