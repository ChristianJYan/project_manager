"use client";

import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";

import { z } from "zod";
import { signInSchema } from "~/app/Types/types";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInUser } from "../actions/auth.actions";

export function SignIn() {
  // These are the states for the form and errors
  const router = useRouter();
  const [formError, setErrors] = useState<string[]>([]);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log(data);
      try{
      const res = await SignInUser(data);

      if (res.error) {
        // Assuming res.error is a string array
        setErrors([res.error]);
      } else if (res.success) {
        console.log("Signed In");
        router.push("/");
      }
    } catch (error) {
      console.error("Error during signin:", error);
      setErrors(["An unexpected error occurred."]);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {/* Display any form errors */}
      {formError.length > 0 && (
        <ul className="text-red-500">
          {formError.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      {/* Username input field */}
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Username"
            className="w-full rounded-full px-4 py-2 text-black"
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="password"
            placeholder="Password"
            className="w-full rounded-full px-4 py-2 text-black"
          />
        )}
      />
      {/* Submit button */}
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