import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { quiz, attempt } from '$lib/server/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const load = (async ({ params, locals }) => {
	const { user } = locals;
	const quizId = params.quizId;

	const quizData = await db.query.quiz
		.findFirst({
			where: eq(quiz.id, quizId),
			with: {
				questions: {
					with: { answers: true }
				},
				creator: {
					columns: {
						id: true,
						image: true,
						username: true,
						displayUsername: true
					}
				},
				attempts: true
			}
		})
		.catch(() => {
			throw error(404, 'Quiz not found');
		});

	if (!quizData) {
		throw error(404, 'Quiz not found');
	}

	const userAttempts = user?.id
		? await db.query.attempt.findMany({
				where: and(eq(attempt.quizId, quizId), eq(attempt.userId, user.id)),
				with: {
					answers: {
						with: {
							question: true,
							answer: true
						}
					},
					user: {
						columns: {
							id: true,
							image: true,
							username: true,
							displayUsername: true
						}
					}
				},
				orderBy: [desc(attempt.startedAt)]
			})
		: [];

	return {
		quiz: quizData,
		userAttempts
	};
}) satisfies LayoutServerLoad;
