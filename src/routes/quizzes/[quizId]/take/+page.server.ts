import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { attempt, attemptAnswer, answer } from '$lib/server/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

export const load = (async ({ params, locals }) => {
	const { user } = locals;
	if (!user) {
		throw redirect(302, '/login?redirect=/quizzes/' + params.quizId + '/take');
	}
	// Direct query to get active attempt
	const activeAttempt = await db.query.attempt.findFirst({
		where: and(
			eq(attempt.userId, user.id),
			eq(attempt.quizId, params.quizId),
			isNull(attempt.completedAt)
		),
		with: {
			answers: {
				with: {
					question: true,
					answer: true
				}
			}
		}
	});

	return {
		activeAttempt
	};
}) satisfies PageServerLoad;

export const actions = {
	startAttempt: async ({ params, locals }) => {
		const { user } = locals;
		if (!user) {
			return fail(401, { success: false, message: 'Unauthorized' });
		}

		const quizId = params.quizId;

		if (!quizId) {
			return fail(400, { success: false, message: 'Quiz ID is required' });
		}

		// Direct query to create new attempt
		const [newAttempt] = await db
			.insert(attempt)
			.values({
				userId: user.id,
				quizId,
				startedAt: new Date()
			})
			.returning();

		return {
			success: true,
			attempt: newAttempt
		};
	},

	submitAnswer: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) {
			return fail(401, { success: false, message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const attemptId = formData.get('attemptId') as string;
		const questionId = formData.get('questionId') as string;
		const answerId = formData.get('answerId') as string;

		if (!attemptId || !questionId || !answerId) {
			return fail(400, {
				success: false,
				message: 'Attempt ID, question ID, and answer ID are required'
			});
		}

		// Direct query to check if the attempt exists and belongs to the user
		const currentAttempt = await db.query.attempt.findFirst({
			where: and(eq(attempt.id, attemptId), eq(attempt.userId, user.id)),
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
				},
				quiz: {
					with: {
						questions: {
							with: {
								answers: true
							}
						}
					}
				}
			}
		});

		if (!currentAttempt) {
			return fail(400, { success: false, message: 'Attempt not found' });
		}

		// Direct query to get the selected answer
		const selectedAnswer = await db.query.answer.findFirst({
			where: eq(answer.id, answerId)
		});

		if (!selectedAnswer) {
			return fail(400, { success: false, message: 'Answer not found' });
		}

		// Direct query to submit the answer
		const [submittedAnswer] = await db
			.insert(attemptAnswer)
			.values({
				attemptId,
				questionId,
				answerId,
				isCorrect: selectedAnswer.isCorrect
			})
			.returning();

		return {
			success: true,
			attemptAnswer: submittedAnswer
		};
	},

	endAttempt: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) {
			return fail(401, { success: false, message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const attemptId = formData.get('attemptId') as string;

		if (!attemptId) {
			return fail(400, { success: false, message: 'Attempt ID is required' });
		}
		const currentAttempt = await db.query.attempt.findFirst({
			where: eq(attempt.id, attemptId)
		});

		if (!currentAttempt) {
			return fail(400, { success: false, message: 'Attempt not found' });
		}
		// Direct query to get all answers for this attempt
		const answers = await db.query.attemptAnswer.findMany({
			where: eq(attemptAnswer.attemptId, attemptId)
		});

		const totalQuestions = answers.length;
		const correctAnswers = answers.filter((a) => a.isCorrect).length;
		const score = Math.round((correctAnswers / totalQuestions) * 100);

		// Direct query to update the attempt
		const [updatedAttempt] = await db
			.update(attempt)
			.set({
				completedAt: new Date(),
				score,
				timeSpent: new Date().getTime() - currentAttempt.startedAt.getTime()
			})
			.where(eq(attempt.id, attemptId))
			.returning();

		if (!updatedAttempt) {
			return fail(400, { success: false, message: 'Failed to end attempt' });
		}

		return {
			success: true,
			attempt: updatedAttempt
		};
	}
} satisfies Actions;
