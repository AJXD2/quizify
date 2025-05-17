<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { toasts } from '$lib/stores/toast';
	import { superForm } from 'sveltekit-superforms/client';
	import type { QuizType } from '$lib/schemas/quiz';
	import SuperDebug from 'sveltekit-superforms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const { data } = $props();
	const { form, errors, delayed, enhance, message } = superForm<QuizType>(data.form, {
		dataType: 'json',
		taintedMessage: null,
		onUpdated: ({ form }) => {
			if (form.valid) {
				toasts.success({
					message: 'Quiz saved successfully',
					title: 'Success',
					duration: 2000
				});
				goto(`/quizzes/${form.data.id}`);
			}
		},
		onError: ({ result }) => {
			toasts.error({
				message: result.error.message,
				title: 'Error',
				duration: 2000
			});
		},

		invalidateAll: true
	});

	const addQuestion = () => {
		$form.questions = [
			...$form.questions,
			{
				quizId: $form.id || '',
				text: '',
				answers: []
			}
		];
	};

	const removeQuestion = (index: number) => {
		$form.questions = $form.questions.filter((_, i) => i !== index);
	};

	const addAnswer = (questionIndex: number) => {
		const newAnswer = {
			questionId: $form.questions[questionIndex].id,
			text: '',
			isCorrect: false
		};
		$form.questions[questionIndex].answers = [...$form.questions[questionIndex].answers, newAnswer];
	};

	const removeAnswer = (questionIndex: number, answerIndex: number) => {
		$form.questions[questionIndex].answers = $form.questions[questionIndex].answers.filter(
			(_, i) => i !== answerIndex
		);
	};

	const setCorrectAnswer = (questionIndex: number, answerIndex: number) => {
		$form.questions[questionIndex].answers = $form.questions[questionIndex].answers.map(
			(answer, i) => ({
				...answer,
				isCorrect: i === answerIndex
			})
		);
	};
</script>

<Seo
	title={`Edit Quiz: ${data.form.data.title || 'Quiz'} - Quizify`}
	description={`Editing the quiz: ${data.form.data.title || 'Quiz'}. Make your changes and save.`}
	url={page.url.href}
	type="website"
	keywords={`quizify, ${data.form.data.title}, edit quiz, quiz editor`}
/>

<!-- <SuperDebug data={$form} /> -->

<div class="m-1 p-4 md:p-8">
	<div class="mx-auto max-w-4xl">
		<form class="space-y-6" method="POST" use:enhance>
			<!-- Header -->
			<div class="mb-8 flex items-center justify-between gap-4">
				<h1 class="text-2xl font-bold">Edit Quiz</h1>
				<button class="btn btn-primary gap-2" type="submit">
					<Icon icon="material-symbols:save" class="h-5 w-5" />
					{$delayed ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
			<!-- Main Form -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body space-y-6">
					<!-- Basic Info Section -->
					<div>
						<h2 class="card-title">Basic Information</h2>
						<div class="mt-4 space-y-4">
							<div class="form-control w-full">
								<label class="label" for="title">
									<span class="label-text">Quiz Title</span>
								</label>
								<input
									type="text"
									id="title"
									bind:value={$form.title}
									class="input input-bordered w-full"
									class:input-error={$errors.title}
									placeholder="Enter quiz title"
								/>
								{#if $errors.title}
									<label for="title" class="label">
										<span class="label-text-alt text-error">{$errors.title}</span>
									</label>
								{/if}
							</div>
							<div class="form-control flex w-full flex-col">
								<label class="label" for="description">
									<span class="label-text">Description</span>
								</label>
								<textarea
									id="description"
									bind:value={$form.description}
									class="textarea textarea-bordered h-24 w-full"
									placeholder="Enter quiz description"
								></textarea>
							</div>
						</div>
					</div>

					<!-- Questions Section -->
					<div>
						<div class="flex items-center justify-between">
							<h2 class="card-title">Questions</h2>
							<button type="button" class="btn btn-ghost btn-sm gap-2" onclick={addQuestion}>
								<Icon icon="material-symbols:add" class="h-5 w-5" />
								Add Question
							</button>
						</div>

						<div class="mt-4 space-y-6">
							{#if $form.questions.length > 0}
								{#each $form.questions as question, questionIndex (question.id)}
									<div class="card bg-base-100 shadow-md">
										<div class="card-body gap-4 p-3">
											<!-- Question Header -->
											<div class="flex items-center justify-between gap-2">
												<div class="badge badge-neutral">Question {questionIndex + 1}</div>
												<button
													type="button"
													class="btn btn-ghost btn-circle btn-sm self-end"
													onclick={() => removeQuestion(questionIndex)}
												>
													<Icon icon="material-symbols:delete-outline" class="text-error h-5 w-5" />
												</button>
											</div>

											<!-- Question Input -->
											<div class="form-control w-full">
												<input
													type="text"
													id="question-{questionIndex}"
													bind:value={question.text}
													placeholder="Enter your question"
													class="input input-bordered w-full"
													class:input-error={$errors.questions?.[questionIndex]?.text}
												/>
												{#if $errors.questions?.[questionIndex].text}
													<label for="question-{questionIndex}" class="label">
														<span class="label-text-alt text-error">
															{$errors.questions[questionIndex].text}
														</span>
													</label>
												{/if}
											</div>

											<!-- Answer Options -->
											<div class="space-y-3 p-0">
												<h3 class="font-medium">Answer Options</h3>
												{#if $errors.questions?.[questionIndex]?.answers?._errors}
													{#each $errors.questions[questionIndex].answers._errors as err}
														<div class="alert alert-soft alert-error">
															<span>{err}</span>
														</div>
													{/each}
												{/if}
												<div class="space-y-2">
													{#each question.answers as answer, answerIndex (answer.id)}
														<div
															class="bg-base-200 flex items-center justify-between gap-2 rounded-lg p-3"
														>
															<input
																type="radio"
																name="correct-{questionIndex}"
																class="radio radio-primary"
																checked={answer.isCorrect}
																onchange={() => setCorrectAnswer(questionIndex, answerIndex)}
															/>
															<div class="flex w-full flex-col gap-1">
																<input
																	type="text"
																	bind:value={answer.text}
																	placeholder="Answer option"
																	class="input input-bordered input-sm w-full flex-1"
																	class:input-error={$errors.questions?.[questionIndex]?.answers?.[
																		answerIndex
																	]?.text}
																/>
																{#if $errors.questions?.[questionIndex]?.answers?.[answerIndex]?.text}
																	<label for="answer-{answerIndex}" class="label">
																		<span class=" text-error">
																			{$errors.questions[questionIndex].answers[answerIndex].text}
																		</span>
																	</label>
																{/if}
															</div>
															<button
																type="button"
																class="btn btn-ghost btn-circle btn-sm self-end sm:self-center"
																onclick={() => removeAnswer(questionIndex, answerIndex)}
															>
																<Icon
																	icon="material-symbols:delete-outline"
																	class="text-error h-5 w-5"
																/>
															</button>
														</div>
													{/each}
												</div>
												<button
													type="button"
													class="btn btn-ghost btn-sm text-primary gap-1"
													onclick={() => addAnswer(questionIndex)}
												>
													<Icon icon="material-symbols:add" class="h-4 w-4" />
													Add Answer Option
												</button>
											</div>
										</div>
									</div>
								{/each}
							{:else}
								<div class="card bg-base-100 shadow-md">
									<div class="card-body p-3">
										<p class="text-center text-sm text-gray-500">No questions added yet</p>
										<button
											type="button"
											class="btn btn-ghost btn-sm text-primary gap-1 sm:flex"
											onclick={addQuestion}
										>
											<Icon icon="material-symbols:add" class="h-4 w-4" />
											Add Question
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Settings Section -->
					<div>
						<h2 class="card-title">Quiz Settings</h2>
						<div class="mt-4 space-y-4">
							<div class="form-control w-full max-w-xs">
								<label class="label" for="time-limit">
									<span class="label-text">Time Limit (minutes)</span>
								</label>
								<input
									type="number"
									id="time-limit"
									bind:value={$form.timeLimit}
									min="0"
									class="input input-bordered w-32"
									placeholder="0"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
