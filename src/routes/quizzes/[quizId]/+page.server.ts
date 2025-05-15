import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { attempt, quiz } from '$lib/server/db/schema';

export const load = (async ({ locals }) => {
	const { user } = locals;
	return {
		user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	forfeitAttempt: async ({ request, locals }) => {
		const { session, user } = locals;
		if (!session || !user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const attemptId = formData.get('attemptId');

		if (!attemptId || typeof attemptId !== 'string') {
			return fail(400, { message: 'Invalid attempt ID' });
		}

		const result = await db
			.delete(attempt)
			.where(and(eq(attempt.id, attemptId), eq(attempt.userId, user.id)));

		if (!result) {
			return fail(400, { message: 'Failed to forfeit attempt' });
		}

		return { success: true };
	},
	deleteQuiz: async ({ locals, params }) => {
		const { session, user } = locals;
		if (!session || !user) {
			return fail(401, { message: 'Unauthorized' });
		}
		const quizId = params.quizId;
		if (!quizId) {
			return fail(400, { message: 'Invalid quiz ID' });
		}
		const quizData = await db.query.quiz.findFirst({
			where: eq(quiz.id, quizId)
		});
		if (!quizData) {
			return fail(404, { message: 'Quiz not found' });
		}
		if (user.id !== quizData.creatorId) {
			return fail(403, { message: 'Unauthorized' });
		}

		const result = await db.delete(quiz).where(eq(quiz.id, quizId));
		if (!result) {
			return fail(400, { message: 'Failed to delete quiz' });
		}
		return { success: true };
	}
};
