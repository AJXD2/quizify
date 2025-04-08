import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { attemptService } from '$lib/server/db/services';
import { getSession } from '$lib/server/utils';
export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	forfeitAttempt: async ({ request }) => {
		const session = await getSession(request);
		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const attemptId = formData.get('attemptId');

		if (!attemptId || typeof attemptId !== 'string') {
			return fail(400, { message: 'Invalid attempt ID' });
		}

		const result = await attemptService.forfeitAttempt(attemptId, session.user.id);

		if (!result) {
			return fail(400, { message: 'Failed to forfeit attempt' });
		}

		return { success: true };
	}
};
