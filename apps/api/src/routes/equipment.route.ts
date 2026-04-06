import {componentBaseSchema, equipmentBaseSchema} from '@rimdp/shared';
import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

import {EquipmentService} from '../services/equipment.service.js';

const paramsSchema = z.object({id: z.string().uuid()});

const equipmentCreateSchema = equipmentBaseSchema.extend(
    {components: z.array(componentBaseSchema).optional()});

const equipmentUpdateSchema = equipmentBaseSchema.partial();

export const equipmentRoutes: FastifyPluginAsync = async (app) => {
  const equipmentService = new EquipmentService(app.prisma);

  app.get('/', async () => equipmentService.list());

  app.get('/:id', {schema: {params: paramsSchema}}, async (request, reply) => {
    const {id} = request.params as z.infer<typeof paramsSchema>;
    const equipment = await equipmentService.detail(id);
    if (!equipment) {
      return reply.status(404).send({message: 'Equipment not found'});
    }
    return equipment;
  });

  app.post(
      '/',
      {schema: {body: equipmentCreateSchema}},
      async (request, reply) => {
        const created = await equipmentService.create(
            request.body as z.infer<typeof equipmentCreateSchema>);
        return reply.status(201).send(created);
      });

  app.put(
      '/:id', {
        schema: {params: paramsSchema, body: equipmentUpdateSchema}
      },
      async (request) => {
        const {id} = request.params as z.infer<typeof paramsSchema>;
        return equipmentService.update(
            id, request.body as z.infer<typeof equipmentUpdateSchema>);
      });

  app.delete(
      '/:id', {schema: {params: paramsSchema}},
      async (request, reply) => {
        const {id} = request.params as z.infer<typeof paramsSchema>;
        await equipmentService.remove(id);
        return reply.status(204).send();
      });
};