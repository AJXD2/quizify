import { db } from '$lib/server/db';
import { attempt } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load = (async ({ parent }) => {
	const { quiz } = await parent();
	const leaderboardEntries = await db.query.attempt.findMany({
		where: eq(attempt.quizId, quiz.id),
		orderBy: desc(attempt.score),
		limit: 10,
		with: {
			user: {
				columns: {
					id: true,
					username: true,
					image: true,
					displayUsername: true
				}
			},
			answers: true
		}
	});

	return {
		leaderboardEntries
	};
}) satisfies PageServerLoad;
