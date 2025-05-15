import { json } from '@sveltejs/kit';
import { auth } from '$lib/auth';

export async function GET({ request }) {
	const session = await auth.api.getSession(request);
	
	if (!session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;

	if (!user.image) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`
			}
		});
	}

	try {
		const response = await fetch(user.image);
		const imageBuffer = await response.arrayBuffer();

		return new Response(imageBuffer, {
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
				'Cache-Control': 'public'
			}
		});
	} catch (error) {
		console.error('Error proxying avatar image:', error);
		return new Response(null, {
			status: 302,
			headers: {
				Location: `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`
			}
		});
	}
}
