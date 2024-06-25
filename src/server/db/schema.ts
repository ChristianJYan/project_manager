// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import pg from "pg";
import {
  index,
  pgEnum,
  pgTable,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

import { db } from "./index"
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `project_manager_${name}`);

export const UserRoles = pgEnum("UserRoles", ["admin", "user"]);

export const userTable = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 128 }),
    email: varchar("email", { length: 32 }).unique(),
    password: varchar("password", { length: 32 }),
    googleId: varchar("google_id", { length: 256 }),
    role: UserRoles("role").notNull().default("user"),
    //maybe have a different table for more scpeficic details about the user
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
);

export const sessionTable = pgTable(
  "session", 
  {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);
/**
const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export default adapter; */