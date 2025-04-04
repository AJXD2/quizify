import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
	DATABASE_URL: z.string().url().describe('The database URL'),
	NODE_ENV: z.enum(['development', 'production']).describe('The environment'),
	BETTER_AUTH_SECRET: z.string().describe('The better auth secret'),
	BETTER_AUTH_URL: z.string().url().describe('The better auth URL'),
	GOOGLE_CLIENT_ID: z.string().describe('The better auth google client ID'),
	GOOGLE_CLIENT_SECRET: z.string().describe('The better auth google client secret'),
	DISCORD_CLIENT_ID: z.string().describe('The discord client ID'),
	DISCORD_CLIENT_SECRET: z.string().describe('The discord client secret')
});

export const env = envSchema.parse(process.env);
