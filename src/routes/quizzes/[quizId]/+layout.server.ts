import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import { quizService } from '$lib/server/db/services';

export const load = (async ({ params, request }) => {
	const session = await auth.api.getSession(request);

	const quiz = await quizService.findQuizWithAttemptsAndQuestions(params.quizId).catch(() => {
		throw error(404, 'Quiz not found');
	});

	if (!quiz) {
		throw error(404, 'Quiz not found');
	}

	const userAttempts = session?.user.id
		? await quizService.findUserAttempts(params.quizId, session.user.id)
		: [];

	return {
		quiz,
		userAttempts
	};
}) satisfies LayoutServerLoad;
