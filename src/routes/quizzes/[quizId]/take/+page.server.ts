import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { answer, attempt, attemptAnswer, question } from '$lib/server/db/schema';
import { getSessionOrRedirect } from '$lib/server/utils';
import { eq, and } from 'drizzle-orm';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	startAttempt: async ({ request, params }) => {
		const session = await getSessionOrRedirect(request, request.url);
		const quizId = params.quizId;

		if (!quizId || !session) {
			return fail(400, { success: false, message: 'Quiz ID and user ID are required' });
		}

		const newAttempt = await db
			.insert(attempt)
			.values({
				quizId: quizId,
				userId: session.user.id,
				startedAt: new Date()
			})
			.returning();

		return {
			success: true,
			attempt: newAttempt[0]
		};
	},

	submitAnswer: async ({ request }) => {
		await getSessionOrRedirect(request, request.url);

		const formData = await request.formData();
		const attemptId = formData.get('attemptId');
		const questionId = formData.get('questionId');
		const answerId = formData.get('answerId');

		if (!attemptId || !questionId || !answerId) {
			return fail(400, {
				success: false,
				message: 'Attempt ID, question ID, and answer ID are required'
			});
		}

		const currentAttempt = await db.query.attempt.findFirst({
			where: eq(attempt.id, attemptId as string)
		});

		if (!currentAttempt) {
			return fail(400, { success: false, message: 'Attempt not found' });
		}

		const currentQuestion = await db.query.question.findFirst({
			where: eq(question.id, questionId as string)
		});

		if (!currentQuestion) {
			return fail(400, { success: false, message: 'Question not found' });
		}

		const currentAnswer = await db.query.answer.findFirst({
			where: eq(answer.id, answerId as string)
		});

		if (!currentAnswer) {
			return fail(400, { success: false, message: 'Answer not found' });
		}

		const isCorrect = currentAnswer.isCorrect;

		const previousAnswer = await db.query.attemptAnswer.findFirst({
			where: and(
				eq(attemptAnswer.attemptId, attemptId as string),
				eq(attemptAnswer.questionId, questionId as string)
			)
		});
		let newAttemptAnswer;
		if (previousAnswer) {
			newAttemptAnswer = await db
				.update(attemptAnswer)
				.set({
					answerId: answerId as string,
					isCorrect: isCorrect
				})
				.where(eq(attemptAnswer.id, previousAnswer.id))
				.returning();
		} else {
			newAttemptAnswer = await db
				.insert(attemptAnswer)
				.values({
					attemptId: attemptId as string,
					questionId: questionId as string,
					answerId: answerId as string,
					isCorrect: isCorrect
				})
				.returning();
		}
		return {
			success: true,
			attemptAnswer: newAttemptAnswer[0]
		};
	},

	endAttempt: async ({ request }) => {
		await getSessionOrRedirect(request, request.url);

		const formData = await request.formData();
		const attemptId = formData.get('attemptId');

		if (!attemptId) {
			return fail(400, { success: false, message: 'Attempt ID is required' });
		}

		const updatedAttempt = await db
			.update(attempt)
			.set({
				completedAt: new Date()
			})
			.where(eq(attempt.id, attemptId as string))
			.returning();

		if (!updatedAttempt || updatedAttempt.length === 0) {
			return fail(400, { success: false, message: 'Failed to end attempt' });
		}

		return {
			success: true,
			attempt: updatedAttempt[0]
		};
	}
} satisfies Actions;
