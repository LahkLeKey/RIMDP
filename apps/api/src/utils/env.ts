import 'dotenv/config';

import {z} from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_PORT: z.coerce.number().default(4000),
  API_HOST: z.string().default('0.0.0.0'),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('1d'),
  VITE_API_URL: z.string().optional()
});

export type AppEnv = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);