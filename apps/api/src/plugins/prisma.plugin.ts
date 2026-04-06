import {PrismaClient} from '@prisma/client';
import fp from 'fastify-plugin';

export const prisma = new PrismaClient();

export const prismaPlugin = fp(async (app) => {
  await prisma.$connect();
  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});