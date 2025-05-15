import { getSessionOrRedirect } from '$lib/server/utils';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ request }) => {
	const session = await getSessionOrRedirect(request, '/account');
	return {
		user: session.user
	};
}) satisfies LayoutServerLoad;
