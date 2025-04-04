import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	username: text('username').unique(),
	displayUsername: text('display_username'),
	twoFactorEnabled: boolean('two_factor_enabled')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const twoFactor = pgTable('two_factor', {
	id: text('id').primaryKey(),
	secret: text('secret').notNull(),
	backupCodes: text('backup_codes').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

// Application Tables

export const quiz = pgTable('quiz', {
	id: uuid('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	creatorId: text('creator_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const question = pgTable('question', {
	id: uuid('id').primaryKey(),
	quizId: uuid('quiz_id')
		.notNull()
		.references(() => quiz.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const answer = pgTable('answer', {
	id: uuid('id').primaryKey(),
	questionId: uuid('question_id')
		.notNull()
		.references(() => question.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	isCorrect: boolean('is_correct').notNull()
});

export const attempt = pgTable('attempt', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	quizId: uuid('quiz_id')
		.notNull()
		.references(() => quiz.id, { onDelete: 'cascade' }),
	startedAt: timestamp('started_at').notNull(),
	completedAt: timestamp('completed_at')
});

export const attemptAnswer = pgTable('attempt_answer', {
	id: uuid('id').primaryKey(),
	attemptId: uuid('attempt_id')
		.notNull()
		.references(() => attempt.id, { onDelete: 'cascade' }),
	questionId: uuid('question_id')
		.notNull()
		.references(() => question.id, { onDelete: 'cascade' }),
	answerId: uuid('answer_id')
		.notNull()
		.references(() => answer.id, { onDelete: 'cascade' }),
	isCorrect: boolean('is_correct').notNull()
});

export const leaderboard = pgTable('leaderboard', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	quizId: uuid('quiz_id')
		.notNull()
		.references(() => quiz.id, { onDelete: 'cascade' }),
	score: integer('score').notNull(),
	attempts: integer('attempts').notNull(),
	lastAttemptAt: timestamp('last_attempt_at').notNull()
});

// RELATIONS

// --- User ---
export const userRelations = relations(user, ({ many }) => ({
	quizzes: many(quiz),
	attempts: many(attempt),
	leaderboardEntries: many(leaderboard)
}));

// --- Quiz ---
export const quizRelations = relations(quiz, ({ one, many }) => ({
	creator: one(user, {
		fields: [quiz.creatorId],
		references: [user.id]
	}),
	questions: many(question),
	attempts: many(attempt),
	leaderboardEntries: many(leaderboard)
}));

// --- Question ---
export const questionRelations = relations(question, ({ one, many }) => ({
	quiz: one(quiz, {
		fields: [question.quizId],
		references: [quiz.id]
	}),
	answers: many(answer),
	attemptAnswers: many(attemptAnswer)
}));

// --- Answer ---
export const answerRelations = relations(answer, ({ one }) => ({
	question: one(question, {
		fields: [answer.questionId],
		references: [question.id]
	})
}));

// --- Attempt ---
export const attemptRelations = relations(attempt, ({ one, many }) => ({
	user: one(user, {
		fields: [attempt.userId],
		references: [user.id]
	}),
	quiz: one(quiz, {
		fields: [attempt.quizId],
		references: [quiz.id]
	}),
	answers: many(attemptAnswer)
}));

// --- Attempt Answer ---
export const attemptAnswerRelations = relations(attemptAnswer, ({ one }) => ({
	attempt: one(attempt, {
		fields: [attemptAnswer.attemptId],
		references: [attempt.id]
	}),
	question: one(question, {
		fields: [attemptAnswer.questionId],
		references: [question.id]
	}),
	answer: one(answer, {
		fields: [attemptAnswer.answerId],
		references: [answer.id]
	})
}));

// --- Leaderboard ---
export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
	user: one(user, {
		fields: [leaderboard.userId],
		references: [user.id]
	}),
	quiz: one(quiz, {
		fields: [leaderboard.quizId],
		references: [quiz.id]
	})
}));
