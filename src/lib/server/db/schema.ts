import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

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
