import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ params }) => {
    const { username } = params;

    const userData = await db.query.user.findFirst({
        where: eq(user.username, username),
        columns: {
            image: true,
        },
    });

    if (!userData) {
        return new Response('User not found', { status: 404 });
    }
    if (userData.image) {
        const response = await fetch(userData.image);
		const imageBuffer = await response.arrayBuffer();

		return new Response(imageBuffer, {
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
				'Cache-Control': 'public'
			}
		});
    } else {
        const response = await fetch(`https://api.dicebear.com/9.x/initials/svg?seed=${username}`);
		const imageBuffer = await response.arrayBuffer();

		return new Response(imageBuffer, {
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'image/svg+xml',
				'Cache-Control': 'public'
			}
		});
    }
};