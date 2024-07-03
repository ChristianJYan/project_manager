"use server";

import { z } from "zod";
import { signUpSchema } from "~/app/Types/types";
import { signInSchema } from "~/app/Types/types";
import { db } from "~/server/db";
import { userTable } from "~/server/db/schema";
import { lucia } from "../lib/auth";
import { cookies } from "next/headers";
import argon2 from  "@node-rs/argon2";
import { verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cache } from "react";
import type { Session, User } from "lucia";
import { eq } from "drizzle-orm";

export const validateRequest = cache(
  async (): Promise<{ user: User | null; session: Session | null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
    return { user: null, session: null };
    }
  
    const result = await lucia.validateSession(sessionId);
  
    try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } else if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    } catch (err) {
    console.error("Failed to set cookie:", err);
    }
  
    return result;
  }
);

export const logout = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
    cookies().delete(lucia.sessionCookieName);
  }
};

export const SignInUser = async ( values: z.infer<typeof signInSchema>) => {
    console.log(values);
    const username = values.username;
    const password = values.password;  
    const [existingUser] = await db.select().from(userTable).where(eq(userTable.username, username)).limit(1);

    if (!existingUser || !existingUser.password_hash) {
      return { 
        error: "Username was not found" 
      };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    if (!validPassword) {
      return {
        error: "Incorrect password"
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return {success : true};
}


export const RegisterUser = async ( values: z.infer<typeof signUpSchema>) => {
    console.log(values)

    const password = values.password
    let passwordHash
    try {
        passwordHash = await argon2.hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1
        });
    } catch (error) {
        return {
            error: "Failed to hash password."
        };
    }
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