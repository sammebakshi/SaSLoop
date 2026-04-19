const pool = require("./db");
const bcrypt = require("bcrypt");

async function hashPasswords() {
  try {
    const res = await pool.query("SELECT id, password FROM app_users");
    console.log(`Checking ${res.rows.length} users...`);

    for (const user of res.rows) {
      const pwd = user.password;
      
      // Basic check to see if it's already a bcrypt hash (starts with $2b$ or $2a$)
      if (pwd && (pwd.startsWith("$2b$") || pwd.startsWith("$2a$"))) {
        console.log(`User ${user.id} already has a hashed password. Skipping.`);
        continue;
      }

      console.log(`Hashing password for User ${user.id}...`);
      const hashed = await bcrypt.hash(pwd || "123456", 10);
      await pool.query("UPDATE app_users SET password = $1 WHERE id = $2", [hashed, user.id]);
    }

    console.log("SUCCESS: All passwords have been hashed.");
    process.exit(0);
  } catch (err) {
    console.error("MIGRATION ERROR:", err);
    process.exit(1);
  }
}

hashPasswords();
