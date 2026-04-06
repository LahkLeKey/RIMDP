import fp from 'fastify-plugin';
import {ZodError} from 'zod';

export const errorHandlerPlugin = fp(async (app) => {
  app.setErrorHandler((error: unknown, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send(
          {message: 'Validation error', issues: error.issues});
    }

    const typedError = error as {
      statusCode?: number;
      message?: string
    };

    if (typedError.statusCode) {
      return reply.status(typedError.statusCode).send({
        message: typedError.message ?? 'Request error'
      });
    }

    return reply.status(500).send({message: 'Internal server error'});
  });
});