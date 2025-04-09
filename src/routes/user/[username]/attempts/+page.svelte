<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { userProfile } = data;
</script>

<div class="space-y-4">
	{#each userProfile.attempts ?? [] as attempt}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="flex items-start justify-between">
					<div>
						<h3 class="text-lg font-bold">{attempt.quiz.title}</h3>
						<p class="text-sm text-gray-500">
							Attempted {attempt.completedAt
								? new Date(attempt.completedAt).toLocaleDateString()
								: 'Unknown'}
						</p>
					</div>
					<div class="text-right">
						<div class="text-2xl font-bold">{attempt.score}%</div>
						<div class="text-sm text-gray-500">
							{attempt.answers.filter((answer) => answer.isCorrect).length} / {attempt.answers
								.length} correct
						</div>
					</div>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href="/quizzes/{attempt.quiz.id}/attempts/{attempt.id}" class="btn btn-outline">
						View Details
					</a>
				</div>
			</div>
		</div>
	{/each}

	{#if !userProfile.attempts?.length}
		<div class="py-8 text-center">
			<h3 class="mb-2 text-xl font-semibold">No attempts yet</h3>
			<p class="text-gray-500">This user hasn't attempted any quizzes.</p>
		</div>
	{/if}
</div>
