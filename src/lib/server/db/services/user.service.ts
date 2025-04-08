import { eq } from 'drizzle-orm';
import { db } from '..';
import { user } from '../schema';

type UserProfile = {
	id: string;
	username: string | null;
	displayUsername: string | null;
	image: string | null;
};

type UserDetails = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	username: string | null;
	displayUsername: string | null;
	twoFactorEnabled: boolean | null;
};

export const userService = {
	async findById(userId: string): Promise<UserDetails | null> {
		const result = await db.query.user.findFirst({
			where: eq(user.id, userId),
			columns: {
				id: true,
				name: true,
				email: true,
				emailVerified: true,
				image: true,
				username: true,
				displayUsername: true,
				twoFactorEnabled: true
			}
		});
		return result || null;
	},

	async findProfile(userId: string): Promise<UserProfile | null> {
		const result = await db.query.user.findFirst({
			where: eq(user.id, userId),
			columns: {
				id: true,
				username: true,
				displayUsername: true,
				image: true
			}
		});
		return result || null;
	},

	async findByEmail(email: string): Promise<UserDetails | null> {
		const result = await db.query.user.findFirst({
			where: eq(user.email, email),
			columns: {
				id: true,
				name: true,
				email: true,
				emailVerified: true,
				image: true,
				username: true,
				displayUsername: true,
				twoFactorEnabled: true
			}
		});
		return result || null;
	},

	async findByUsername(username: string): Promise<UserDetails | null> {
		const result = await db.query.user.findFirst({
			where: eq(user.username, username),
			columns: {
				id: true,
				name: true,
				email: true,
				emailVerified: true,
				image: true,
				username: true,
				displayUsername: true,
				twoFactorEnabled: true
			}
		});
		return result || null;
	},

	async updateProfile(
		userId: string,
		data: {
			username?: string;
			displayUsername?: string;
			image?: string;
			name?: string;
		}
	): Promise<UserProfile> {
		const [updated] = await db
			.update(user)
			.set({
				...data,
				updatedAt: new Date()
			})
			.where(eq(user.id, userId))
			.returning({
				id: user.id,
				username: user.username,
				displayUsername: user.displayUsername,
				image: user.image
			});
		return updated;
	},

	async updateEmail(userId: string, email: string, emailVerified: boolean = false): Promise<void> {
		await db
			.update(user)
			.set({
				email,
				emailVerified,
				updatedAt: new Date()
			})
			.where(eq(user.id, userId));
	},

	async verifyEmail(userId: string): Promise<void> {
		await db
			.update(user)
			.set({
				emailVerified: true,
				updatedAt: new Date()
			})
			.where(eq(user.id, userId));
	},

	async updateTwoFactorEnabled(userId: string, enabled: boolean): Promise<void> {
		await db
			.update(user)
			.set({
				twoFactorEnabled: enabled,
				updatedAt: new Date()
			})
			.where(eq(user.id, userId));
	},

	async isUsernameAvailable(username: string): Promise<{ available: boolean; error?: string }> {
		if (username.length < 3) {
			return { available: false, error: 'Username must be at least 3 characters' };
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
			return {
				available: false,
				error: 'Username can only contain letters, numbers, underscores, and hyphens'
			};
		}

		const existingUser = await db.query.user.findFirst({
			where: eq(user.username, username),
			columns: { id: true }
		});

		return {
			available: !existingUser,
			error: existingUser ? 'Username is already taken' : undefined
		};
	}
};
