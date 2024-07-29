"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { type z } from "zod";
import { teamSchema } from "~/app/Types/types";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterTeam } from "../actions/auth.actions";

export function CreateTeam() {
    const router = useRouter();
    const [formError, setErrors] = useState<string[]>([]);

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof teamSchema>>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
          name: "",
          description:"",
        },
      });

      const onSubmit = async (data: z.infer<typeof teamSchema>) => {
        try {
            const res = await RegisterTeam(data);
            if (res.error) {
                // Assuming res.error is a string array
                setErrors([res.error]);
              } else if (res.success) {
                console.log("Team Created");
                router.push("/");
              }
            } catch (error) {
              console.error("Error during Team creation:", error);
              setErrors(["An unexpected error occurred."]);
        }
    }
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
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Team Name"
                className="w-full rounded-full px-4 py-2 text-black"
              />
            )}
          />
          {/* Description input field */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Description"
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