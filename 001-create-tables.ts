// migrations/001-create-tables.ts
import { sql } from 'drizzle-orm';

export default sql`
CREATE TABLE project_manager_post (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;