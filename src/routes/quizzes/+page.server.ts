import { db } from '$lib/server/db';
import { quiz } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { count, desc } from 'drizzle-orm';

export const load = (async ({ url }) => {
	let page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;
	if (isNaN(page) || page < 1) {
		page = 1;
	}

	const offset = (page - 1) * limit;

	// Direct query to get the quizzes with creators
	const quizzes = await db.query.quiz.findMany({
		orderBy: [desc(quiz.createdAt)],
		with: {
			creator: {
				columns: {
					id: true,
					username: true,
					image: true,
					displayUsername: true
				}
			},
			questions: {
				columns: {
					id: true
				}
			}
		},
		limit,
		offset,
		columns: {
			creatorId: false
		}
	});

	// Direct query to get total count
	const [{ value: totalCount }] = await db.select({ value: count() }).from(quiz);
	const totalPages = Math.ceil(totalCount / limit);

	return {
		quizzes,
		page,
		totalPages,
		totalCount
	};
}) satisfies PageServerLoad;
