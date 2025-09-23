import { drizzle } from 'drizzle-orm/node-postgres';
async function db() {
  const db = drizzle('node-postgres', process.env.DATABASE_URL);
}

db();

export default db;