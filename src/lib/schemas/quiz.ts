import { createInsertSchema } from 'drizzle-zod';
import { quiz, question, answer } from '$lib/server/db/schema';
import { z } from 'zod';

// Generate base schemas from database tables
const baseAnswerSchema = createInsertSchema(answer);
const baseQuestionSchema = createInsertSchema(question);
const baseQuizSchema = createInsertSchema(quiz);

// Extend the base schemas with relationships and additional validation
export const answerSchema = baseAnswerSchema.extend({
	id: z.string().uuid().optional(),
	questionId: z.string().uuid().optional(),
	text: z.string().min(1, 'Answer text is required')
});

export const questionSchema = baseQuestionSchema
	.extend({
		id: z.string().uuid().optional(),
		quizId: z.string().uuid().optional(),
		text: z.string().min(1, 'Question text is required'),
		answers: z.array(answerSchema).min(2, 'At least 2 answers are required')
	})
	.refine((data) => data.answers.some((answer) => answer.isCorrect), {
		message: 'At least one answer must be marked as correct',
		path: ['answers']
	});

export const quizSchema = baseQuizSchema.extend({
	questions: z.array(questionSchema)
});

export type QuizType = z.infer<typeof quizSchema>;
export type QuestionType = z.infer<typeof questionSchema>;
export type AnswerType = z.infer<typeof answerSchema>;
