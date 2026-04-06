import {PrismaClient} from '@prisma/client';
import fp from 'fastify-plugin';

export const prisma = new PrismaClient();

export const prismaPlugin = fp(async (app) => {
  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});