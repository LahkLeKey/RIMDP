import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

export const authPlugin = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: app.appEnv.JWT_SECRET,
    sign: {expiresIn: app.appEnv.JWT_EXPIRES_IN}
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      void reply.status(401).send({message: 'Unauthorized'});
    }
  });
});