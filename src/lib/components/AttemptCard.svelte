<script lang="ts">
	import type { AttemptAnswer, Attempt, Profile as TProfile } from '$lib';
	import Icon from '@iconify/svelte';
	import { calculateTimeSpent, calculateScore } from '$lib/utils';
	import Profile from './Profile.svelte';
	import { goto } from '$app/navigation';

	const {
		attempt,
		showUser = false,
		onForfeit = () => {}
	}: {
		attempt: Attempt & { answers: AttemptAnswer[]; user: TProfile };
		showUser?: boolean;
		onForfeit?: () => void;
	} = $props();
	const timeSpent = calculateTimeSpent(attempt.startedAt, attempt.completedAt);
	const score = calculateScore(
		attempt.answers.filter((answer) => answer.isCorrect).length,
		attempt.answers.length
	);

	const isCompleted = attempt.completedAt !== null;
</script>

<div class="card bg-base-100 w-full shadow-xl">
	<div class="card-body p-6">
		<div class="card-title mb-4 flex items-center justify-between">
			{#if isCompleted}
				<div class="badge badge-lg gap-2">
					<Icon icon="mdi:check-circle-outline" class="h-6 w-6" />
					<span>Completed in {calculateTimeSpent(attempt.startedAt, attempt.completedAt)}</span>
				</div>
			{:else}
				<div class="badge badge-lg badge-warning gap-2" class:animate-pulse={!isCompleted}>
					<Icon icon="mdi:clock-outline" class="h-6 w-6" />
					<span>In Progress</span>
				</div>
			{/if}
		</div>

		{#if showUser}
			<div class=" mb-4 flex items-center justify-between">
				<Profile user={attempt.user} />
			</div>
		{/if}

		<div class="stats bg-base-200 mb-4 shadow" class:animate-pulse={!isCompleted}>
			{#if isCompleted}
				<div class="stat overflow-hidden">
					<div class="stat-title">Score</div>
					<div class="stat-value text-primary flex justify-between gap-2">
						<span>{score}%</span>
						<span class="text-secondary text-sm"
							>({attempt.answers.filter((answer) => answer.isCorrect).length}/{attempt.answers
								.length})</span
						>
					</div>
					<div class="stat-desc">Completed in {timeSpent}</div>
				</div>
			{:else}
				<div class="stat overflow-hidden">
					<div class="stat-title">Progress</div>
					<div class="stat-value text-primary flex justify-between gap-2">
						<span>{attempt.answers.length}</span>
						<span class="text-secondary text-sm"
							>({attempt.answers.length}/{attempt.answers.length} answered)</span
						>
					</div>
					<div class="stat-desc">In progress...</div>
				</div>
			{/if}
		</div>

		<div class="card-actions justify-end">
			{#if isCompleted}
				<button
					class="btn btn-primary btn-sm"
					onclick={() => goto(`/quizzes/${attempt.quizId}/results/${attempt.id}`)}
				>
					<Icon icon="mdi:eye" class="mr-1 h-4 w-4" />
					View Details
				</button>
			{:else}
				<button class="btn btn-error btn-sm" onclick={onForfeit}>
					<Icon icon="mdi:delete" class="mr-1 h-4 w-4" />
					Forfeit
				</button>
				<button
					class="btn btn-primary btn-sm"
					onclick={() => goto(`/quizzes/${attempt.quizId}/take`)}
				>
					<Icon icon="mdi:play" class="mr-1 h-4 w-4" />
					Continue
				</button>
			{/if}
		</div>
	</div>
</div>
