import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSession, getSessionOrRedirect } from '$lib/server/utils';
import { attemptService, quizService } from '$lib/server/db/services';

export const load = (async ({ params, request }) => {
	const session = await getSessionOrRedirect(request, request.url);

	const activeAttempt = await attemptService.getActiveAttempt(session.user.id, params.quizId);

	return {
		activeAttempt
	};
}) satisfies PageServerLoad;

export const actions = {
	startAttempt: async ({ request, params }) => {
		const session = await getSession(request);
		if (!session) {
			return fail(401, { success: false, message: 'Unauthorized' });
		}

		const quizId = params.quizId;

		if (!quizId) {
			return fail(400, { success: false, message: 'Quiz ID is required' });
		}

		const newAttempt = await attemptService.createAttempt(session.user.id, quizId);

		return {
			success: true,
			attempt: newAttempt
		};
	},

	submitAnswer: async ({ request }) => {
		const session = await getSession(request);
		if (!session) {
			return fail(401, { success: false, message: 'Unauthorized' });
		}

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

		const currentAttempt = await quizService.findAttemptWithAnswers(
			attemptId as string,
			session.user.id
		);

		if (!currentAttempt) {
			return fail(400, { success: false, message: 'Attempt not found' });
		}

		const answer = await attemptService.submitAnswer(
			attemptId as string,
			questionId as string,
			answerId as string
		);

		return {
			success: true,
			attemptAnswer: answer
		};
	},

	endAttempt: async ({ request }) => {
		const session = await getSession(request);
		if (!session) {
			return fail(401, { success: false, message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const attemptId = formData.get('attemptId');

		if (!attemptId) {
			return fail(400, { success: false, message: 'Attempt ID is required' });
		}

		const updatedAttempt = await attemptService.completeAttempt(attemptId as string);

		if (!updatedAttempt) {
			return fail(400, { success: false, message: 'Failed to end attempt' });
		}

		return {
			success: true,
			attempt: updatedAttempt
		};
	}
} satisfies Actions;
