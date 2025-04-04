import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { quiz, user } from './server/db/schema';

// For SELECT queries (what you get back from the database)
export type TQuiz = InferSelectModel<typeof quiz>;
export type TUser = InferSelectModel<typeof user>;

// For INSERT operations (what you send to the database)
export type TInsertQuiz = InferInsertModel<typeof quiz>;
export type TInsertUser = InferInsertModel<typeof user>;

// For a quiz with its creator relation included
export type TQuizWithCreator = TQuiz & {
	creator: TUser;
};

// For a quiz with creator profile info
export type TQuizWithProfile = Omit<
	TQuiz & {
		creator: Pick<TUser, 'username' | 'image'>;
	},
	'creatorId'
>;
