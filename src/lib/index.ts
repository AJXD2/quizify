import type { InferSelectModel } from 'drizzle-orm';
import {
	quiz,
	user,
	question,
	answer,
	attempt,
	attemptAnswer,
	leaderboard
} from './server/db/schema';

// For SELECT queries - base types from the database
export type Quiz = InferSelectModel<typeof quiz>;
export type User = InferSelectModel<typeof user>;
export type Question = InferSelectModel<typeof question>;
export type Answer = InferSelectModel<typeof answer>;
export type Attempt = InferSelectModel<typeof attempt>;
export type AttemptAnswer = InferSelectModel<typeof attemptAnswer>;
export type Leaderboard = InferSelectModel<typeof leaderboard>;

// Relation types - using Drizzle's type system
export type QuizWithCreator = Quiz & {
	creator: Profile;
};

export type QuizWithQuestions = Quiz & {
	questions: Question[];
};

export type QuizWithQuestionsAndAnswers = Quiz & {
	questions: (Question & {
		answers: Answer[];
	})[];
};

export type QuizWithCreatorAndQuestions = Quiz & {
	creator: Profile;
	questions: Question[];
};

export type CompleteAttempt = Attempt & {
	answers: (AttemptAnswer & {
		question: Question;
		answer: Answer;
	})[];
	user: Profile;
	quiz: QuizWithQuestionsAndAnswers;
};

// Profile type
export type Profile = Pick<User, 'id' | 'username' | 'image' | 'displayUsername'>;

// Type for pagination options
export type PaginationOptions = {
	page?: number;
	limit?: number;
};

// Pagination result type
export type PaginatedResult<T> = {
	items: T[];
	page: number;
	totalPages: number;
	totalCount: number;
};
