import { and, eq, desc, sql } from 'drizzle-orm';
import { db } from '..';
import { attempt, attemptAnswer, answer } from '../schema';
import type { AttemptAnswer } from '$lib';
import { count } from 'drizzle-orm';

export const attemptService = {
	async createAttempt(userId: string, quizId: string) {
		const [newAttempt] = await db
			.insert(attempt)
			.values({
				userId,
				quizId,
				startedAt: new Date()
			})
			.returning();
		return newAttempt;
	},

	async submitAnswer(attemptId: string, questionId: string, answerId: string) {
		const selectedAnswer = await db.query.answer.findFirst({
			where: eq(answer.id, answerId)
		});

		if (!selectedAnswer) {
			throw new Error('Answer not found');
		}

		const [submittedAnswer] = await db
			.insert(attemptAnswer)
			.values({
				attemptId,
				questionId,
				answerId,
				isCorrect: selectedAnswer.isCorrect
			})
			.returning();

		return submittedAnswer;
	},

	async completeAttempt(attemptId: string) {
		const answers = await db.query.attemptAnswer.findMany({
			where: eq(attemptAnswer.attemptId, attemptId)
		});

		const totalQuestions = answers.length;
		const correctAnswers = answers.filter((a) => a.isCorrect).length;
		const score = Math.round((correctAnswers / totalQuestions) * 100);

		const [updatedAttempt] = await db
			.update(attempt)
			.set({
				completedAt: new Date(),
				score,
				timeSpent: sql<number>`EXTRACT(EPOCH FROM (NOW() - ${attempt.startedAt}))::integer`
			})
			.where(eq(attempt.id, attemptId))
			.returning();

		return updatedAttempt;
	},

	async forfeitAttempt(attemptId: string, userId: string) {
		const [deletedAttempt] = await db
			.delete(attempt)
			.where(and(eq(attempt.id, attemptId), eq(attempt.userId, userId)))
			.returning();
		return deletedAttempt;
	},

	async getAttemptAnswers(attemptId: string): Promise<AttemptAnswer[]> {
		return await db.query.attemptAnswer.findMany({
			where: eq(attemptAnswer.attemptId, attemptId),
			with: {
				answer: true,
				question: true
			}
		});
	},

	async getUserAttemptStats(userId: string) {
		const result = await db
			.select({
				totalAttempts: count(),
				avgScore: sql<number>`avg(${attempt.score})::float`,
				completedAttempts: sql<number>`sum(case when ${attempt.completedAt} is not null then 1 else 0 end)`,
				avgTimeSpent: sql<number>`avg(${attempt.timeSpent})::float`
			})
			.from(attempt)
			.where(eq(attempt.userId, userId));

		return result[0];
	},

	async getRecentAttempts(userId: string, limit: number = 5) {
		return await db.query.attempt.findMany({
			where: eq(attempt.userId, userId),
			with: {
				quiz: true,
				answers: {
					with: {
						question: true,
						answer: true
					}
				}
			},
			orderBy: [desc(attempt.startedAt)],
			limit
		});
	},

	async getActiveAttempt(userId: string, quizId: string) {
		return await db.query.attempt.findFirst({
			where: and(
				eq(attempt.userId, userId),
				eq(attempt.quizId, quizId),
				sql`${attempt.completedAt} IS NULL`
			),
			with: {
				answers: {
					with: {
						question: true,
						answer: true
					}
				}
			}
		});
	}
};
