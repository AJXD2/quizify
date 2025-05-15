import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';

const pool = neon(DATABASE_URL)

export const db = drizzle(pool, { schema });
