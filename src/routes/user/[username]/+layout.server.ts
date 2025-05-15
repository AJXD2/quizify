import { db } from '$lib/server/db';
import { attempt, user } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
	const { username } = params;
	const { user: currentUser } = locals;
	const userProfile = await db.query.user.findFirst({
		where: eq(user.username, username),
		columns: {
			id: true,
			username: true,
			image: true,
			displayUsername: true
		},
		with: {
			quizzes: true,
			attempts: {
				limit: 10,
				orderBy: [desc(attempt.startedAt)],
				with: {
					quiz: true,
					answers: true
				}
			}
		}
	});
	if (!userProfile) {
		throw error(404, 'User not found');
	}
	return {
		userProfile,
		user: currentUser
	};
}) satisfies LayoutServerLoad;
