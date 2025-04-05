<script lang="ts">
	import { goto } from '$app/navigation';
	import QuizCard from '$lib/components/QuizCard.svelte';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { quizzes, page, totalPages } = data;
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<h1
			class="from-primary to-secondary bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent"
		>
			Discover Quizzes
		</h1>
		<a href="/quizzes/create" class="btn btn-primary">
			<Icon icon="fa-solid:plus" />
			Create Quiz
		</a>
	</div>

	{#if quizzes.length === 0}
		<div class="bg-base-200 flex flex-col items-center gap-4 rounded-lg p-12">
			<i class="fas fa-book-open text-6xl text-gray-400"></i>
			<p class="text-center text-lg text-gray-500">
				No quizzes found yet. Be the first to <a
					href="/quizzes/create"
					class="link link-primary font-semibold">create one</a
				>!
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3">
			{#each quizzes as quiz}
				<QuizCard {quiz} />
			{/each}
		</div>
		<div class="mt-4 flex items-center justify-center gap-4">
			{#if page > 1}
				<button
					class="btn btn-primary btn-outline gap-2"
					onclick={() => goto(`/quizzes?page=${page - 1}`)}
				>
					<Icon icon="fa-solid:chevron-left" />
					Previous
				</button>
			{/if}
			<div class="join bg-base-200 rounded-lg px-4 py-2">
				<span class="text-sm">
					Page <span class="text-primary font-bold">{page}</span> of
					<span class="font-bold">{totalPages}</span>
				</span>
			</div>
			{#if page < totalPages}
				<button
					class="btn btn-primary btn-outline gap-2"
					onclick={() => goto(`/quizzes?page=${page + 1}`)}
				>
					Next
					<Icon icon="fa-solid:chevron-right" />
				</button>
			{/if}
		</div>
	{/if}
</div>
