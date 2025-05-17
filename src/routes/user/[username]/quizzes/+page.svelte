<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	const { userProfile } = data;
</script>

<Seo
	title={`${userProfile?.displayUsername || userProfile?.username || 'User'}'s Quizzes - Quizify`}
	description={`Browse quizzes created by ${userProfile?.displayUsername || userProfile?.username || 'User'} on Quizify.`}
	url={page.url.href}
	image={userProfile?.image || '/logo.png'}
	type="website"
	keywords={`quizify, ${userProfile?.username}, created quizzes, user quizzes`}
/>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each userProfile.quizzes as quiz (quiz.id)}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{quiz.title}</h2>
				<p class="text-sm text-gray-500">{quiz.description}</p>
				<div class="card-actions mt-4 justify-end">
					<a href="/quiz/{quiz.id}" class="btn btn-primary">Play Quiz</a>
				</div>
			</div>
		</div>
	{/each}

	{#if userProfile.quizzes.length === 0}
		<div class="col-span-full py-8 text-center">
			<h3 class="mb-2 text-xl font-semibold">No quizzes yet</h3>
			<p class="text-gray-500">This user hasn't created any quizzes.</p>
		</div>
	{/if}
</div>
