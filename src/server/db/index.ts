import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { userTable, sessionTable, posts } from "./schema"; // Import tables
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

// used to manage multiple db servers
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// intereact with db
export const db = drizzle(pool, {
  schema: {
    users: userTable,
    sessions: sessionTable,
    posts: posts,
  },
});

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export default adapter;