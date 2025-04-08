import { and, eq, desc, count, sql } from 'drizzle-orm';
import { db } from '..';
import { quiz, attempt, question, answer } from '../schema';
import type { QuizWithProfile } from '$lib';

export const quizService = {
	async findQuizWithQuestions(quizId: string) {
		return await db.query.quiz.findFirst({
			where: eq(quiz.id, quizId),
			with: {
				questions: {
					with: { answers: true }
				},
				creator: {
					columns: {
						id: true,
						image: true,
						username: true,
						displayUsername: true
					}
				}
			}
		});
	},
	async findQuizWithAttemptsAndQuestions(quizId: string) {
		return await db.query.quiz.findFirst({
			where: eq(quiz.id, quizId),
			with: {
				questions: {
					with: { answers: true }
				},
				creator: {
					columns: {
						id: true,
						image: true,
						username: true,
						displayUsername: true
					}
				},
				attempts: true
			}
		});
	},

	async findAttemptWithAnswers(attemptId: string, userId: string) {
		return await db.query.attempt.findFirst({
			where: and(eq(attempt.id, attemptId), eq(attempt.userId, userId)),
			with: {
				answers: {
					with: {
						question: true,
						answer: true
					}
				},
				user: {
					columns: {
						id: true,
						image: true,
						username: true,
						displayUsername: true
					}
				},
				quiz: {
					with: {
						questions: {
							with: {
								answers: true
							}
						}
					}
				}
			}
		});
	},

	async findUserAttempts(quizId: string, userId: string) {
		return await db.query.attempt.findMany({
			where: and(eq(attempt.quizId, quizId), eq(attempt.userId, userId)),
			with: {
				answers: {
					with: {
						question: true,
						answer: true
					}
				},
				user: {
					columns: {
						id: true,
						image: true,
						username: true,
						displayUsername: true
					}
				}
			},
			orderBy: [desc(attempt.startedAt)]
		});
	},

	async listQuizzes(page: number = 1, limit: number = 20) {
		const offset = (page - 1) * limit;
		const quizzes = await db.query.quiz.findMany({
			orderBy: [desc(quiz.createdAt)],
			with: {
				creator: {
					columns: {
						id: true,
						username: true,
						image: true,
						displayUsername: true
					}
				},
				questions: {
					columns: {
						id: true
					}
				}
			},
			limit,
			offset,
			columns: {
				creatorId: false
			}
		});

		const [{ value: totalCount }] = await db.select({ value: count() }).from(quiz);

		const totalPages = Math.ceil(totalCount / limit);

		return {
			quizzes: quizzes as QuizWithProfile[],
			page,
			totalPages,
			totalCount
		};
	},

	async createQuiz(
		creatorId: string,
		data: {
			title: string;
			description?: string;
			timeLimit?: number;
			difficulty?: 'easy' | 'medium' | 'hard';
			tags?: string[];
			instructions?: string;
		}
	) {
		const [newQuiz] = await db
			.insert(quiz)
			.values({
				...data,
				creatorId,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();
		return newQuiz;
	},

	async addQuestion(
		quizId: string,
		data: {
			text: string;
			answers: Array<{
				text: string;
				isCorrect: boolean;
			}>;
		}
	) {
		const [newQuestion] = await db
			.insert(question)
			.values({
				quizId,
				text: data.text,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();

		await db.insert(answer).values(
			data.answers.map((a) => ({
				questionId: newQuestion.id,
				text: a.text,
				isCorrect: a.isCorrect
			}))
		);

		return newQuestion;
	},

	async updateQuiz(
		quizId: string,
		data: {
			title?: string;
			description?: string;
			timeLimit?: number;
			difficulty?: 'easy' | 'medium' | 'hard';
			tags?: string[];
			instructions?: string;
		}
	) {
		const [updated] = await db
			.update(quiz)
			.set({
				...data,
				updatedAt: new Date()
			})
			.where(eq(quiz.id, quizId))
			.returning();
		return updated;
	},

	async getQuizStats(quizId: string) {
		const result = await db
			.select({
				totalAttempts: count(),
				avgScore: sql<number>`avg(${attempt.score})::float`,
				completionRate: sql<number>`sum(case when ${attempt.completedAt} is not null then 1 else 0 end)::float / count(*)::float`
			})
			.from(attempt)
			.where(eq(attempt.quizId, quizId));

		return result[0];
	}
};
