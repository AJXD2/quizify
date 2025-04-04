import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ url }) {
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ available: false, error: 'No username provided' }, { status: 400 });
	}

	if (username.length < 3) {
		return json({ available: false, error: 'Username must be at least 3 characters' });
	}

	try {
		const existingUser = await db.query.user.findFirst({
			where: eq(user.username, username)
		});

		return json({ available: !existingUser });
	} catch (error) {
		console.error('Error checking username:', error);
		return json({ available: false, error: 'Error checking username' }, { status: 500 });
	}
}
