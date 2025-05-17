ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "quiz" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "quiz" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt_answer" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt_answer" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "two_factor" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "two_factor" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "score_idx" ON "attempt" USING btree ("score");--> statement-breakpoint
CREATE INDEX "completed_at_idx" ON "attempt" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "user_quiz_idx" ON "attempt" USING btree ("user_id","quiz_id");--> statement-breakpoint
CREATE INDEX "leaderboard_score_idx" ON "leaderboard" USING btree ("score");--> statement-breakpoint
CREATE INDEX "quiz_score_idx" ON "leaderboard" USING btree ("quiz_id","score");--> statement-breakpoint
CREATE INDEX "leaderboard_user_quiz_idx" ON "leaderboard" USING btree ("user_id","quiz_id");--> statement-breakpoint
CREATE INDEX "title_idx" ON "quiz" USING btree ("title");--> statement-breakpoint
CREATE INDEX "creator_idx" ON "quiz" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "tags_idx" ON "quiz" USING btree ("tags");