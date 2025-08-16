import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.DATABASE_URL as string,
  authToken: process.env.DATABASE_AUTH_TOKEN as string,
});

export const createSchema = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS animations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image TEXT,
        year INTEGER,
        season TEXT,
        pv_url TEXT,
        opening_url TEXT,
        ending_url TEXT,
        contributor TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        version_history TEXT
      );
    `);
    // Add a table for admin accounts
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    console.log("Database schema created successfully!");
  } catch (e) {
    console.error("Failed to create schema:", e);
  }
};
