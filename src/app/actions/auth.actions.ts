"use server";

import { z } from "zod";
import { userSchema } from "~/app/types";
import { db } from "~/server/db";
import { userTable } from "~/server/db/schema";
import { lucia } from "../lib/auth";
import { cookies } from "next/headers";
import argon2 from  "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";

export const RegisterUser = async ( values: z.infer<typeof userSchema>) => {
    console.log(values)

    const password = values.password
    const passwordHash = await argon2.hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });
    const userId = generateIdFromEntropySize(10);
  
    try {
      await db
        .insert(userTable)
        .values({
          id: userId,
          username: values.username,
          password: password,
          password_hash: passwordHash,
        });
  
      const session = await lucia.createSession(userId, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
  
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
      
      return {
        success: true,
        data: {
          userId,
        },
      }
    } catch (error: any) {
      // Check if the error is due to duplicate username
      if (error.code === "23505" && error.constraint === "project_manager_user_user_agent_unique") {
          return {
              error: "Username already exists. Please choose a different username."
          };
      }

      // Handle other errors
      return {
          error: error?.message || "An unexpected error occurred.",
      };
  }
  }