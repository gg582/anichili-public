require('dotenv').config();

const bcrypt = require('bcrypt');
const { createClient } = require('@libsql/client');

// Replace with your Turso DB credentials from .env.local
const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function createAdminAccount() {
  const username = 'admin';
  const password = 'admin'; // Change this to your desired password!
  
  // Hash the password with a salt round of 10
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Insert the hashed password into the database
    await db.execute({
      sql: 'INSERT INTO admins (username, password) VALUES (?, ?)',
      args: [username, hashedPassword],
    });
    
    console.log(`Admin account "${username}" created successfully with a hashed password!`);
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    process.exit();
  }
}

// Check if tables exist before running
async function setupDatabaseAndRun() {
  try {
    // Create admins table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    console.log('Admins table ensured to exist.');
    
    // Now, create the admin account
    await createAdminAccount();
  } catch (error) {
    console.error('Initial setup failed:', error);
  }
}

setupDatabaseAndRun();
