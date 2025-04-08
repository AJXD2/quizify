import { json } from '@sveltejs/kit';
import { userService } from '$lib/server/db/services';

export async function GET({ url }) {
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ available: false, error: 'Username is required' }, { status: 400 });
	}

	const result = await userService.isUsernameAvailable(username);
	return json(result);
}
