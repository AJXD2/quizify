import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { answer, attempt, attemptAnswer, question } from '$lib/server/db/schema';
import { getSessionOrRedirect } from '$lib/utils';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;
export const actions = {
	startAttempt: async ({ request, params }) => {
		const session = await getSessionOrRedirect(request, request.url);
		const quizId = params.quizId;

		if (!quizId || !session) {
			return fail(400, { message: 'Quiz ID and user ID are required' });
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
			return fail(400, { message: 'Attempt ID, question ID, and answer ID are required' });
		}

		const currentAttempt = await db.query.attempt.findFirst({
			where: eq(attempt.id, attemptId as string)
		});

		if (!currentAttempt) {
			return fail(400, { message: 'Attempt not found' });
		}

		const currentQuestion = await db.query.question.findFirst({
			where: eq(question.id, questionId as string)
		});

		if (!currentQuestion) {
			return fail(400, { message: 'Question not found' });
		}

		const currentAnswer = await db.query.answer.findFirst({
			where: eq(answer.id, answerId as string)
		});

		if (!currentAnswer) {
			return fail(400, { message: 'Answer not found' });
		}

		const isCorrect = currentAnswer.isCorrect;

		const newAttemptAnswer = await db
			.insert(attemptAnswer)
			.values({
				attemptId: attemptId as string,
				questionId: questionId as string,
				answerId: answerId as string,
				isCorrect: isCorrect
			})
			.returning();

		return {
			success: true,
			attemptAnswer: newAttemptAnswer[0]
		};
	}
};
