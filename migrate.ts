import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db: PostgresJsDatabase = drizzle(migrationClient);

const main = async () => {
  console.log('Migrating database...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  await migrationClient.end();
  console.log('Database migrated successfully!');
};

main();
