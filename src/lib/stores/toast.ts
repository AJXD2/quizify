import type { IconifyIcon } from '@iconify/svelte';
import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
	id: string;
	type: ToastType;
	title?: string;
	message: string;
	icon?: IconifyIcon | string;
	duration?: number; // Duration in ms, default will be 3000ms
	action?: {
		label: string;
		callback: () => void;
	};
}

const defaultIcons: Record<ToastType, IconifyIcon | string> = {
	info: 'mdi:information',
	success: 'mdi:check-circle',
	warning: 'mdi:alert',
	error: 'mdi:alert-circle'
};

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	// Generate a unique ID for each toast
	const generateId = () => Math.random().toString(36).substring(2, 9);

	// Add a toast to the store
	function add(toast: Omit<Toast, 'id'>) {
		const id = generateId();
		const newToast = {
			id,
			...toast,
			duration: toast.duration || 3000,
			icon: toast.icon || defaultIcons[toast.type] || 'mdi:information'
		};

		update((toasts) => [...toasts, newToast]);

		// Auto-dismiss toast after duration
		if (newToast.duration > 0) {
			setTimeout(() => {
				remove(id);
			}, newToast.duration);
		}

		return id;
	}

	// Remove a toast from the store
	function remove(id: string) {
		update((toasts) => toasts.filter((toast) => toast.id !== id));
	}

	// Clear all toasts
	function clear() {
		update(() => []);
	}

	// Helper methods for different toast types
	function info(props: Omit<Toast, 'id' | 'type'>) {
		return add({ ...props, type: 'info' });
	}

	function success(props: Omit<Toast, 'id' | 'type'>) {
		return add({ ...props, type: 'success' });
	}

	function warning(props: Omit<Toast, 'id' | 'type'>) {
		return add({ ...props, type: 'warning' });
	}

	function error(props: Omit<Toast, 'id' | 'type'>) {
		return add({ ...props, type: 'error' });
	}

	return {
		subscribe,
		add,
		remove,
		clear,
		info,
		success,
		warning,
		error
	};
}

// Create the toast store
export const toasts = createToastStore();

// Context key for providing/consuming the toast store
const TOAST_CONTEXT_KEY = Symbol('toast-store');

// Function to set the toast context in a component
export function setToastContext() {
	setContext(TOAST_CONTEXT_KEY, toasts);
}

// Function to get the toast context in a component
export function getToastContext() {
	return getContext<ReturnType<typeof createToastStore>>(TOAST_CONTEXT_KEY);
}
