ALTER TYPE "TeamRoles" ADD VALUE 'Owner';--> statement-breakpoint
ALTER TABLE "project_manager_user_teams" ADD COLUMN "id" serial NOT NULL;