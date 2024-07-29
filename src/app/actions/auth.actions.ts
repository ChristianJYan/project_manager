"use server";

import { type z } from "zod";
import { type addMemberSchema, type signUpSchema, type teamSchema, type ZTeamRoles} from "~/app/Types/types";
import { type signInSchema } from "~/app/Types/types";
import { db } from "~/server/db";
import { teamsTable, userTable, userTeamTable} from "~/server/db/schema";
import { lucia } from "../lib/auth";
import { cookies } from "next/headers";
import argon2 from  "@node-rs/argon2";
import { verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cache } from "react";
import type { Session, User } from "lucia";
import { and, eq, or } from "drizzle-orm";
import { type DatabaseError } from "pg";
import { v4 } from 'uuid';
export const validateRequest = cache(
  async (): Promise<{ user: User | null; session: Session | null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return { user: null, session: null };
    }
  
    const result = await lucia.validateSession(sessionId);
  
    try {
      if (result.session?.fresh) {
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

export async function checkTeamAccess(teamName: string) {
  console.log("Checking team access for:", teamName);
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { hasAccess: false, user: null };
  }

  const { user } = await lucia.validateSession(sessionId);
  if (!user) {
    return { hasAccess: false};
  }

  // Check team membership
  try {
    const teamMembership = await db
      .select({ id: userTeamTable.id })
      .from(userTeamTable)
      .innerJoin(teamsTable, eq(userTeamTable.teamId, teamsTable.id))
      .where(
        and(
          eq(userTeamTable.userId, user.id),
          eq(teamsTable.name, teamName)
        )
      )
      .limit(1);

    const hasAccess = teamMembership.length > 0;
    return hasAccess;
  } catch (error) {
    return { error: "User was not found in this team." };
  }
}

export const fetchUserTeams = async () => {

  const { user } = await validateRequest();
  if (!user) {
    return { 
      error: "Username was not found" 
    };
  }
  const [existingUser] = await db.
  select().
  from(userTable).
  where(eq(userTable.username, user.username)).
  limit(1);

  if (!existingUser?.password_hash) {
    return { 
      error: "Username was not found" 
    };
  }

  try {
    const teamData = await db
      .select({
        id: teamsTable.id,
        name: teamsTable.name
      })
      .from(teamsTable)
      .innerJoin(userTeamTable, eq(userTeamTable.teamId, teamsTable.id))
      .innerJoin(userTable, eq(userTeamTable.userId, userTable.id))
      .where(eq(userTable.username, user.username));

    return teamData;
  } catch (error) {
    console.error("Error fetching team names:", error);
    return { error: "Internal Server Error" };
  }
};

export const logout = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
    cookies().delete(lucia.sessionCookieName);
  }
};

export const RegisterUserToTeam = async (userId: string, teamId: string, role: z.infer<typeof ZTeamRoles>) => {
  try {
      const userteamId = v4();
      
      await db
          .insert(userTeamTable)
          .values({
              id:userteamId,
              userId:userId,
              teamId:teamId,
              role: role
          });

      return { success: true };
  } catch (error) {
      return { error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
};

export const RegisterTeam = async ( values: z.infer<typeof teamSchema>) => {
    console.log(values);
    const name = values.name;
    const desc = values.description;
    const teamId = v4();
    try {
        const { user } = await validateRequest();
        if (!user) {
          return { 
            error: "Username was not found" 
          };
        }
        const [existingUser] = await db.
        select().
        from(userTable).
        where(eq(userTable.username, user.username)).
        limit(1);

        if (!existingUser?.password_hash) {
          return { 
            error: "Username was not found" 
          };
        }

        await db
        .insert(teamsTable)
        .values({
          id: teamId,
          name: name,
          description: desc
        });

        try {
          await RegisterUserToTeam(existingUser?.id, teamId, "teamowner"); // Add user-team association
        } catch (error) {
            return { 
              error: "Issue Regiestering User to UserTeam"
            };
        }

        return {
          success: true,
          data: {
            teamId,
          },
        }
    }   catch (error) {
        if (error instanceof Error && 'code' in error && 'constraint' in error) {
          const dbError = error as DatabaseError;
          if (dbError.code === "23505" && dbError.constraint === "project_manager_teams_name_unique") {
            return {
              error: "Team name already exists. Please choose a different Team name."
            };
          }
        }
        return {
          error: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
  }

export const AddMemberToTeam = async (values: z.infer<typeof addMemberSchema>) => {
  const { user } = await validateRequest();
  if (!user) {
    return { 
      error: "User was not found" 
    };
  }

  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, user.username))
    .limit(1);

  if (!existingUser?.id) {
    return { 
      error: "User was not found" 
    };
  }

  const [existingTeam] = await db
    .select()
    .from(teamsTable)
    .where(eq(teamsTable.name, values.name))
    .limit(1);

  if (!existingTeam?.id) {
    return { 
      error: "Team Name was not found" 
    };
  }

  const [userTeamRole] = await db
    .select()
    .from(userTeamTable)
    .where(and(
      eq(userTeamTable.userId, existingUser.id),
      eq(userTeamTable.teamId, existingTeam.id),
      or(
        eq(userTeamTable.role, "teamowner"),
        eq(userTeamTable.role, "admin"))
    ))
    .limit(1);

  if (!userTeamRole) {
    return { 
      error: "You do not have permission to add members to this team" 
    };
  }

  const [newUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, values.username))
    .limit(1);

  if (!newUser?.id) {
    return { 
      error: "Member Username was not found" 
    };
  }

  // Register the user to the team with the role of "member"
  try {
    await RegisterUserToTeam(newUser.id, existingTeam.id, "member"); // Add user-team association
    return { success: true };
  } catch (error) {
    return { 
      error: "Issue Registering User to UserTeam"
    };
  }
};

export const SignInUser = async ( values: z.infer<typeof signInSchema>) => {
    console.log(values);
    const username = values.username;
    const password = values.password;  
    const [existingUser] = await db.
    select().
    from(userTable).
    where(eq(userTable.username, username)).
    limit(1);

    if (!existingUser?.password_hash) {
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
    } catch (error) {
        // Check if error is of type DatabaseError
        if (error instanceof Error && 'code' in error && 'constraint' in error) {
          const dbError = error as DatabaseError;
          if (dbError.code === "23505" && dbError.constraint === "project_manager_user_user_agent_unique") {
            return {
              error: "Username already exists. Please choose a different username."
            };
          }
        }
      
        // Handle other errors
        return {
          error: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
      }
}

export async function fetchTeamDetails(teamName: string) {
  try {
    console.log("Fetching team details for:", teamName);
    const [team] = await db
      .select({
        name: teamsTable.name,
        description: teamsTable.description,
      })
      .from(teamsTable)
      .where(eq(teamsTable.name, teamName))
      .limit(1);
    console.log("Team query result:", team);
    if (!team) {
      throw new Error('Team not found');
    }

    const members = await db
      .select({ name: userTable.username })
      .from(userTeamTable)
      .innerJoin(teamsTable, eq(userTeamTable.teamId, teamsTable.id))
      .innerJoin(userTable, eq(userTeamTable.userId, userTable.id))
      .where(eq(teamsTable.name, teamName));
      console.log("Members query result:", members);
      
    return {
      ...team,
      members: members.map(m => m.name),
    };
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw error;
  }
}