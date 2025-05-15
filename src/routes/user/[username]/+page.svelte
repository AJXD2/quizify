<script lang="ts">
	import QuizCard from '$lib/components/QuizCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { userProfile } = data;

	const totalAttempts = $derived(userProfile.attempts?.length ?? 0);
	const averageScore = $derived(
		userProfile.attempts?.reduce((acc, curr) => acc + (curr.score ?? 0), 0) / totalAttempts || 0
	);
	const completedAttempts = $derived(
		userProfile.attempts?.filter((a) => a.completedAt !== null).length ?? 0
	);
	const averageTimeSpent = $derived(
		userProfile.attempts?.reduce((acc, curr) => acc + (curr.timeSpent ?? 0), 0) /
			completedAttempts || 0
	);
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
	<div class="card bg-base-100 border-base-300 border shadow-xl md:col-span-2">
		<div class="card-body">
			<h2 class="card-title text-primary">Statistics</h2>
			<div class="mt-4 grid grid-cols-2 gap-4 break-words md:grid-cols-3">
				<div class="stat bg-base-200 rounded-box hover:bg-base-300 p-4 transition-colors">
					<div class="stat-title opacity-80">Total Quizzes</div>
					<div class="stat-value text-primary">{userProfile.quizzes.length}</div>
				</div>
				<div class="stat bg-base-200 rounded-box hover:bg-base-300 p-4 transition-colors">
					<div class="stat-title opacity-80">Quiz Attempts</div>
					<div class="stat-value text-secondary">{totalAttempts}</div>
					<div class="stat-desc">{completedAttempts} completed</div>
				</div>
				<div class="stat bg-base-200 rounded-box hover:bg-base-300 p-4 transition-colors">
					<div class="stat-title opacity-80">Avg. Score</div>
					<div class="stat-value text-accent">{averageScore.toFixed(1)}%</div>
				</div>
				<div class="stat bg-base-200 rounded-box hover:bg-base-300 p-4 transition-colors">
					<div class="stat-title opacity-80">Avg. Time</div>
					<div class="stat-value text-primary">{Math.round(averageTimeSpent)}s</div>
				</div>
				<div class="stat bg-base-200 rounded-box hover:bg-base-300 p-4 transition-colors">
					<div class="stat-title opacity-80">Completion Rate</div>
					<div class="stat-value text-secondary">
						{totalAttempts ? ((completedAttempts / totalAttempts) * 100).toFixed(0) : 0}%
					</div>
				</div>
				<div class="stat bg-base-200 rounded-box hover:bg-base-300 p-4 transition-colors">
					<div class="stat-title opacity-80">Latest Activity</div>
					<div class="stat-value text-accent text-base">
						{userProfile.attempts?.[0]?.startedAt
							? new Date(userProfile.attempts[0].startedAt).toLocaleDateString()
							: 'No activity'}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="card bg-base-100 border-base-300 border shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-primary mb-4">Recent Activity</h2>
			{#if userProfile.attempts && userProfile.attempts.length > 0}
				<div class="space-y-3">
					{#each userProfile.attempts.slice(0, 5) as attempt (attempt.id)}
						<div
							class="bg-base-200 hover:bg-base-300 border-base-300 rounded-lg border p-4 transition-colors"
						>
							<div class=" text-sm font-semibold">
								{attempt.quiz.title}
							</div>
							<div class="mt-2 flex items-center justify-between">
								<span class="text-sm opacity-75">
									{new Date(attempt.startedAt).toLocaleDateString()}
								</span>
								{#if attempt.score !== null}
									<span class="badge badge-primary badge-lg">
										{attempt.score}%
									</span>
								{:else}
									<span class="badge badge-ghost badge-lg">In Progress</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-base-content py-8 text-center opacity-60">
					<div class="mb-2 text-4xl">📝</div>
					No quiz attempts yet
				</div>
			{/if}
		</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each userProfile.quizzes as quiz (quiz.id)}
		<QuizCard quiz={{ ...quiz, creator: userProfile }} />
	{/each}

	{#if userProfile.quizzes.length === 0}
		<div class="col-span-full py-8 text-center">
			<h3 class="mb-2 text-xl font-semibold">No quizzes yet</h3>
			<p class="text-gray-500">This user hasn't created any quizzes.</p>
		</div>
	{/if}
</div>
