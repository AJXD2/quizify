import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { attempt, quiz } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
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

	const attemptData = await db.query.attempt.findFirst({
		where: eq(attempt.id, params.attemptId),
		with: {
			answers: true,
			user: true,
			quiz: true
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
