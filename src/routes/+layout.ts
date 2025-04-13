import { toasts } from '$lib/stores/toast';
import type { ToastType } from '$lib/stores/toast';
import type { LayoutLoad } from './$types';

export const load = (async ({ url }) => {
	const message = url.searchParams.get('message');
	const messageType: ToastType = (url.searchParams.get('messageType') as ToastType) || 'info';

	if (message && messageType) {
		toasts.add({ message, type: messageType });
	}
	return {};
}) satisfies LayoutLoad;
