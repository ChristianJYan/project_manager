import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

import pg from "pg";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
//const globalForDb = globalThis as unknown as {
  //conn: postgres.Sql | undefined;
//};

//const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
//if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL as string,
});

//export const db = drizzle(conn, { schema });
export const db = drizzle(pool);