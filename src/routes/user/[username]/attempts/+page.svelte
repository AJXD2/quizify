<script lang="ts">
	import AttemptCard from '$lib/components/AttemptCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	const { userProfile } = data;
</script>

<Seo
	title={`${userProfile?.displayUsername || userProfile?.username || 'User'}'s Quiz Attempts - Quizify`}
	description={`View all quiz attempts by ${userProfile?.displayUsername || userProfile?.username || 'User'} on Quizify.`}
	url={page.url.href}
	image={userProfile?.image || '/logo.png'}
	type="website"
	keywords={`quizify, ${userProfile?.username}, quiz attempts, user activity`}
/>

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
