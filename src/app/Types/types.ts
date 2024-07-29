import { pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

// Zod schema for the form data
export const signUpSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters").max(31, "Username must be at most 31 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username must consist of letters, numbers, '-', or '_'"),
    password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password must be at most 255 characters").regex(/^[a-zA-Z0-9_\-!#$]+$/, "Username must consist of lowercase letters, numbers, '!', '#', '$', '-', or '_'"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters").max(255, "Confirm Password must be at most 255 characters").regex(/^[a-zA-Z0-9_\-!#$]+$/, "Username must consist of lowercase letters, numbers, '!', '#', '$', '-', or '_'"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({ 
  username: z.string().min(4, "Username must be at least 4 characters").max(31, "Username must be at most 31 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username must consist of letters, numbers, '-', or '_'"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password must be at most 255 characters").regex(/^[a-zA-Z0-9_\-!#$]+$/, "Username must consist of lowercase letters, numbers, '!', '#', '$', '-', or '_'")});

export const teamSchema = z.object({ 
  name: z.string().min(4, "Team name must be at least 4 characters").max(31, "Username must be at most 31 characters").regex(/^[a-zA-Z0-9_-]+$/, "Team name must consist of letters, numbers, '-', or '_'"),
  description: z.string().min(4, "Description must be at least 4 characters").max(31, "Description must be at most 31 characters").regex(/^[a-zA-Z0-9_-]+$/, "Team description must consist of letters, numbers, '-', or '_'")});

export const addMemberSchema = z.object({ 
  name: z.string().min(4, "Team name must be at least 4 characters").max(31, "Username must be at most 31 characters").regex(/^[a-zA-Z0-9_-]+$/, "Team name must consist of letters, numbers, '-', or '_'"),
  username: z.string().min(4, "Username must be at least 4 characters").max(31, "Username must be at most 31 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username must consist of letters, numbers, '-', or '_'")});

export const UserRoles = pgEnum("UserRoles", ["admin", "user"]);
export const TeamRoles = pgEnum("TeamRoles", ["teamowner","admin", "member"]);
export const ZTeamRoles = z.enum(["teamowner", "admin", "member"]);