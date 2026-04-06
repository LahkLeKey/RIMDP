import {componentBaseSchema, equipmentBaseSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {EquipmentService} from '../services/equipment.service.js';

const paramsSchema = z.object({id: z.string().uuid()});

const equipmentCreateSchema = equipmentBaseSchema.extend(
    {components: z.array(componentBaseSchema).optional()});

const equipmentUpdateSchema = equipmentBaseSchema.partial();
const errorSchema = z.object({message: z.string()});
const componentResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  pcbReference: z.string(),
  partNumber: z.string().nullable().optional()
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
  completedAt: z.string().nullable().optional()
});
const failureResponseSchema = z.object({
  id: z.string().uuid(),
  equipmentId: z.string().uuid(),
  componentId: z.string().uuid().nullable().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  symptoms: z.string(),
  description: z.string(),
  occurredAt: z.string(),
  repairs: z.array(repairResponseSchema).optional()
});
const equipmentResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  model: z.string(),
  serialNumber: z.string(),
  location: z.string(),
  status: z.enum(['ACTIVE', 'DEPRECATED', 'PHASED_OUT']),
  createdAt: z.string(),
  updatedAt: z.string(),
  components: z.array(componentResponseSchema).optional(),
  failures: z.array(failureResponseSchema).optional()
});

export const equipmentRoutes: FastifyPluginAsync = async (app) => {
  const equipmentService = new EquipmentService(app.prisma);

  app.get(
      '/', {
        schema: {
          tags: ['Equipment'],
          summary: 'List equipment',
          description:
              'Returns all equipment with related failures and repairs.',
          security: [{bearerAuth: []}],
          response: {200: z.array(equipmentResponseSchema)}
        }
      },
      async () => equipmentService.list());

  app.get(
      '/:id', {
        schema: {
          tags: ['Equipment'],
          summary: 'Get equipment by id',
          description: 'Returns one equipment record with timeline details.',
          params: paramsSchema,
          security: [{bearerAuth: []}],
          response: {200: equipmentResponseSchema, 404: errorSchema}
        }
      },
      async (request, reply) => {
        const {id} = request.params as z.infer<typeof paramsSchema>;
        const equipment = await equipmentService.detail(id);
        if (!equipment) {
          return reply.status(404).send({message: 'Equipment not found'});
        }
        return equipment;
      });

  app.post(
      '/', {
        schema: {
          tags: ['Equipment'],
          summary: 'Create equipment',
          description:
              'Creates a new equipment record and optional components.',
          body: equipmentCreateSchema,
          security: [{bearerAuth: []}],
          response: {201: equipmentResponseSchema}
        }
      },
      async (request, reply) => {
        const created = await equipmentService.create(
            request.body as z.infer<typeof equipmentCreateSchema>);
        return reply.status(201).send(created);
      });

  app.put(
      '/:id', {
        schema: {
          tags: ['Equipment'],
          summary: 'Update equipment',
          description: 'Updates an existing equipment record.',
          params: paramsSchema,
          body: equipmentUpdateSchema,
          security: [{bearerAuth: []}],
          response: {200: equipmentResponseSchema}
        }
      },
      async (request) => {
        const {id} = request.params as z.infer<typeof paramsSchema>;
        return equipmentService.update(
            id, request.body as z.infer<typeof equipmentUpdateSchema>);
      });

  app.delete(
      '/:id', {
        schema: {
          tags: ['Equipment'],
          summary: 'Delete equipment',
          description: 'Deletes an equipment record by id.',
          params: paramsSchema,
          security: [{bearerAuth: []}],
          response: {204: z.null().optional()}
        }
      },
      async (request, reply) => {
        const {id} = request.params as z.infer<typeof paramsSchema>;
        await equipmentService.remove(id);
        return reply.status(204).send();
      });
};