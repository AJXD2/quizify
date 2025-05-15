import { db } from '$lib/server/db';
import { attempt, quiz } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { and, asc, count, desc, eq, ilike } from 'drizzle-orm';

export const load = (async ({ url }) => {
	// Parse query parameters
	let page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;
	const searchQuery = url.searchParams.get('q')?.trim();
	const difficulty = url.searchParams.get('difficulty')?.trim();
	const sortBy = url.searchParams.get('sort') || 'newest';

	if (isNaN(page) || page < 1) {
		page = 1;
	}

	const offset = (page - 1) * limit;

	// Build where conditions
	const whereConditions = [];
	if (searchQuery) {
		whereConditions.push(ilike(quiz.title, `%${searchQuery}%`));
	}

	if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
		whereConditions.push(eq(quiz.difficulty, difficulty as 'easy' | 'medium' | 'hard'));
	}

	// Direct query to get the quizzes with creators and attempts
	const quizzes = await db.query.quiz.findMany({
		where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
		with: {
			creator: {
				columns: {
					id: true,
					username: true,
					image: true,
					displayUsername: true
				}
			},
			attempts: true,
			questions: true
		},
		orderBy:
  			sortBy === 'newest'
				? [desc(quiz.createdAt)]
				: sortBy === 'oldest'
				? [asc(quiz.createdAt)]
				: [desc(quiz.createdAt)],
		limit,
		offset
	});

	// Sort by attempt count if needed (in memory)
	if (sortBy === 'most-attempts') {
		quizzes.sort((a, b) => (b.attempts?.length || 0) - (a.attempts?.length || 0));
	} else if (sortBy === 'least-attempts') {
		quizzes.sort((a, b) => (a.attempts?.length || 0) - (b.attempts?.length || 0));
	}

	// Get total count with filters
	const [{ value: totalCount }] = await db
		.select({ value: count() })
		.from(quiz)
		.where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

	const totalPages = Math.ceil(totalCount / limit);

	return {
		quizzes,
		page,
		totalPages,
		totalCount,
		filters: {
			search: searchQuery || null,
			difficulty: difficulty || null,
			sort: sortBy
		}
	};
}) satisfies PageServerLoad;
