import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { attempt } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	forfeitAttempt: async ({ request }) => {
		const formData = await request.formData();
		const attemptId = formData.get('attemptId');

		if (!attemptId || typeof attemptId !== 'string') {
			return fail(400, { message: 'Invalid attempt ID' });
		}

		await db.delete(attempt).where(eq(attempt.id, attemptId));

		return { success: true };
	}
};
