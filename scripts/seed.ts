import { db } from '../src/lib/server/db'; // adjust path as needed
import {
	quiz,
	question,
	answer,
	attempt,
	attemptAnswer,
	leaderboard
} from '../src/lib/server/db/schema';
import { randomUUID } from 'crypto';

const seed = async () => {
	const userId = 'BNcTDyw56iibUa2nSbNNgWLdG3vmJn2d'; // replace with actual user ID

	// Seed quiz
	const quizId = randomUUID();
	await db.insert(quiz).values({
		id: quizId,
		title: 'General Knowledge Quiz',
		description: 'A basic test of your knowledge',
		createdAt: new Date(),
		updatedAt: new Date(),
		creatorId: userId
	});

	// Seed questions
	const questions = [
		{ id: randomUUID(), text: 'What is the capital of France?' },
		{ id: randomUUID(), text: 'What is 2 + 2?' }
	];

	await db.insert(question).values(
		questions.map((q) => ({
			id: q.id,
			quizId,
			text: q.text,
			createdAt: new Date(),
			updatedAt: new Date()
		}))
	);

	// Seed answers
	const answers = [
		{ questionId: questions[0].id, text: 'Paris', isCorrect: true },
		{ questionId: questions[0].id, text: 'London', isCorrect: false },
		{ questionId: questions[1].id, text: '4', isCorrect: true },
		{ questionId: questions[1].id, text: '5', isCorrect: false }
	];

	await db.insert(answer).values(
		answers.map((a) => ({
			id: randomUUID(),
			questionId: a.questionId,
			text: a.text,
			isCorrect: a.isCorrect
		}))
	);

	// Seed attempt
	const attemptId = randomUUID();
	await db.insert(attempt).values({
		id: attemptId,
		userId,
		quizId,
		startedAt: new Date(),
		completedAt: new Date()
	});

	// Seed attempt answers
	const allAnswers = await db.select().from(answer);
	await db.insert(attemptAnswer).values(
		allAnswers.map((a) => ({
			id: randomUUID(),
			attemptId,
			questionId: a.questionId,
			answerId: a.id,
			isCorrect: a.isCorrect
		}))
	);

	// Seed leaderboard
	await db.insert(leaderboard).values({
		id: randomUUID(),
		userId,
		quizId,
		score: 100,
		attempts: 1,
		lastAttemptAt: new Date()
	});

	console.log('✅ DB seeded');
	process.exit(0);
};

seed().catch((e) => {
	console.error('❌ Failed to seed DB', e);
	process.exit(1);
});
