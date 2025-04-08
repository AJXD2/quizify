import { and, eq, desc } from 'drizzle-orm';
import { db } from '..';
import { leaderboard } from '../schema';

export const leaderboardService = {
	async getQuizLeaderboard(quizId: string, limit = 10) {
		return await db.query.leaderboard.findMany({
			where: eq(leaderboard.quizId, quizId),
			with: {
				user: {
					columns: {
						username: true,
						image: true,
						displayUsername: true
					}
				}
			},
			orderBy: [desc(leaderboard.score)],
			limit
		});
	},

	async getUserRank(quizId: string, userId: string) {
		return await db.query.leaderboard.findFirst({
			where: and(eq(leaderboard.quizId, quizId), eq(leaderboard.userId, userId))
		});
	},

	async updateLeaderboard(quizId: string, userId: string, score: number) {
		const existing = await db.query.leaderboard.findFirst({
			where: and(eq(leaderboard.quizId, quizId), eq(leaderboard.userId, userId))
		});

		if (existing) {
			if (existing.score < score) {
				const [updated] = await db
					.update(leaderboard)
					.set({
						score,
						attempts: existing.attempts + 1,
						lastAttemptAt: new Date()
					})
					.where(and(eq(leaderboard.quizId, quizId), eq(leaderboard.userId, userId)))
					.returning();
				return updated;
			} else {
				const [updated] = await db
					.update(leaderboard)
					.set({
						attempts: existing.attempts + 1,
						lastAttemptAt: new Date()
					})
					.where(and(eq(leaderboard.quizId, quizId), eq(leaderboard.userId, userId)))
					.returning();
				return updated;
			}
		}

		const [newEntry] = await db
			.insert(leaderboard)
			.values({
				quizId,
				userId,
				score,
				attempts: 1,
				lastAttemptAt: new Date()
			})
			.returning();
		return newEntry;
	}
};
