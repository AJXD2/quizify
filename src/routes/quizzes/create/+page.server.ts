import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { quiz } from '$lib/server/db/schema';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals;
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const timeLimit = data.get('timeLimit')
			? parseInt(data.get('timeLimit')?.toString() || '0')
			: null;
		const difficulty = data.get('difficulty')?.toString() as 'easy' | 'medium' | 'hard';
		const tags =
			data
				.get('tags')
				?.toString()
				.split(',')
				.map((tag) => tag.trim()) || [];
		const instructions = data.get('instructions')?.toString();

		if (!title) {
			return fail(400, { message: 'Title is required' });
		}

		try {
			const newQuiz = await db
				.insert(quiz)
				.values({
					title,
					description,
					timeLimit,
					difficulty,
					tags,
					instructions,
					creatorId: user.id,
					createdAt: new Date(),
					updatedAt: new Date()
				})
				.returning();

			return { success: true, quiz: newQuiz[0] };
		} catch {
			return fail(500, { message: 'Failed to create quiz' });
		}
	}
};
