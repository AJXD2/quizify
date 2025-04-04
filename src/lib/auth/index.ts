import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../server/db';
import { twoFactor, username } from 'better-auth/plugins';
import { betterAuth } from 'better-auth';
import { env } from '../server/env';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		},
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET
		}
	},
	appName: 'quizify',
	plugins: [username(), twoFactor()],
	emailAndPassword: {
		enabled: true
	},
	url: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET
});

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
