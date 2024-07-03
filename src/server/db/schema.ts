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


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `project_manager_${name}`);

export const UserRoles = pgEnum("UserRoles", ["admin", "user"]);

// First table for the user
// maybe move some stuff to a different table? 
export const userTable = pgTable(
  "project_manager_user",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 128 }),
    email: varchar("email", { length: 32 }).unique(),
    username: varchar("user_agent", { length: 128 }).unique(),
    password: varchar("password", { length: 32 }),
    password_hash: varchar("password_hash", { length: 128 }),
    role: UserRoles("role").notNull().default("user"),
    //maybe have a different table for more scpeficic details about the user
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
);

// session table
export const sessionTable = pgTable(
  "project_manager_session", 
  {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});


// Original table from the template project
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

// 
export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
}