<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const { max = 5 }: { max?: number } = $props();

	// Reactive statement to derive visible toasts
	let visibleToasts = $derived([...$toasts].slice(-max));

	// Clear toasts when component is destroyed
	$effect(() => {
		return () => {
			toasts.clear();
		};
	});
</script>

{#if $toasts.length}
	<div class="toast-container fixed top-16 z-50 flex flex-col gap-2 px-4 sm:items-end">
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
