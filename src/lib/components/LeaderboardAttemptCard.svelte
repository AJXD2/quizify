<script lang="ts">
	import type { AttemptAnswer, Attempt, Profile as TProfile } from '$lib';
	import Icon from '@iconify/svelte';
	import { calculateTimeSpent, calculateScore } from '$lib/utils';
	import Profile from './Profile.svelte';
	import { goto } from '$app/navigation';

	const {
		attempt,
		rank,
		showUser = true
	}: {
		attempt: Attempt & { answers: AttemptAnswer[]; user: TProfile };
		rank: number;
		showUser?: boolean;
	} = $props();

	const timeSpent = calculateTimeSpent(attempt.startedAt, attempt.completedAt);
	const score = calculateScore(
		attempt.answers.filter((answer) => answer.isCorrect).length,
		attempt.answers.length
	);
</script>

<div class="card bg-base-100 w-full shadow-xl transition-shadow hover:shadow-2xl">
	<div class="card-body p-5">
		<div class="mb-2 flex items-center justify-between">
			<!-- Rank Badge -->
			<div class="flex items-center">
				<div
					class="badge badge-lg mr-2 {rank === 1
						? 'badge-primary'
						: rank === 2
							? 'badge-secondary'
							: rank === 3
								? 'badge-accent'
								: 'badge-neutral'}"
				>
					<span class="text-lg font-bold">#{rank}</span>
				</div>
				{#if showUser}
					<Profile user={attempt.user} />
				{/if}
			</div>

			<!-- Score Badge -->
			<div class="badge badge-lg">
				<Icon icon="mdi:trophy" class="mr-1 h-5 w-5" />
				<span>{score}%</span>
			</div>
		</div>

		<div class="stats bg-base-200 text-sm shadow">
			<div class="stat px-4 py-2">
				<div class="stat-title text-xs">Score</div>
				<div class="stat-value text-base">{score}%</div>
				<div class="stat-desc text-xs">
					{attempt.answers.filter((answer) => answer.isCorrect).length}/{attempt.answers.length} correct
				</div>
			</div>

			<div class="stat px-4 py-2">
				<div class="stat-title text-xs">Time</div>
				<div class="stat-value text-base">{timeSpent}</div>
				<div class="stat-desc text-xs">
					{new Date(attempt.completedAt || attempt.startedAt).toLocaleDateString()}
				</div>
			</div>
		</div>

		<div class="card-actions mt-2 justify-end">
			<button
				class="btn btn-primary btn-sm"
				onclick={() => goto(`/quizzes/${attempt.quizId}/attempts/${attempt.id}`)}
			>
				<Icon icon="mdi:eye" class="mr-1 h-4 w-4" />
				View Details
			</button>
		</div>
	</div>
</div>
