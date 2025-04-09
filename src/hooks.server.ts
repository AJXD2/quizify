import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
	const sessionData = await auth.api.getSession(event.request);

	if (sessionData) {
		event.locals.user = sessionData.user;
		event.locals.session = sessionData.session;
	}

	return svelteKitHandler({ event, resolve, auth });
}
