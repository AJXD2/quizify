import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { quiz, attempt } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { getSessionOrRedirect } from '$lib/server/utils';
export const load: PageServerLoad = async ({ params, request }) => {
	const session = await getSessionOrRedirect(request, request.url);
	const quizData = await db.query.quiz.findFirst({
		where: eq(quiz.id, params.quizId),
		with: {
			questions: {
				with: { answers: true }
			}
		}
	});

	if (!quizData) {
		throw error(404, 'Quiz not found');
	}

	const userAttempts = await db.query.attempt.findMany({
		where: and(eq(attempt.quizId, params.quizId), eq(attempt.userId, session.user.id)),
		with: {
			answers: true,
			user: {
				columns: {
					image: true,
					username: true
				}
			}
		}
	});

	return {
		quiz: quizData,
		userAttempts
	};
};
