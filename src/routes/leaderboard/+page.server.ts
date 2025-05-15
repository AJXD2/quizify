import type { Profile } from '$lib';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';


type ProcessableAttempt = {
	id: string;
	score: number; 
	userId: string;
	quizId: string;
	user: Profile;
	quiz: {
		id: string;
		creatorId: string;
	};

};

type LeaderboardEntry = {
	user: Profile;
	totalScore: number;
	rank: number; // Rank will be assigned
};

export const load = (async () => {
	const allAttemptsRaw = await db.query.attempt.findMany({
		with: {
			user: {
                columns: {
                    id: true,
                    username: true,
                    image: true,
                    displayUsername: true
                }
            }, 
			quiz: {
				columns: {
					id: true,
					creatorId: true
				}
			}
		}
	});

	const processableAttempts: ProcessableAttempt[] = allAttemptsRaw
		.filter((a) => {
			const isProcessable = 
				a &&
				a.user &&
				a.quiz &&
				typeof a.score === 'number' && 
				a.userId !== undefined &&
				a.quizId !== undefined &&
				a.quiz.id !== undefined &&
				a.quiz.creatorId !== undefined;
			return isProcessable;
		})
		.map((a) => ({
			id: a.id,
			score: a.score as number, 
			userId: a.userId,
			quizId: a.quizId,
			user: a.user as Profile, 
			quiz: a.quiz as { id: string; creatorId: string } 
		}));

	const validAttempts = processableAttempts.filter((attempt) => {
		return attempt.quiz.creatorId !== attempt.user.id;
	});

	const bestAttemptPerUserPerQuiz = new Map<string, ProcessableAttempt>();

	validAttempts.forEach((attempt) => {
		const key = `${attempt.userId}-${attempt.quizId}`;
		const existingBest = bestAttemptPerUserPerQuiz.get(key);
		if (!existingBest || attempt.score > existingBest.score) {
			bestAttemptPerUserPerQuiz.set(key, attempt);
		}
	});

	const userAggregatedScores = new Map<string, { user: Profile; totalScore: number }>();

	bestAttemptPerUserPerQuiz.forEach((attempt) => {
		const { user, score } = attempt; 

		const existingEntry = userAggregatedScores.get(user.id);
		if (existingEntry) {
			existingEntry.totalScore += score;
		} else {
			userAggregatedScores.set(user.id, {
				user: user,
				totalScore: score
			});
		}
	});

	const leaderboard: LeaderboardEntry[] = Array.from(userAggregatedScores.values())
		.sort((a, b) => b.totalScore - a.totalScore)
		.map((entry, index) => ({
			...entry,
			rank: index + 1
		}));

	return { leaderboard }; // Only return leaderboard
}) satisfies PageServerLoad;