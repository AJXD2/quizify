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
				with: {
					answers: true
				}
			}
		}
	});

	if (!quizData) {
		throw error(404, 'Quiz not found');
	}

	const attemptData = await db.query.attempt.findFirst({
		where: and(eq(attempt.id, params.attemptId), eq(attempt.userId, session.user.id)),
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

	if (!attemptData) {
		throw error(404, 'Attempt not found');
	}

	return {
		quiz: quizData,
		attempt: attemptData
	};
};
