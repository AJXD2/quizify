import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { quizSchema, type QuizType } from '$lib/schemas/quiz';
import { getSessionOrRedirect } from '$lib/server/utils';
import type { PageServerLoad } from './$types';
import { quiz, question, answer, attempt, attemptAnswer } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load = (async ({ request, params }) => {
	const session = await getSessionOrRedirect(request, `/quizzes/${params.quizId}/edit`);
	const quizData = await db.query.quiz.findFirst({
		where: eq(quiz.id, params.quizId),
		with: {
			questions: {
				with: {
					answers: true
				}
			}
		}
	});
	if (!quizData) throw redirect(308, '/quizzes');

	if (quizData.creatorId !== session.user.id) {
		throw error(403, 'You are not allowed to edit this quiz');
	}

	const form = await superValidate(quizData, zod(quizSchema));
	return { form };
}) satisfies PageServerLoad;

// Actions
// updateQuiz - default
export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, zod(quizSchema));

		if (!form.valid) {
			return { form };
		}

		try {
			if (!form.data.id) {
				form.data.id = params.quizId;
			}

			// Get existing questions and answers
			const existingQuiz = await db.query.quiz.findFirst({
				where: eq(quiz.id, form.data.id),
				with: {
					questions: {
						with: {
							answers: true
						}
					}
				}
			});

			if (!existingQuiz) {
				return fail(404, {
					form,
					success: false,
					message: 'Quiz not found'
				});
			}

			// Check if quiz structure has changed
			const hasStructuralChanges = checkQuizStructuralChanges(existingQuiz, form.data);

			// If there are structural changes, delete all attempts
			if (hasStructuralChanges) {
				// Get all attempts for this quiz
				const attempts = await db.select().from(attempt).where(eq(attempt.quizId, form.data.id));

				// Delete all attempt answers for each attempt
				for (const att of attempts) {
					await db.delete(attemptAnswer).where(eq(attemptAnswer.attemptId, att.id));
				}

				// Then delete all attempts
				await db.delete(attempt).where(eq(attempt.quizId, form.data.id));
			}

			// First update the quiz basic info
			await db
				.update(quiz)
				.set({
					title: form.data.title,
					description: form.data.description,
					timeLimit: form.data.timeLimit
				})
				.where(eq(quiz.id, form.data.id));

			// Delete removed questions and their answers
			const questionIds = form.data.questions.map((q: { id: string }) => q.id).filter(Boolean);
			const removedQuestions = existingQuiz.questions.filter(
				(q: { id: string }) => !questionIds.includes(q.id)
			);

			for (const q of removedQuestions) {
				await db.delete(answer).where(eq(answer.questionId, q.id));
				await db.delete(question).where(eq(question.id, q.id));
			}

			// Handle questions and answers
			for (const currentQuestion of form.data.questions) {
				let updatedQuestion;

				if (currentQuestion.id) {
					// Delete removed answers for this question
					const answerIds = currentQuestion.answers
						.map((a: { id: string }) => a.id)
						.filter(Boolean);
					const existingQuestion = existingQuiz.questions.find(
						(q: { id: string }) => q.id === currentQuestion.id
					);

					if (existingQuestion) {
						const removedAnswers = existingQuestion.answers.filter(
							(a: { id: string }) => !answerIds.includes(a.id)
						);
						for (const a of removedAnswers) {
							await db.delete(answer).where(eq(answer.id, a.id));
						}
					}

					// Update existing question
					[updatedQuestion] = await db
						.update(question)
						.set({ text: currentQuestion.text, quizId: form.data.id })
						.where(eq(question.id, currentQuestion.id))
						.returning();
				} else {
					// Insert new question
					[updatedQuestion] = await db
						.insert(question)
						.values({
							text: currentQuestion.text,
							quizId: form.data.id
						})
						.returning();
				}

				// Handle answers for this question
				for (const currentAnswer of currentQuestion.answers) {
					if (currentAnswer.id) {
						await db
							.update(answer)
							.set({
								text: currentAnswer.text,
								isCorrect: currentAnswer.isCorrect,
								questionId: updatedQuestion.id
							})
							.where(eq(answer.id, currentAnswer.id));
					} else {
						await db.insert(answer).values({
							text: currentAnswer.text,
							isCorrect: currentAnswer.isCorrect,
							questionId: updatedQuestion.id
						});
					}
				}
			}

			// Get the updated quiz data
			const updatedQuizData = await db.query.quiz.findFirst({
				where: eq(quiz.id, form.data.id),
				with: {
					questions: {
						with: {
							answers: true
						}
					}
				}
			});

			return {
				form: await superValidate(updatedQuizData, zod(quizSchema)),
				success: true
			};
		} catch {
			return fail(400, {
				form,
				success: false,
				message: 'Failed to update quiz'
			});
		}
	}
};

function checkQuizStructuralChanges(existingQuiz: QuizType, newQuiz: QuizType): boolean {
	// Check if questions were added or removed
	if (existingQuiz.questions.length !== newQuiz.questions.length) {
		return true;
	}

	// For each existing question, check if it still exists and has the same structure
	for (const oldQuestion of existingQuiz.questions) {
		const newQuestion = newQuiz.questions.find((q: { id: string }) => q.id === oldQuestion.id);

		// If question was removed or answers changed
		if (
			!newQuestion ||
			oldQuestion.answers.length !== newQuestion.answers.length ||
			// Check if any answer text changed
			!oldQuestion.answers.every((oldAns: { id: string; text: string; isCorrect: boolean }) =>
				newQuestion.answers.some(
					(newAns: { id: string; text: string; isCorrect: boolean }) =>
						newAns.id === oldAns.id &&
						newAns.text === oldAns.text &&
						newAns.isCorrect === oldAns.isCorrect
				)
			)
		) {
			return true;
		}
	}

	return false;
}
