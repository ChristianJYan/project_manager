ALTER TABLE "project_manager_user_teams" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_manager_teams" ADD CONSTRAINT "project_manager_teams_name_unique" UNIQUE("name");