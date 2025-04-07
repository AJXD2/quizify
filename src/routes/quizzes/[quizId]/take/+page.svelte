<script lang="ts">
	import type { Attempt } from '$lib';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	const { quiz } = data;

	// Define the structure of Quiz with questions and answers
	type Answer = {
		id: string;
		text: string;
		isCorrect: boolean;
		questionId: string;
	};

	type Question = {
		id: string;
		text: string;
		quizId: string;
		answers: Answer[];
	};

	type Quiz = {
		id: string;
		title: string;
		description: string | null;
		createdAt: Date;
		updatedAt: Date;
		creatorId: string;
		timeLimit: number | null;
		difficulty: 'easy' | 'medium' | 'hard' | null;
		tags: string[] | null;
		instructions: string | null;
		questions: Question[];
	};

	// Cast quiz to the correct type
	const typedQuiz = quiz as unknown as Quiz;

	// Flow:
	// 1. Send form action `startAttempt` to create an attempt
	// 2. Store the attempt here and show questions.
	// 3. For every question, send form action `submitAnswer` to store the answer.
	// 4. Once completed, send form action `endAttempt` to store the attempt.
	// 5. Redirect to results page.

	let attempt = $state<Attempt | null>(null);
	let currentQuestionIndex = $state<number>(0);
	let userAnswers = $state<Record<string, string>>({});
	let isSubmitting = $state<boolean>(false);

	const handleStartAttempt: SubmitFunction = () => {
		return ({ update, result }) => {
			update();
			if (result.type === 'success' && result.data) {
				attempt = result.data.attempt;
			}
		};
	};

	const handleSubmitAnswer: SubmitFunction = () => {
		return ({ update, result }) => {
			update();
			if (result.type === 'success') {
				if (currentQuestionIndex < typedQuiz.questions.length - 1) {
					currentQuestionIndex++;
				} else {
					// All questions answered, end the attempt
					endAttempt();
				}
			}
		};
	};

	async function endAttempt() {
		isSubmitting = true;

		const formData = new FormData();
		formData.append('attemptId', attempt!.id);

		const response = await fetch('?/endAttempt', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		if (result.success) {
			// Redirect to results page
			goto(`/quizzes/${typedQuiz.id}/results/${result.attempt.id}`);
		}

		isSubmitting = false;
	}
</script>

<div class="mx-auto flex max-w-3xl flex-col items-center justify-center p-6">
	<h1 class="text-2xl font-bold">{typedQuiz.title}</h1>
	<p class="mb-8 text-sm text-gray-500">{typedQuiz.description}</p>

	{#if !attempt}
		<form method="post" action="?/startAttempt" use:enhance={handleStartAttempt}>
			<button type="submit" class="btn btn-primary">Start Attempt</button>
		</form>
	{:else if currentQuestionIndex < typedQuiz.questions.length}
		<div class="w-full">
			<div class="mb-4 text-sm text-gray-500">
				Question {currentQuestionIndex + 1} of {typedQuiz.questions.length}
			</div>

			<div class="card bg-base-100 w-full p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">{typedQuiz.questions[currentQuestionIndex].text}</h2>

				<form
					method="post"
					action="?/submitAnswer"
					use:enhance={handleSubmitAnswer}
					class="space-y-4"
				>
					<input type="hidden" name="attemptId" value={attempt.id} />
					<input
						type="hidden"
						name="questionId"
						value={typedQuiz.questions[currentQuestionIndex].id}
					/>

					{#each typedQuiz.questions[currentQuestionIndex].answers as answer}
						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-3">
								<input type="radio" name="answerId" value={answer.id} class="radio" required />
								<span class="label-text">{answer.text}</span>
							</label>
						</div>
					{/each}

					<button type="submit" class="btn btn-primary mt-4 w-full" disabled={isSubmitting}>
						{currentQuestionIndex < typedQuiz.questions.length - 1
							? 'Next Question'
							: 'Finish Quiz'}
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>
