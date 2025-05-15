<script lang="ts">
	import AttemptCard from '$lib/components/AttemptCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { userProfile } = data;
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each userProfile.attempts ?? [] as attempt (attempt.id)}
		<AttemptCard attempt={{ ...attempt, user: userProfile }} />
	{/each}

	{#if !userProfile.attempts?.length}
		<div class="col-span-full py-8 text-center">
			<h3 class="mb-2 text-xl font-semibold">No attempts yet</h3>
			<p class="text-gray-500">This user hasn't attempted any quizzes.</p>
		</div>
	{/if}
</div>
