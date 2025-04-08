import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSessionOrRedirect } from '$lib/server/utils';
import { quizService } from '$lib/server/db/services';

export const load: PageServerLoad = async ({ params, request }) => {
	const session = await getSessionOrRedirect(request, request.url);

	const quiz = await quizService.findQuizWithQuestions(params.quizId);
	if (!quiz) {
		throw error(404, 'Quiz not found');
	}

	const userAttempts = await quizService.findUserAttempts(params.quizId, session.user.id);

	return {
		quiz,
		userAttempts
	};
};
