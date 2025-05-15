<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import QuizCard from '$lib/components/QuizCard.svelte';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	// Reactive derivations from the data prop
	let quizzes = $derived(data.quizzes);
	let currentPage = $derived(data.page);
	let totalPages = $derived(data.totalPages);

	let searchQuery = $state(page.url.searchParams.get('q') || '');
	let selectedDifficulty = $state(page.url.searchParams.get('difficulty') || '');
	let sortBy = $state(page.url.searchParams.get('sort') || 'newest');

	let debounceTimeout = $state<ReturnType<typeof setTimeout> | null>(null);
	let searchInputElement = $state<HTMLInputElement | null>(null);
	let focusSearchAfterNavigate = $state(false);
	let isLoading = $state(false);

	function updateFilters(triggeredBySearchInput = false) {
		isLoading = true;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = setTimeout(() => {
			const params = new URLSearchParams();
			if (searchQuery) params.set('q', searchQuery);
			if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
			if (sortBy) params.set('sort', sortBy);
			params.set('page', '1');

			if (triggeredBySearchInput && searchQuery) {
				focusSearchAfterNavigate = true;
			}

			goto(`/quizzes?${params.toString()}`, { invalidateAll: true });
			isLoading = false;
		}, 500); // 500ms debounce
	}

	afterNavigate(() => {
		if (focusSearchAfterNavigate && searchInputElement) {
			searchInputElement.focus();
			const length = searchInputElement.value.length;
			searchInputElement.setSelectionRange(length, length);
			focusSearchAfterNavigate = false;
		}
	});
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<h1
			class="from-primary to-accent bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent"
		>
			Discover Quizzes
		</h1>
		<a href="/quizzes/create" class="btn btn-primary">
			<Icon icon="fa-solid:plus" />
			Create Quiz
		</a>
	</div>

	<!-- Search and Filters -->
	<div class="rounded-box bg-base-200">
		<div class="bg-base-300 card rounded-b-none p-4">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div class="flex-1">
					<div class="form-control w-full">
						<div class="input-group w-full">
							<input
								type="text"
								placeholder="Search quizzes..."
								class="input input-bordered w-full"
								bind:value={searchQuery}
								bind:this={searchInputElement}
								oninput={() => updateFilters(true)}
							/>
						</div>
					</div>
				</div>
				<div class="flex gap-2">
					<select
						class="select select-bordered"
						bind:value={selectedDifficulty}
						onchange={() => updateFilters()}
					>
						<option value="">All Difficulties</option>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
					<select
						class="select select-bordered"
						bind:value={sortBy}
						onchange={() => updateFilters()}
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="most-attempts">Most Attempts</option>
						<option value="least-attempts">Least Attempts</option>
					</select>
				</div>
			</div>
		</div>
		{#if isLoading}
			<div class="flex min-h-48 items-center justify-center">
				<div class="loading loading-spinner loading-lg"></div>
			</div>
		{:else if quizzes.length === 0}
			<div class="bg-base-300 flex flex-col items-center gap-4 rounded-lg p-12">
				<Icon icon="fa-solid:book-open" class="h-12 w-12 opacity-40" />
				<p class="text-center text-lg text-gray-500">
					{searchQuery || selectedDifficulty
						? 'No quizzes match your filters. Try adjusting your search criteria.'
						: 'No quizzes found yet. Be the first to'}
					<a href="/quizzes/create" class="link link-primary font-semibold">create one</a>!
				</p>
			</div>
		{:else}
			<div
				class="rounded-box bg-base-200 grid grid-cols-1 gap-6 rounded-t-none p-4 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3"
			>
				{#each quizzes as quiz (quiz.id)}
					<QuizCard {quiz} />
				{/each}
			</div>
			<div class="mt-4 flex items-center justify-center gap-4">
				{#if currentPage > 1}
					<button
						class="btn btn-primary btn-outline gap-2"
						onclick={() => {
							const params = new URLSearchParams(page.url.searchParams);
							params.set('page', (currentPage - 1).toString());
							goto(`/quizzes?${params.toString()}`);
						}}
					>
						<Icon icon="fa-solid:chevron-left" />
						Previous
					</button>
				{/if}
				<div class="join bg-base-200 rounded-lg px-4 py-2">
					<span class="text-sm">
						Page <span class="text-primary font-bold">{currentPage}</span> of
						<span class="font-bold">{totalPages}</span>
					</span>
				</div>
				{#if currentPage < totalPages}
					<button
						class="btn btn-primary btn-outline gap-2"
						onclick={() => {
							const params = new URLSearchParams(page.url.searchParams);
							params.set('page', (currentPage + 1).toString());
							goto(`/quizzes?${params.toString()}`);
						}}
					>
						Next
						<Icon icon="fa-solid:chevron-right" />
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
