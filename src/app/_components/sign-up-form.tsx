"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { z } from "zod";
import { db } from "~/server/db";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "~/app/lib/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";


import { api } from "~/trpc/react";

// Zod schema for the form data
const formSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters").max(31, "Username must be at most 31 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username must consist of letters, numbers, '-', or '_'"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password must be at most 255 characters").regex(/^[a-zA-Z0-9_\-!#$]+$/, "Username must consist of lowercase letters, numbers, '!', '#', '$', '-', or '_'"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters").max(255, "Confirm Password must be at most 255 characters").regex(/^[a-zA-Z0-9_\-!#$]+$/, "Username must consist of lowercase letters, numbers, '!', '#', '$', '-', or '_'"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function SignUp() {
  // These are the states for the form and errors
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e : React.FormEvent) => {
    /**
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: z.zodResolver(formSchema),
      defaultValues: {
        username: "",
        password: "",
        confirmPassword: "",
      },
    }); */
    e.preventDefault();
    // Validate form data against the schema
    try {
      const formData = { username, password, confirmPassword };
      // Validate form data against the schema
      formSchema.parse(formData);

      setIsSubmitting(true);

      // Replace with your API call
      // await api.post.createUser({ username, password });

      // Redirect to the home page change later to a dashboard?
      router.push("/");

      router.refresh();
      // Sets the username, password, and confirm password to empty strings
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      // Clear any previous form errors
      setErrors([]);
      // Handle Zod validation error
    } catch (error) {
      // Handle Zod validation error and fill the errors array with the error messages
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map(err => err.message));
      } else {
        console.error('Error signing up:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* Check for any errors and display them */}
      {formError.length > 0 && (
        <ul className="text-red-500">
          {formError.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      {/* Next three are for input fields username,password, and confirm password */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      {/* Submission button which will swap buetween loading and submitting probably swap this later */}
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
