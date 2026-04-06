import type {PrismaClient} from '@prisma/client';
import type {FastifyReply, FastifyRequest} from 'fastify';

import type {AppEnv} from '../utils/env.js';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    appEnv: AppEnv;
    authenticate:
        (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    user: {sub: string; role: string;};
  }
}