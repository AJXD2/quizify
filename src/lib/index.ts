import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import {
	quiz,
	user,
	question,
	answer,
	attempt,
	attemptAnswer,
	leaderboard
} from './server/db/schema';

// For SELECT queries (what you get back from the database)
export type Quiz = InferSelectModel<typeof quiz>;
export type User = InferSelectModel<typeof user>;
export type Question = InferSelectModel<typeof question>;
export type Answer = InferSelectModel<typeof answer>;
export type Attempt = InferSelectModel<typeof attempt>;
export type AttemptAnswer = InferSelectModel<typeof attemptAnswer>;
export type Leaderboard = InferSelectModel<typeof leaderboard>;

// For INSERT operations (what you send to the database)
export type InsertQuiz = InferInsertModel<typeof quiz>;
export type InsertUser = InferInsertModel<typeof user>;
export type InsertQuestion = InferInsertModel<typeof question>;
export type InsertAnswer = InferInsertModel<typeof answer>;
export type InsertAttempt = InferInsertModel<typeof attempt>;
export type InsertAttemptAnswer = InferInsertModel<typeof attemptAnswer>;
export type InsertLeaderboard = InferInsertModel<typeof leaderboard>;

// For a quiz with its creator relation included
export type QuizWithCreator = Quiz & {
	creator: User;
};

// For a quiz with creator profile info
export type QuizWithProfile = Omit<
	Quiz & {
		creator: Pick<User, 'username' | 'image'>;
	},
	'creatorId'
>;

// Type for filters
export type WhereCondition = SQL | undefined;

// Type for pagination options
export type PaginationOptions = {
	page?: number;
	limit?: number;
};

// Utility type for relationships
export type WithRelations<T, R extends Record<string, unknown>> = T & R;
