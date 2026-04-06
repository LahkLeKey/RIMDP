import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

const loginSchema =
    z.object({username: z.string().min(1), password: z.string().min(1)});

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/login', {schema: {body: loginSchema}}, async (request, reply) => {
    const {username, password} = request.body as z.infer<typeof loginSchema>;

    if (username !== 'admin' || password !== 'admin123') {
      return reply.status(401).send({message: 'Invalid credentials'});
    }

    const token = await reply.jwtSign({sub: 'admin-user', role: 'admin'});
    return {token};
  });
};