<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import Profile from '$lib/components/Profile.svelte';
	import { calculateTimeSpent, calculateScore } from '$lib/utils';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	const { attempt, quiz } = data;

	const timeSpent = calculateTimeSpent(attempt.startedAt, attempt.completedAt);
	const score = calculateScore(
		attempt.answers.filter((answer) => answer.isCorrect).length,
		attempt.answers.length
	);
</script>

{#if !attempt || !quiz}
	<Seo
		title="Loading Attempt... - Quizify"
		description="Loading quiz attempt details."
		url={page.url.href}
	/>
	<div class="flex min-h-[50vh] items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<span class="loading loading-spinner loading-lg"></span>
			<p class="text-lg">Loading attempt details...</p>
		</div>
	</div>
{:else}
	<Seo
		title={`Attempt Results: ${quiz.title} - Quizify`}
		description={`Results for your attempt on the quiz: ${quiz.title}. Score: ${score}%.`}
		url={page.url.href}
		type="article"
		keywords={`quizify, ${quiz.title}, quiz results, attempt details, ${attempt.user.username}`}
	/>
	<div class="flex flex-col gap-6">
		<!-- Header section -->
		<div class="rounded-box bg-base-200 p-6">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold">{quiz.title}</h1>
					<p class="mt-2 text-sm opacity-70">Attempt Details</p>
				</div>
			</div>

			<!-- Quick stats -->
			<div class="stats stats-vertical md:stats-horizontal w-full shadow">
				<div class="stat">
					<div class="stat-figure text-secondary">
						<Icon icon="mdi:trophy" class="h-8 w-8" />
					</div>
					<div class="stat-title">Score</div>
					<div class="stat-value text-2xl">{score}%</div>
					<div class="stat-desc">
						{attempt.answers.filter((a) => a.isCorrect).length} of {attempt.answers.length} correct
					</div>
				</div>

				<div class="stat">
					<div class="stat-figure text-secondary">
						<Icon icon="mdi:clock-outline" class="h-8 w-8" />
					</div>
					<div class="stat-title">Time Taken</div>
					<div class="stat-value text-2xl">{timeSpent}</div>
					<div class="stat-desc">
						{new Date(attempt.startedAt).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							year: 'numeric'
						})}
					</div>
				</div>

				<div class="stat">
					<div class="stat-figure text-secondary">
						<Profile user={attempt.user} />
					</div>
					<div class="stat-title">Attempted By</div>
					<div class="stat-value text-2xl">{attempt.user.username || 'Anonymous'}</div>
				</div>
			</div>
		</div>

		<!-- Questions Review -->
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title mb-2 flex items-center">
					<Icon icon="mdi:format-list-checks" class="mr-2 h-6 w-6" />
					Questions Review
				</h2>

				<div class="divider my-1"></div>

				<div class="flex flex-col gap-6">
					{#each quiz.questions as question, index (question.id)}
						{@const attemptAnswer = attempt.answers.find((a) => a.questionId === question.id)}
						{@const correctAnswer = question.answers.find((a) => a.isCorrect)}
						<div class="card bg-base-100 shadow-lg">
							<div class="card-body">
								<div class="flex items-start justify-between gap-4">
									<h3 class="flex-1 text-lg font-medium">
										<span
											class="bg-base-200 mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
										>
											{index + 1}
										</span>
										{question.text}
									</h3>
									{#if attemptAnswer}
										<div
											class="badge badge-lg {attemptAnswer.isCorrect
												? 'badge-success'
												: 'badge-error'} gap-2"
										>
											<Icon
												icon={attemptAnswer.isCorrect ? 'mdi:check-circle' : 'mdi:close-circle'}
												class="h-5 w-5"
											/>
											{attemptAnswer.isCorrect ? 'Correct' : 'Incorrect'}
										</div>
									{:else}
										<div class="badge badge-lg badge-warning gap-2">
											<Icon icon="mdi:help-circle" class="h-5 w-5" />
											Not Answered
										</div>
									{/if}
								</div>

								<div class="divider"></div>

								<div class="grid gap-3">
									{#each question.answers as answer (answer.id)}
										{@const isSelected = answer.id === attemptAnswer?.answerId}
										{@const isCorrect = answer.isCorrect}
										<div
											class="flex items-center gap-3 rounded-lg p-3 {isSelected
												? isCorrect
													? 'bg-success/20'
													: 'bg-error/20'
												: isCorrect && attemptAnswer
													? 'bg-success/20'
													: 'bg-base-200'}"
										>
											<div
												class="flex h-6 w-6 items-center justify-center rounded-full {isSelected
													? isCorrect
														? 'bg-success text-success-content'
														: 'bg-error text-error-content'
													: isCorrect && attemptAnswer
														? 'bg-success text-success-content'
														: 'bg-base-300'}"
											>
												<Icon
													icon={isSelected
														? isCorrect
															? 'mdi:check'
															: 'mdi:close'
														: isCorrect && attemptAnswer
															? 'mdi:check'
															: ''}
													class="h-4 w-4"
												/>
											</div>
											<span class="flex-1">{answer.text}</span>
										</div>
									{/each}
								</div>

								{#if !attemptAnswer?.isCorrect && correctAnswer}
									<div class="bg-info/20 mt-4 flex items-start gap-2 rounded-lg p-4 text-sm">
										<Icon icon="mdi:information" class="mt-0.5 h-5 w-5 shrink-0" />
										<div>
											<span class="font-medium">Correct Answer:</span>
											{correctAnswer.text}
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="toast toast-end">
	{#if !attempt}
		<div class="alert alert-error">
			<Icon icon="mdi:alert" class="h-6 w-6" />
			<span>Failed to load attempt details</span>
		</div>
	{/if}
</div>
