import 'dotenv/config';

import {z} from 'zod';

const DEFAULT_DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5432/rimdp';
const DEFAULT_JWT_SECRET = 'rimdp-local-dev-secret-12345';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = DEFAULT_JWT_SECRET;
}

const envSchema = z.object({
  DATABASE_URL: z.string().url().default(DEFAULT_DATABASE_URL),
  API_PORT: z.coerce.number().default(4000),
  API_HOST: z.string().default('0.0.0.0'),
  JWT_SECRET: z.string().min(16).default(DEFAULT_JWT_SECRET),
  JWT_EXPIRES_IN: z.string().default('1d'),
  VITE_API_URL: z.string().optional()
});

export type AppEnv = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);