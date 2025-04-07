import type { LayoutServerLoad } from './$types';
import { getSessionOrRedirect } from '$lib/server/utils';

export const load = (async ({ request }) => {
	const session = await getSessionOrRedirect(request, request.url);
	return {
		user: session.user
	};
}) satisfies LayoutServerLoad;
