require("dotenv").config();
const pool = require("../src/config/database");

// [name, species, breed, age]
const seedPets = [
  ["Bolt", "Dog", "Golden Retriever", 3],
  ["Whiskers", "Cat", "Siamese", 2],
  ["Hopscotch", "Rabbit", "Holland Lop", 1],
  ["Nimbus", "Bird", "Cockatiel", 4],
];

async function setupDatabase() {
  try {
    console.log("Setting up database...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(100) NOT NULL,
        email         VARCHAR(150) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role          VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at    TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("Users table created successfully (or already exists).");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        species    VARCHAR(100) NOT NULL,
        breed      VARCHAR(100),
        age        INTEGER,
        owner_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("Pets table created successfully (or already exists).");

    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS count FROM pets",
    );
    if (rows[0].count === 0) {
      for (const [name, species, breed, age] of seedPets) {
        await pool.query(
          "INSERT INTO pets (name, species, breed, age) VALUES ($1, $2, $3, $4)",
          [name, species, breed, age],
        );
      }
      console.log(`Seeded ${seedPets.length} sample pets.`);
    } else {
      console.log("Pets table already has data, skipping seed.");
    }
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    pool.end();
  }
}

setupDatabase();
