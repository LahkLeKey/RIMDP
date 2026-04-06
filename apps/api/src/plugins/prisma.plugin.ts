import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '@prisma/client';
import fp from 'fastify-plugin';

export const prismaPlugin = fp(async (app) => {
  const connectionString = app.appEnv.DATABASE_URL;
  const adapter = new PrismaPg({connectionString});
  const prisma = new PrismaClient({adapter});

  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});