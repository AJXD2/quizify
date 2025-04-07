import type { IconifyIcon } from '@iconify/svelte';
import { writable } from 'svelte/store';

type BannerType = 'info' | 'success' | 'warning' | 'error';

type Banner = {
	message: string;
	type: BannerType;
	icon?: IconifyIcon | string;
	action?: {
		label: string;
		callback: () => void;
	};
};

export const banner = writable<Banner | null>();
