import {componentBaseSchema, equipmentBaseSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {EquipmentService} from '../services/equipment.service.js';

const paramsSchema = z.object({id: z.string().uuid()});

const equipmentCreateSchema = equipmentBaseSchema.extend(
    {components: z.array(componentBaseSchema).optional()});

const equipmentUpdateSchema = equipmentBaseSchema.partial();
const errorSchema = z.object({message: z.string()});

export const equipmentRoutes: FastifyPluginAsync = async (app) => {
  const equipmentService = new EquipmentService(app.prisma);

  app.get(
      '/', {
        schema: {
          tags: ['Equipment'],
          summary: 'List equipment',
          description:
              'Returns all equipment with related failures and repairs.',
          security: [{bearerAuth: []}]
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
          response: {404: errorSchema}
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
          security: [{bearerAuth: []}]
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
          security: [{bearerAuth: []}]
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
          security: [{bearerAuth: []}]
        }
      },
      async (request, reply) => {
        const {id} = request.params as z.infer<typeof paramsSchema>;
        await equipmentService.remove(id);
        return reply.status(204).send();
      });
};