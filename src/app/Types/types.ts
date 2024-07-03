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