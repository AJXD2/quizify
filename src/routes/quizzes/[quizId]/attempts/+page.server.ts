import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSessionOrRedirect } from '$lib/server/utils';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { attempt, quiz } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params, request }) => {
	const session = await getSessionOrRedirect(request, `/quizzes/${params.quizId}/attempts`);

	const quizData = await db.query.quiz.findFirst({
		where: eq(quiz.id, params.quizId),
		with: {
			questions: {
				with: {
					answers: true
				}
			},
			attempts: true,
			creator: {
				columns: {
					id: true,
					username: true,
					image: true,
					displayUsername: true
				}
			}
		}
	});
	if (!quiz) {
		throw error(404, 'Quiz not found');
	}

	const userAttempts = await db.query.attempt.findMany({
		where: and(eq(attempt.quizId, params.quizId), eq(attempt.userId, session.user.id)),
		with: {
			answers: true,
			user: true,
			quiz: true
		}
	});

	return {
		quiz: quizData,
		userAttempts
	};
};
