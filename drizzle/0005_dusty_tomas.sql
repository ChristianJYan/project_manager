ALTER TABLE "session" RENAME TO "project_manager_session";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "project_manager_user";--> statement-breakpoint
ALTER TABLE "project_manager_user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "project_manager_user" DROP CONSTRAINT "user_user_agent_unique";--> statement-breakpoint
ALTER TABLE "project_manager_session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_manager_session" ADD CONSTRAINT "project_manager_session_user_id_project_manager_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."project_manager_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project_manager_user" ADD CONSTRAINT "project_manager_user_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "project_manager_user" ADD CONSTRAINT "project_manager_user_user_agent_unique" UNIQUE("user_agent");