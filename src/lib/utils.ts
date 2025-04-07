import { redirect } from '@sveltejs/kit';
import { auth, type Session, type User } from './auth';

/**
 * Fisher-Yates shuffle algorithm to randomize array order
 */
export function randomizeArray<T>(array: T[]): T[] {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

/**
 * Calculate the score as a percentage
 */
export function calculateScore(correct: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((correct / total) * 100);
}

/**
 * Format a date in a user-friendly way
 */
export function formatDate(date: Date | string | null): string {
	if (!date) return 'N/A';
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/**
 * Calculate time spent on a quiz
 */
export function calculateTimeSpent(startTime: Date | null, endTime: Date | null): string {
	if (!startTime || !endTime) return 'N/A';

	const diffMs = endTime.getTime() - startTime.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffSecs = Math.floor((diffMs % 60000) / 1000);

	if (diffMins < 1) {
		return `${diffSecs} seconds`;
	} else if (diffMins === 1) {
		return `1 minute ${diffSecs} seconds`;
	} else {
		return `${diffMins} minutes ${diffSecs} seconds`;
	}
}

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
