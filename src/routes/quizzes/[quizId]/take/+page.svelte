<script lang="ts">
	import type { Attempt, Quiz, Question, Answer, AttemptAnswer } from '$lib';
	import type { PageData, PageProps } from './$types';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { toasts } from '$lib/stores/toast';
	import { onDestroy, onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	const { data }: { data: PageData } = $props();
	const { quiz, userAttempts } = data;
	// Flow:
	// 1. Send form action `startAttempt` to create an attempt
	// 2. Store the attempt here and show questions.
	// 3. For every question, send form action `submitAnswer` to store the answer.
	// 4. Once completed, send form action `endAttempt` to store the attempt.
	// 5. Redirect to results page.
	let attempt = $state<Attempt | null>(
		userAttempts.find((attempt) => attempt.completedAt === null) ?? null
	);
	let currentQuestionIndex = $state<number>(0);
	let isSubmitting = $state<boolean>(false);
	let timeLeft = $state<number | null>(null);
	let timerInterval: ReturnType<typeof setInterval>;
	let answers = $state<Record<string, AttemptAnswer>>({});

	let isFinished = $derived.by(() => {
		if (Object.keys(answers).length === quiz.questions.length) {
			return true;
		}
		return false;
	});
	onMount(() => {
		if (attempt) {
			toasts.info({ title: 'Welcome back!', message: 'We have resumed your attempt.' });
			startTimer();
		}
	});
	function startTimer() {
		if (!quiz.timeLimit) return;
		timeLeft = quiz.timeLimit * 60; // Convert minutes to seconds
		timerInterval = setInterval(() => {
			if (timeLeft === null) return;
			if (timeLeft <= 0) {
				clearInterval(timerInterval);
				if (attempt) {
					const form = document.createElement('form');
					form.method = 'post';
					form.action = '?/endAttempt';
					const input = document.createElement('input');
					input.type = 'hidden';
					input.name = 'attemptId';
					input.value = attempt.id;
					form.appendChild(input);
					document.body.appendChild(form);
					form.submit();
				}
				return;
			}
			timeLeft--;
		}, 1000);
	}

	function formatTime(seconds: number | null): string {
		if (seconds === null) return '--:--';
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function goToQuestion(index: number) {
		currentQuestionIndex = index;
	}

	onDestroy(() => {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
	});

	const handleStartAttempt: SubmitFunction = () => {
		return ({ update, result }) => {
			update();
			if (result.type === 'success' && result.data) {
				attempt = result.data.attempt;
				startTimer();
			}
		};
	};

	const handleSubmitAnswer: SubmitFunction = () => {
		return ({ update, result }) => {
			update();
			if (result.type === 'success') {
				answers[quiz.questions[currentQuestionIndex].id] = result.data?.attemptAnswer;
				if (currentQuestionIndex < quiz.questions.length - 1) {
					currentQuestionIndex++;
				}
			}
		};
	};

	const handleEndAttempt: SubmitFunction = () => {
		return async ({ update, result }) => {
			if (!attempt) {
				toasts.error({ title: 'Error', message: 'Attempt not found' });
				return;
			}
			isSubmitting = true;

			await update();

			if (result.type === 'success' && result.data) {
				const completedAttempt = result.data.attempt;
				await goto(`/quizzes/${quiz.id}/attempts/${completedAttempt.id}`);
			} else if (result.type === 'failure') {
				toasts.error({
					title: 'Error while ending attempt',
					message: result.data?.message
				});
			}
			isSubmitting = false;
		};
	};
</script>

<div class="mx-auto flex max-w-3xl flex-col items-center justify-center p-3 sm:p-6">
	<h1 class="text-center text-xl font-bold sm:text-2xl">{quiz.title}</h1>
	<p class="mb-4 text-center text-sm text-gray-500 sm:mb-8">{quiz.description}</p>

	{#if !attempt}
		<div class="w-full">
			<div class="alert mb-4 flex-col gap-2 sm:flex-row sm:gap-4">
				{#if quiz.timeLimit}
					<div class="flex items-center gap-2">
						<Icon icon="mdi:clock-outline" class="h-5 w-5" />
						<span>Time limit: {quiz.timeLimit} minutes</span>
					</div>
				{/if}
				<div class="flex items-center gap-2">
					<Icon icon="mdi:help-circle-outline" class="h-5 w-5" />
					<span>{quiz.questions.length} questions</span>
				</div>
			</div>
			<form method="post" action="?/startAttempt" use:enhance={handleStartAttempt}>
				<button type="submit" class="btn btn-primary w-full">Start Attempt</button>
			</form>
		</div>
	{:else if currentQuestionIndex < quiz.questions.length}
		<div class="w-full">
			{#if quiz.timeLimit}
				<div
					class="alert mb-4 {timeLeft !== null && timeLeft <= 60
						? 'alert-error'
						: ''} justify-center"
				>
					<Icon icon="mdi:clock-outline" class="h-5 w-5" />
					<span>Time remaining: {formatTime(timeLeft)}</span>
				</div>
			{/if}

			<ul class="steps steps-horizontal mb-4 w-full">
				{#each quiz.questions as question, index (question.id)}
					<button
						class="step cursor-pointer"
						class:step-accent={index <= currentQuestionIndex}
						class:step-warning={index < currentQuestionIndex && !answers[question.id]}
						class:step-success={index < currentQuestionIndex && answers[question.id]?.isCorrect}
						class:step-error={index < currentQuestionIndex && !answers[question.id]?.isCorrect}
						onclick={() => goToQuestion(index)}
						aria-label={`Question ${index + 1}`}
					>
					</button>
				{/each}
			</ul>

			<div class="card bg-base-100 w-full p-3 shadow-lg sm:p-6">
				<form
					method="post"
					action="?/submitAnswer"
					use:enhance={handleSubmitAnswer}
					class="space-y-3 sm:space-y-4"
				>
					<input type="hidden" name="attemptId" value={attempt.id} />
					<input type="hidden" name="questionId" value={quiz.questions[currentQuestionIndex].id} />

					<div class="space-y-2 sm:space-y-3">
						<span class="text-lg font-bold">
							{quiz.questions[currentQuestionIndex].text}
						</span>
						<div class="divider"></div>
						{#each quiz.questions[currentQuestionIndex].answers as answer (answer.id)}
							<div class="form-control w-full">
								<label
									class="label btn btn-ghost w-full cursor-pointer justify-start gap-3 rounded-lg py-2"
								>
									<input
										type="radio"
										name="answerId"
										value={answer.id}
										class="radio"
										required
										checked={answers[quiz.questions[currentQuestionIndex].id]?.answerId ===
											answer.id}
									/>
									<span class="label-text">{answer.text}</span>
								</label>
							</div>
						{/each}
					</div>

					<div class="flex justify-between gap-2 pt-2">
						{#if currentQuestionIndex > 0}
							<button
								type="button"
								class="btn btn-sm sm:btn-md btn-outline flex-1"
								onclick={() => currentQuestionIndex--}
							>
								Previous
							</button>
						{:else}
							<div class="flex-1"></div>
						{/if}

						{#if currentQuestionIndex < quiz.questions.length - 1}
							<button
								type="submit"
								class="btn btn-sm sm:btn-md btn-primary flex-1"
								disabled={isSubmitting}
							>
								Next Question
							</button>
						{:else}
							<button
								type="submit"
								class="btn btn-sm sm:btn-md btn-primary flex-1"
								disabled={isSubmitting}
							>
								Save Answer
							</button>
						{/if}
					</div>
				</form>

				{#if isFinished}
					<form method="post" action="?/endAttempt" use:enhance={handleEndAttempt} class="mt-4">
						<input type="hidden" name="attemptId" value={attempt.id} />
						<button
							type="submit"
							class="btn btn-sm sm:btn-md btn-primary w-full"
							disabled={isSubmitting}
						>
							Finish Quiz
						</button>
					</form>
				{/if}
			</div>

			<div
				class="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-gray-500 sm:flex-row sm:text-sm"
			>
				<span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
			</div>
		</div>
	{/if}
</div>
