ALTER TYPE "TeamRoles" ADD VALUE 'teamowner';--> statement-breakpoint
ALTER TABLE "project_manager_teams" ADD COLUMN "description" varchar(128);