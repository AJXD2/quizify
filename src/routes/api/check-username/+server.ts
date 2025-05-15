import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ url }) {
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ available: false, error: 'Username is required' }, { status: 400 });
	}

	if (username.length < 3) {
		return json({ available: false, error: 'Username must be at least 3 characters' });
	}

	if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
		return json({
			available: false,
			error: 'Username can only contain letters, numbers, underscores, and hyphens'
		});
	}

	const existingUser = await db.query.user.findFirst({
		where: eq(user.username, username),
		columns: { id: true }
	});

	return json({
		available: !existingUser,
		error: existingUser ? 'Username is already taken' : undefined
	});
}
