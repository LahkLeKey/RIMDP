import fp from 'fastify-plugin';

import {env} from '../utils/env.js';

export const envPlugin = fp(async (app) => {
  app.decorate('appEnv', env);
});