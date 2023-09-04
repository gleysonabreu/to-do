import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_DATABASE: z.string(),
  DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;
