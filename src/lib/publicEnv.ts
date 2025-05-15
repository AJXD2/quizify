// src/lib/env/public.ts
import { z } from 'zod';

const publicEnvSchema = z.object({
	VITE_APP_URL: z.string().url()
});

export const publicEnv = publicEnvSchema.parse(import.meta.env);
