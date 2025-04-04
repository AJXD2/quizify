import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { count, desc } from 'drizzle-orm';
import { quiz } from '$lib/server/db/schema';
export const load = (async ({ url }) => {
	let page = parseInt(url.searchParams.get('page') || '1');
	if (isNaN(page) || page < 1) {
		page = 1;
	}
	const quizzes = await db.query.quiz.findMany({
		orderBy: [desc(quiz.createdAt)],
		with: {
			creator: {
				columns: {
					username: true,
					image: true
				}
			}
		},
		limit: 20,
		offset: (page - 1) * 20,
		columns: {
			creatorId: false
		}
	});
	const totalQuizzes = await db.select({ count: count() }).from(quiz);
	const totalPages = Math.ceil(totalQuizzes[0].count / 20);

	return { quizzes, page, totalPages };
}) satisfies PageServerLoad;
