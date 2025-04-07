import type { Session, User } from '$lib/auth';
import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export async function getSession(request: Request) {
	const session = await auth.api.getSession(request);
	if (!session?.user.id) {
		return null;
	}
	return session;
}

export async function getSessionOrRedirect(
	request: Request,
	redirectTo: string = '/'
): Promise<{ session: Session; user: User }> {
	const session = await getSession(request);
	if (!session) {
		throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
	}
	return session;
}
