const pool = require('../db');

async function main() {
  try {
    const result1 = await pool.query(
      "SELECT * FROM app_users WHERE parent_user_id = 12"
    );
    console.log("USERS WITH PARENT_USER_ID = 12:");
    console.table(result1.rows);

    const result2 = await pool.query(
      "SELECT * FROM app_users WHERE username = 'testuser1' OR email = 'testuser1'"
    );
    console.log("\nUSERS WITH USERNAME OR EMAIL = testuser1:");
    console.table(result2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
