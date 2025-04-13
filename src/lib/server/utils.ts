import type { Session, User } from '$lib/auth';
import { auth } from '$lib/auth';
import { loginRedirect } from '$lib/utils';

export async function getSessionOrRedirect(
	request: Request,
	redirectTo: string = '/'
): Promise<{ session: Session; user: User }> {
	const session = await auth.api.getSession(request);
	if (!session?.user.id) {
		throw loginRedirect(redirectTo);
	}
	return session;
}
