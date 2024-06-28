ALTER TABLE "user" ADD COLUMN "user_agent" varchar(128);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password_hash" varchar(128);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_user_agent_unique" UNIQUE("user_agent");