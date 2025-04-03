import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../server/db';
import { twoFactor, username } from 'better-auth/plugins';
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	appName: 'quizify',
	plugins: [username(), twoFactor()]
});

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
