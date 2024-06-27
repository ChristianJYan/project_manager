"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { api } from "~/trpc/react";

export function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (username.length > 128) {
        alert("Username must be 128 characters or less.");
        return;
    }
    if (username.length <= 6) {
        alert("Username must be 6 characters or more.");
        return;
    }

    if (password.length > 32) {
        alert("Password must be 32 characters or less.");
        return;
    }
    if (password.length <= 6) {
        alert("Password must be 6 characters or more");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }


    setIsSubmitting(true);

    try {
        // Replace with your API call
        // await api.post.createUser({ username, password });
  
        router.refresh(); // Refresh or redirect after successful submission
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        console.error("Error signing up:", error);
      } finally {
        setIsSubmitting(false);
      }
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
