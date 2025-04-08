import { quizService } from '$lib/server/db/services';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	let page = parseInt(url.searchParams.get('page') || '1');
	if (isNaN(page) || page < 1) {
		page = 1;
	}

	const { quizzes, totalPages } = await quizService.listQuizzes(page);

	return {
		quizzes,
		page,
		totalPages
	};
}) satisfies PageServerLoad;
