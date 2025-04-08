<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Toast } from '$lib/stores/toast';
	import { toasts } from '$lib/stores/toast';

	const { toast }: { toast: Toast } = $props();

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
	class="alert alert-horizontal w-full"
	role="alert"
	class:alert-info={toast.type === 'info'}
	class:alert-success={toast.type === 'success'}
	class:alert-warning={toast.type === 'warning'}
	class:alert-error={toast.type === 'error'}
>
	<Icon icon={toast.icon || 'mdi:information'} class="h-6 w-6 shrink-0" />
	<div>
		<h3 class="font-bold">{toast.title}</h3>
		<div class="text-xs">{toast.message}</div>
	</div>
	{#if toast.action}
		<button class="btn btn-sm" onclick={handleAction}>{toast.action.label}</button>
	{/if}
</div>
