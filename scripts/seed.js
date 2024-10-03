const { db } = require('@vercel/postgres');
const {
  jobs,
  users,
} = require('../db/placeholder-data.js');

async function seedJobs(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Create the "jobs" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        salary VARCHAR(255) NOT NULL,
        posted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log(`Created "jobs" table`);

    // Insert data into the "jobs" table
    const insertedJobs = await Promise.all(
      jobs.map(
        (job) => client.sql`
        INSERT INTO jobs (id, title, company, location, description, salary)
        VALUES (${job.id}, ${job.title}, ${job.company}, ${job.location}, ${job.description}, ${job.salary})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedJobs.length} jobs`);

    return {
      createTable,
      jobs: insertedJobs,
    };
  } catch (error) {
    console.error('Error seeding jobs:', error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(
        (user) => client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedJobs(client);
  await seedUsers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});