import type {FastifyPluginAsync} from 'fastify';
import {z} from 'zod';

const loginSchema =
    z.object({username: z.string().min(1), password: z.string().min(1)});
const loginSuccessSchema = z.object({token: z.string()});
const errorSchema = z.object({message: z.string()});

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
      '/login', {
        schema: {
          tags: ['Auth'],
          summary: 'Login and get JWT',
          description: 'Authenticates the user and returns a bearer token.',
          body: loginSchema,
          response: {200: loginSuccessSchema, 401: errorSchema}
        }
      },
      async (request, reply) => {
        const {username, password} =
            request.body as z.infer<typeof loginSchema>;

        if (username !== 'admin' || password !== 'admin123') {
          return reply.status(401).send({message: 'Invalid credentials'});
        }

        const token = await reply.jwtSign({sub: 'admin-user', role: 'admin'});
        return {token};
      });
};