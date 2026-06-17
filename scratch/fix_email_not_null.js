const pool = require("../db");

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("1. Dropping NOT NULL constraint on email...");
    await client.query("ALTER TABLE app_users ALTER COLUMN email DROP NOT NULL");

    console.log("2. Converting empty string emails to NULL...");
    const emailRes = await client.query("UPDATE app_users SET email = NULL WHERE email = '' RETURNING id, username");
    console.log(`Updated ${emailRes.rowCount} email records to NULL.`);

    console.log("3. Converting empty string phones to NULL...");
    const phoneRes = await client.query("UPDATE app_users SET phone = NULL WHERE phone = '' RETURNING id, username");
    console.log(`Updated ${phoneRes.rowCount} phone records to NULL.`);

    await client.query("COMMIT");
    console.log("Migration completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
