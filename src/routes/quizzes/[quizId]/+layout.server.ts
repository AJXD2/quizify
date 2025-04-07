import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { attempt, quiz } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { auth } from '$lib/auth';

export const load = (async ({ params, request }) => {
	const session = await auth.api.getSession(request);

	const currentQuiz = await db.query.quiz
		.findFirst({
			where: eq(quiz.id, params.quizId),
			with: {
				creator: {
					columns: {
						username: true,
						image: true
					}
				},
				questions: {
					with: {
						answers: {
							columns: {
								isCorrect: false
							}
						}
					}
				},
				attempts: {
					columns: {
						startedAt: true,
						completedAt: true
					},
					with: {
						user: {
							columns: {
								username: true,
								image: true
							}
						}
					}
				}
			}
		})
		.catch(() => {
			throw error(404, 'Quiz not found');
		});
	const userAttempts = await db.query.attempt.findMany({
		where: session?.user.id
			? and(eq(attempt.quizId, params.quizId), eq(attempt.userId, session.user.id))
			: eq(attempt.quizId, params.quizId),
		with: {
			user: true
		}
	});

	if (!currentQuiz) {
		throw error(404, 'Quiz not found');
	}

	return {
		quiz: currentQuiz,
		userAttempts
	};
}) satisfies LayoutServerLoad;
