<script lang="ts">
	import type { AttemptAnswer, Attempt, Profile as TProfile } from '$lib';
	import Icon from '@iconify/svelte';
	import { calculateTimeSpent, calculateScore } from '$lib/utils';
	import Profile from './Profile.svelte';

	const {
		attempt,
		showUser = false
	}: { attempt: Attempt & { answers: AttemptAnswer[]; user: TProfile }; showUser?: boolean } =
		$props();
	const timeSpent = calculateTimeSpent(attempt.startedAt, attempt.completedAt);
	const score = calculateScore(
		attempt.answers.filter((answer) => answer.isCorrect).length,
		attempt.answers.length
	);
</script>

<div class="card bg-base-100 w-full shadow-xl">
	<div class="card-body p-6">
		<div class="card-title mb-4 flex items-center justify-between">
			<div class="badge badge-lg gap-2">
				<Icon icon="mdi:clock-outline" class="h-4 w-4" />
				<span>{timeSpent}</span>
			</div>
			<div class="badge badge-lg badge-primary gap-2">
				<Icon icon="mdi:check-circle-outline" class="h-4 w-4" />
				<span>{score}%</span>
			</div>
		</div>

		{#if showUser}
			<div class=" mb-4 flex items-center justify-between">
				<Profile user={attempt.user} />
			</div>
		{/if}

		<div class="stats bg-base-200 mb-4 shadow">
			<div class="stat">
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
		</div>

		<div class="card-actions justify-end">
			<button class="btn btn-primary btn-sm">
				<Icon icon="mdi:eye" class="mr-1 h-4 w-4" />
				View Details
			</button>
		</div>
	</div>
</div>
