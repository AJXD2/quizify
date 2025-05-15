<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import Profile from '$lib/components/Profile.svelte';
	import AttemptCard from '$lib/components/AttemptCard.svelte';
	import { goto } from '$app/navigation';
	import AttemptTable from '$lib/components/AttemptTable.svelte';
	import { toasts } from '$lib/stores/toast';
	import { page } from '$app/state';

	const { data }: { data: PageData } = $props();
	const { quiz, userAttempts: allAttempts } = data;

	// Calculate statistics - adjust based on actual data model
	const totalQuestions = quiz.questions?.length || 0;
	const estimatedTime = quiz.timeLimit || `${Math.max(totalQuestions * 2, 10)} min`;
	const creationDate = new Date(quiz.createdAt).toLocaleDateString();

	let userAttempts = $state(allAttempts);
	const takeQuiz = () => {
		goto(`/quizzes/${quiz.id}/take`);
	};

	const forfeitAttempt = async (attemptId: string) => {
		// Use /?forfeitAttempt action
		const formData = new FormData();
		formData.set('attemptId', attemptId);
		const response = await fetch('?/forfeitAttempt', {
			method: 'POST',
			body: formData
		});
		if (response.ok) {
			toasts.success({
				title: 'Attempt forfeited',
				message: 'Your attempt has been forfeited',
				icon: 'fluent-emoji:saluting-face'
			});
		}
		userAttempts = userAttempts.filter((attempt) => attempt.id !== attemptId);
	};

	// Check if user is quiz creator
	const isCreator = $derived(quiz.creator.id === page.data.user?.id);
</script>

<div class="flex flex-col gap-6">
	<!-- Quiz header section -->
	<div class="rounded-box bg-base-200 p-6 shadow-lg">
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-3xl font-bold">{quiz.title}</h1>
			<div class="flex gap-2">
				{#if isCreator}
					<a href="/quizzes/{quiz.id}/statistics" class="btn btn-ghost">
						<Icon icon="mdi:chart-box" class="mr-2 h-5 w-5" />
						Statistics
					</a>
				{/if}
				<button class="btn btn-primary" onclick={takeQuiz}>
					<Icon icon="mdi:pencil-outline" class="mr-2 h-5 w-5" />
					Take Quiz
				</button>
			</div>
		</div>

		<p class="mb-6 text-base opacity-80">{quiz.description || 'No description provided'}</p>

		<!-- Quick stats -->
		<div class="stats stats-vertical md:stats-horizontal w-full shadow">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:help-circle-outline" class="h-8 w-8" />
				</div>
				<div class="stat-title">Questions</div>
				<div class="stat-value text-2xl">{totalQuestions}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:speedometer" class="h-8 w-8" />
				</div>
				<div class="stat-title">Difficulty</div>
				<div class="stat-value text-2xl">
					{`${quiz.difficulty?.slice(0, 1).toUpperCase()}${quiz.difficulty?.slice(1)}`}
				</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:clock-outline" class="h-8 w-8" />
				</div>
				<div class="stat-title">Est. Time</div>
				<div class="stat-value text-2xl">{estimatedTime}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Icon icon="mdi:account-group" class="h-8 w-8" />
				</div>
				<div class="stat-title">Attempts</div>
				<div class="stat-value text-2xl">{quiz.attempts?.length || 0}</div>
			</div>
		</div>
	</div>

	<!-- Quiz information section -->
	<div class="space-y-6">
		<!-- Quiz information section -->
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
			<!-- Details -->
			<div class="card bg-base-200 lg:col-span-1 xl:col-span-2">
				<div class="card-body">
					<h2 class="card-title mb-2 flex items-center justify-between">
						<div class="flex items-center">
							<Icon icon="mdi:information-outline" class="mr-2 h-6 w-6" />
							Quiz Details
						</div>
						{#if isCreator}
							<a
								href="/quizzes/{quiz.id}/statistics"
								class="btn btn-ghost btn-sm gap-2 text-base normal-case"
							>
								<Icon icon="mdi:chart-box" class="h-4 w-4" />
								View Statistics
							</a>
						{/if}
					</h2>

					<div class="divider my-1"></div>

					<div class="grid grid-cols-1 gap-4">
						<!-- Creator -->
						<div class="flex flex-col">
							<span class="text-sm font-medium opacity-70">Created by</span>
							<div class="mt-1 flex items-center gap-2">
								<Profile user={quiz.creator} />
							</div>
						</div>

						<!-- Date -->
						<div class="flex flex-col">
							<span class="text-sm font-medium opacity-70">Created on</span>
							<div class="flex items-center gap-2">
								<Icon icon="mdi:calendar" class="h-5 w-5 opacity-70" />
								<time datetime={quiz.createdAt.toISOString()}>{creationDate}</time>
							</div>
						</div>

						<!-- Tags if available -->
						{#if quiz.tags && quiz.tags.length > 0}
							<div class="flex flex-col">
								<span class="text-sm font-medium opacity-70">Tags</span>
								<div class="mt-1 flex flex-wrap gap-2">
									{#each quiz.tags as tag}
										<div class="badge badge-primary">{tag}</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Instructions -->
						<div class="flex flex-col">
							<span class="text-sm font-medium opacity-70">Instructions</span>
							<p class="mt-1">
								{quiz.instructions ||
									'Read each question carefully and select the best answer. Your results will be available immediately after completion.'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Questions preview -->
			<div class="card bg-base-200">
				<div class="card-body">
					<h2 class="card-title mb-2 flex items-center">
						<Icon icon="mdi:format-list-bulleted" class="mr-2 h-6 w-6" />
						Questions Preview
					</h2>

					<div class="divider my-1"></div>

					{#if quiz.questions && quiz.questions.length > 0}
						<div class="rounded-box bg-base-100 w-full p-4">
							<ul class="list">
								{#each quiz.questions.slice(0, 5) as question, i}
									<li class="list-row py-2">
										<div class="badge badge-sm mr-2">{i + 1}</div>
										<span class="break-words"
											>{question.text?.substring(0, 40) || `Question ${i + 1}`}{question.text
												?.length > 40
												? '...'
												: ''}</span
										>
									</li>
								{/each}
							</ul>

							{#if quiz.questions.length > 5}
								<div class="mt-2 text-center text-sm opacity-70">
									+ {quiz.questions.length - 5} more questions
								</div>
							{/if}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-8 opacity-60">
							<Icon icon="mdi:help-circle-outline" class="mb-2 h-12 w-12" />
							<p>No questions available</p>
						</div>
					{/if}

					<div class="card-actions mt-2">
						<button class="btn btn-primary btn-sm btn-block" onclick={takeQuiz}>
							<Icon icon="mdi:pencil-outline" class="mr-2 h-5 w-5" />
							Start Quiz
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Your activity section (if user has attempts) -->
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title mb-2 flex items-center">
					<Icon icon="mdi:history" class="mr-2 h-6 w-6" />
					Your Activity
				</h2>

				<div class="divider my-1"></div>

				{#if userAttempts && userAttempts.length > 0}
					<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
						{#each userAttempts as attempt (attempt.id)}
							<AttemptCard {attempt} onForfeit={() => forfeitAttempt(attempt.id)} />
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-8">
						<Icon icon="mdi:information-outline" class="mb-2 h-12 w-12 opacity-60" />
						<p class="opacity-60">You haven't attempted this quiz yet</p>
						<button class="btn btn-primary btn-sm mt-4" onclick={takeQuiz}>
							<Icon icon="mdi:pencil-outline" class="mr-2 h-5 w-5" />
							Take Quiz Now
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
