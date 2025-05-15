import { createInsertSchema } from 'drizzle-zod';
import { quiz, question, answer } from '$lib/server/db/schema';
import { z } from 'zod';

// Generate base schemas from database tables
const baseAnswerSchema = createInsertSchema(answer);
const baseQuestionSchema = createInsertSchema(question);
const baseQuizSchema = createInsertSchema(quiz);

// Constants for validation
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 100;
const MIN_ANSWERS = 2;
const MAX_ANSWERS = 8;
const MAX_TAG_LENGTH = 20;
const MIN_TIME_LIMIT = 1;
const MAX_TIME_LIMIT = 180; // 3 hours
const MAX_INSTRUCTIONS_LENGTH = 1000;

// Regular expression for valid tag format
const TAG_REGEX = /^[a-zA-Z0-9-]+$/;

// Extend the base schemas with relationships and additional validation
export const answerSchema = baseAnswerSchema.extend({
	id: z.string().uuid().optional(),
	questionId: z.string().uuid().optional(),
	text: z
		.string()
		.min(1, 'Answer text is required')
		.max(500, 'Answer text cannot exceed 500 characters')
		.refine((text) => text.trim().length > 0, 'Answer text cannot be only whitespace')
});

export const questionSchema = baseQuestionSchema
	.extend({
		id: z.string().uuid().optional(),
		quizId: z.string().uuid().optional(),
		text: z
			.string()
			.min(1, 'Question text is required')
			.max(1000, 'Question text cannot exceed 1000 characters')
			.refine((text) => text.trim().length > 0, 'Question text cannot be only whitespace'),
		answers: z
			.array(answerSchema)
			.min(MIN_ANSWERS, `At least ${MIN_ANSWERS} answers are required`)
			.max(MAX_ANSWERS, `Cannot have more than ${MAX_ANSWERS} answers`)
	})
	.refine((data) => data.answers.some((answer) => answer.isCorrect), {
		message: 'At least one answer must be marked as correct',
		path: ['answers']
	})
	.refine(
		(data) => {
			const correctAnswers = data.answers.filter((answer) => answer.isCorrect);
			return correctAnswers.length === 1;
		},
		{
			message: 'Multiple choice questions must have exactly one correct answer',
			path: ['answers']
		}
	)
	.refine(
		(data) => {
			const answerTexts = new Set(data.answers.map((a) => a.text.toLowerCase().trim()));
			return answerTexts.size === data.answers.length;
		},
		{
			message: 'All answers must be unique',
			path: ['answers']
		}
	);

export const quizSchema = baseQuizSchema
	.extend({
		title: z
			.string()
			.min(MIN_TITLE_LENGTH, `Title must be at least ${MIN_TITLE_LENGTH} characters`)
			.max(MAX_TITLE_LENGTH, `Title cannot exceed ${MAX_TITLE_LENGTH} characters`)
			.refine((text) => text.trim().length >= MIN_TITLE_LENGTH, 'Title cannot be only whitespace'),
		description: z
			.string()
			.max(MAX_DESCRIPTION_LENGTH, `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`)
			.optional(),
		timeLimit: z
			.number()
			.int('Time limit must be a whole number')
			.min(MIN_TIME_LIMIT, `Time limit must be at least ${MIN_TIME_LIMIT} minute`)
			.max(MAX_TIME_LIMIT, `Time limit cannot exceed ${MAX_TIME_LIMIT} minutes`)
			.optional(),
		difficulty: z.enum(['easy', 'medium', 'hard']),
		tags: z
			.array(
				z
					.string()
					.max(MAX_TAG_LENGTH, `Tags cannot exceed ${MAX_TAG_LENGTH} characters`)
					.regex(TAG_REGEX, 'Tags can only contain letters, numbers, and hyphens')
			)
			.max(5, 'Cannot have more than 5 tags')
			.optional(),
		instructions: z
			.string()
			.max(
				MAX_INSTRUCTIONS_LENGTH,
				`Instructions cannot exceed ${MAX_INSTRUCTIONS_LENGTH} characters`
			)
			.optional(),
		questions: z
			.array(questionSchema)
			.min(MIN_QUESTIONS, `Quiz must have at least ${MIN_QUESTIONS} question`)
			.max(MAX_QUESTIONS, `Quiz cannot have more than ${MAX_QUESTIONS} questions`)
	})
	.refine(
		(data) => {
			if (data.questions) {
				const questionTexts = new Set(data.questions.map((q) => q.text.toLowerCase().trim()));
				return questionTexts.size === data.questions.length;
			}
			return true;
		},
		{
			message: 'All questions must be unique',
			path: ['questions']
		}
	);

export type QuizType = z.infer<typeof quizSchema>;
export type QuestionType = z.infer<typeof questionSchema>;
export type AnswerType = z.infer<typeof answerSchema>;
