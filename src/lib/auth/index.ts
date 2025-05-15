import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../server/db';
import { twoFactor, username } from 'better-auth/plugins';
import { betterAuth } from 'better-auth';
import { env } from '../server/env';
import { sendEmail } from '$lib/server/email';

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
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		requireEmailVerification: true,
		async sendResetPassword(data) {
			await sendEmail(
				data.user.email,
				'Reset Password',
				`Click <a href="${data.url}">here</a> to reset your password`
			);
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		async sendVerificationEmail(data) {
			await sendEmail(
				data.user.email,
				'Verify Email',
				`Click <a href="${data.url}">here</a> to verify your email`
			);
		}
	},
	user: {
		changeEmail: {
			enabled: true,
			async sendChangeEmailVerification(data) {
				await sendEmail(
					data.user.email,
					'Change Email',
					`Click <a href="${data.url}">here</a> to change your email`
				);
			}
		},
		deleteUser: {
			enabled: true,
			async sendDeleteAccountVerification(data) {
				await sendEmail(
					data.user.email,
					'Delete Account',
					`Click <a href="${data.url}">here</a> to delete your account`
				);
			}
		}
	},

	url: env.VITE_APP_URL,
	secret: env.BETTER_AUTH_SECRET
});

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
