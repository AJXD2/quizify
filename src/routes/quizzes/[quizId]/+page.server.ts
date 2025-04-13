import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { attempt } from '$lib/server/db/schema';

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
	}
};
