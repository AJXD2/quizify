import { inArray } from 'drizzle-orm';
import { db } from '../src/lib/server/db'; // adjust path as needed
import {
	quiz,
	question,
	answer,
	attempt,
	attemptAnswer,
	leaderboard
} from '../src/lib/server/db/schema';

const seed = async () => {
	const userId = '2bxk6edGiRyaxGAMqgrBhYVO7oFMkJMZ'; // replace with actual user ID
	console.time('Seeding quizzes');
	// Seed quizzes
	const quizzes = [
		{
			title: 'General Knowledge Quiz',
			description: 'A basic test of your knowledge',
			questions: [
				{
					text: 'What is the capital of France?',
					answers: [
						{ text: 'Paris', isCorrect: true },
						{ text: 'London', isCorrect: false },
						{ text: 'Berlin', isCorrect: false },
						{ text: 'Madrid', isCorrect: false }
					]
				},
				{
					text: 'What is 2 + 2?',
					answers: [
						{ text: '4', isCorrect: true },
						{ text: '5', isCorrect: false },
						{ text: '3', isCorrect: false },
						{ text: '22', isCorrect: false }
					]
				},
				{
					text: 'Which planet is known as the Red Planet?',
					answers: [
						{ text: 'Mars', isCorrect: true },
						{ text: 'Venus', isCorrect: false },
						{ text: 'Jupiter', isCorrect: false },
						{ text: 'Mercury', isCorrect: false }
					]
				}
			]
		},
		{
			title: 'Science Quiz',
			description: 'Test your scientific knowledge',
			questions: [
				{
					text: 'What is the chemical symbol for water?',
					answers: [
						{ text: 'H2O', isCorrect: true },
						{ text: 'CO2', isCorrect: false },
						{ text: 'O2', isCorrect: false },
						{ text: 'NaCl', isCorrect: false }
					]
				},
				{
					text: 'What is the largest organ in the human body?',
					answers: [
						{ text: 'Skin', isCorrect: true },
						{ text: 'Liver', isCorrect: false },
						{ text: 'Heart', isCorrect: false },
						{ text: 'Brain', isCorrect: false }
					]
				},
				{
					text: 'What is the speed of light?',
					answers: [
						{ text: '299,792,458 meters per second', isCorrect: true },
						{ text: '150,000,000 meters per second', isCorrect: false },
						{ text: '343 meters per second', isCorrect: false },
						{ text: '1,000,000 meters per second', isCorrect: false }
					]
				}
			]
		},
		{
			title: 'Technology Quiz',
			description: 'How well do you know your tech?',
			questions: [
				{
					text: 'Who founded Apple Inc.?',
					answers: [
						{ text: 'Steve Jobs, Steve Wozniak, and Ronald Wayne', isCorrect: true },
						{ text: 'Bill Gates and Paul Allen', isCorrect: false },
						{ text: 'Mark Zuckerberg', isCorrect: false },
						{ text: 'Elon Musk', isCorrect: false }
					]
				},
				{
					text: 'What does CPU stand for?',
					answers: [
						{ text: 'Central Processing Unit', isCorrect: true },
						{ text: 'Computer Personal Unit', isCorrect: false },
						{ text: 'Central Process Utility', isCorrect: false },
						{ text: 'Core Processing Unit', isCorrect: false }
					]
				},
				{
					text: 'Which programming language is this app built with?',
					answers: [
						{ text: 'JavaScript/TypeScript', isCorrect: true },
						{ text: 'Python', isCorrect: false },
						{ text: 'Java', isCorrect: false },
						{ text: 'C++', isCorrect: false }
					]
				}
			]
		}
	];

	// Insert all quizzes
	for (const quizData of quizzes) {
		// Insert quiz
		const [insertedQuiz] = await db
			.insert(quiz)
			.values({
				title: quizData.title,
				description: quizData.description,
				createdAt: new Date(),
				updatedAt: new Date(),
				creatorId: userId
			})
			.returning({ id: quiz.id });

		const quizId = insertedQuiz.id;

		// Insert questions for this quiz
		const questionInserts = quizData.questions.map((q) => ({
			quizId: quizId,
			text: q.text,
			createdAt: new Date(),
			updatedAt: new Date()
		}));

		const insertedQuestions = await db
			.insert(question)
			.values(questionInserts)
			.returning({ id: question.id });

		// Insert answers for each question
		for (let i = 0; i < insertedQuestions.length; i++) {
			const questionId = insertedQuestions[i].id;
			const answerData = quizData.questions[i].answers;

			await db.insert(answer).values(
				answerData.map((a) => ({
					questionId,
					text: a.text,
					isCorrect: a.isCorrect
				}))
			);
		}

		// Create an attempt for each quiz
		const [insertedAttempt] = await db
			.insert(attempt)
			.values({
				userId,
				quizId: quizId,
				startedAt: new Date(),
				completedAt: new Date()
			})
			.returning({ id: attempt.id });

		// Get all answers for this quiz's questions
		const questionIds = insertedQuestions.map((q) => q.id);
		const allAnswers = await db
			.select()
			.from(answer)
			.where(inArray(answer.questionId, questionIds));

		// Insert attempt answers
		await db.insert(attemptAnswer).values(
			allAnswers.map((a) => ({
				attemptId: insertedAttempt.id,
				questionId: a.questionId,
				answerId: a.id,
				isCorrect: a.isCorrect
			}))
		);

		// Add to leaderboard
		await db.insert(leaderboard).values({
			userId,
			quizId: quizId,
			score: Math.floor(Math.random() * 100) + 1, // Random score between 1-100
			attempts: 1,
			lastAttemptAt: new Date()
		});
	}

	console.timeEnd('Seeding quizzes');
	console.log('✅ DB seeded');
	process.exit(0);
};

seed().catch((e) => {
	console.error('❌ Failed to seed DB', e);
	process.exit(1);
});
