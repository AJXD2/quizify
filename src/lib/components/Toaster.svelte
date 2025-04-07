<script lang="ts">
	import { onMount } from 'svelte';
	import { toasts, setToastContext } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const { max = 5 }: { max?: number } = $props();

	let visibleToasts = $derived([...$toasts].slice(-max));

	// Initialize toast system
	onMount(() => {
		return () => {
			toasts.clear();
		};
	});
</script>

{#if $toasts.length}
	<div class="toast toast-start toast-bottom z-50">
		{#each visibleToasts as toast (toast.id)}
			<div
				animate:flip={{ duration: 200 }}
				in:fly={{ x: -100, y: 0, duration: 200 }}
				out:fade={{ duration: 150 }}
			>
				<Toast {toast} />
			</div>
		{/each}
	</div>
{/if}
