<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Toast } from '$lib/stores/toast';
	import { toasts } from '$lib/stores/toast';

	export let toast: Toast;

	function closeToast() {
		toasts.remove(toast.id);
	}

	function handleAction() {
		if (toast.action?.callback) {
			toast.action.callback();
		}
		closeToast();
	}
</script>

<div
	class="alert flex w-full max-w-md items-center gap-3 border-l-4 shadow-lg transition-all duration-300"
	role="alert"
	class:alert-info={toast.type === 'info'}
	class:alert-success={toast.type === 'success'}
	class:alert-warning={toast.type === 'warning'}
	class:alert-error={toast.type === 'error'}
>
	<Icon icon={toast.icon || 'mdi:information'} class="h-6 w-6 shrink-0" />
	<div class="flex-1">
		<h3 class="text-sm leading-snug font-semibold">{toast.title}</h3>
		<p class="text-xs">{toast.message}</p>
	</div>
	{#if toast.action}
		<button class="btn btn-sm btn-outline ml-auto" on:click={handleAction}>
			{toast.action.label}
		</button>
	{/if}
	<button class="btn btn-sm btn-ghost ml-2" on:click={closeToast}>
		<Icon icon="mdi:close" class="h-4 w-4" />
	</button>
</div>
