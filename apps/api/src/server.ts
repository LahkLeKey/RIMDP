import {buildApp} from './app.js';
import {env} from './utils/env.js';

const app = buildApp();

const start = async () => {
  try {
    await app.listen({port: env.API_PORT, host: env.API_HOST});
    app.log.info(
        `RIMDP API listening at http://${env.API_HOST}:${env.API_PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();