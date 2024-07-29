DO $$ BEGIN
 CREATE TYPE "public"."TeamRoles" AS ENUM('admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_manager_teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" varchar(128),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_manager_user_teams" (
	"user_id" text NOT NULL,
	"team_id" text NOT NULL,
	"role" "TeamRoles" DEFAULT 'member' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_manager_user_teams" ADD CONSTRAINT "project_manager_user_teams_user_id_project_manager_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."project_manager_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_manager_user_teams" ADD CONSTRAINT "project_manager_user_teams_team_id_project_manager_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."project_manager_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project_manager_user" DROP COLUMN IF EXISTS "google_id";