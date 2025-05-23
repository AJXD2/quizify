import { redirect } from '@sveltejs/kit';
import type { ToastType } from './stores/toast';

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
	const hours = Math.floor(diffMs / 3600000);
	const minutes = Math.floor((diffMs % 3600000) / 60000);
	const seconds = Math.floor((diffMs % 60000) / 1000);

	if (hours > 0) {
		return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
	} else if (minutes > 0) {
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
	} else {
		return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
	}
}

/**
 * Get the current tailwind screen size
 */
export function getScreenSize(): string {
	const width = window.innerWidth;
	return width < 640 ? 'sm' : width < 768 ? 'md' : width < 1024 ? 'lg' : 'xl';
}

export function redirectWithMessage(redirectTo: string, message: string, messageType: ToastType) {
	const url = new URL(redirectTo);
	url.searchParams.set('message', message);
	url.searchParams.set('messageType', messageType);
	return redirect(302, url.toString());
}

export function loginRedirect(redirectTo: string) {
	return redirect(
		302,
		`/auth/login?message=${encodeURIComponent('You must be logged in to access this page')}&messageType=error&redirectTo=${encodeURIComponent(redirectTo)}`
	);
}
