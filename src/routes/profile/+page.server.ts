import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user } = locals;
	if (!user) {
		throw redirect(302, '/auth/login?redirect=/profile');
	}
	redirect(302, '/user/' + user.username);
}) satisfies PageServerLoad;
