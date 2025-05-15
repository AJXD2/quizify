import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { count } from 'drizzle-orm';
import { quiz, user } from '$lib/server/db/schema';
export const load = (async () => {
	// Get stats
	const stats = {
		userCount: (await db.select({ count: count() }).from(user))[0].count,
		quizCount: (await db.select({ count: count() }).from(quiz))[0].count
	};

	return {
		stats
	};
}) satisfies PageServerLoad;
