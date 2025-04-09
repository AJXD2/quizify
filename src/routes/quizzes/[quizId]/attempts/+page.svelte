<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import AttemptCard from '$lib/components/AttemptCard.svelte';
	import { toasts } from '$lib/stores/toast';

	let { data }: { data: PageData } = $props();
	const { userAttempts } = data;

	let attempts = $state(userAttempts);
	const forfeitAttempt = async (attemptId: string) => {
		const formData = new FormData();
		formData.set('attemptId', attemptId);
		const response = await fetch(
			`/quizzes/${attempts.find((a) => a.id === attemptId)?.quizId}?/forfeitAttempt`,
			{
				method: 'POST',
				body: formData
			}
		);
		const data = await response.json();
		if (data.type === 'success') {
			toasts.success({
				title: 'Attempt forfeited',
				message: 'Your attempt has been forfeited',
				icon: 'fluent-emoji:saluting-face'
			});
		}
		attempts = attempts.filter((attempt) => attempt.id !== attemptId);
	};
</script>

<div class="flex flex-col gap-6">
	<!-- Header section -->
	<div class="rounded-box bg-base-200 p-6">
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Your Attempts</h1>
		</div>

		<!-- Quick stats -->
		<div class="stats stats-vertical md:stats-horizontal w-full shadow">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:clipboard-text-clock" class="h-8 w-8" />
				</div>
				<div class="stat-title">Total Attempts</div>
				<div class="stat-value text-2xl">{attempts.length}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:check-circle" class="h-8 w-8" />
				</div>
				<div class="stat-title">Completed</div>
				<div class="stat-value text-2xl">
					{attempts.filter((a) => a.completedAt).length}
				</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:clock-outline" class="h-8 w-8" />
				</div>
				<div class="stat-title">In Progress</div>
				<div class="stat-value text-2xl">
					{attempts.filter((a) => !a.completedAt).length}
				</div>
			</div>
		</div>
	</div>

	<!-- Attempts list section -->
	<div class="card bg-base-200">
		<div class="card-body">
			<h2 class="card-title mb-2 flex items-center">
				<Icon icon="mdi:history" class="mr-2 h-6 w-6" />
				All Attempts
			</h2>

			<div class="divider my-1"></div>

			{#if attempts && attempts.length > 0}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each attempts as attempt}
						<AttemptCard {attempt} showUser={false} onForfeit={() => forfeitAttempt(attempt.id)} />
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-8">
					<Icon icon="mdi:information-outline" class="mb-2 h-12 w-12 opacity-60" />
					<p class="opacity-60">You haven't attempted any quizzes yet</p>
					<a href="/quizzes" class="btn btn-primary btn-sm mt-4">
						<Icon icon="mdi:pencil-outline" class="mr-2 h-5 w-5" />
						Browse Quizzes
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
