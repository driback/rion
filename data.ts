import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { integration } from '~/server/db/schemas';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db: PostgresJsDatabase = drizzle(migrationClient);

const main = async () => {
  console.log('Migrating database...');
  await db.insert(integration).values({ name: 'google-drive' });
};

main();
