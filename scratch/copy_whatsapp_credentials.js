const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // 1. Fetch credentials from user ID 1
    const masterRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = 1");
    const { meta_access_token: token, meta_phone_id: phoneId } = masterRes.rows[0] || {};
    
    if (!token || !phoneId) {
      console.log("No credentials found on Master Admin (User ID 1).");
      return;
    }
    
    console.log(`Found credentials on User ID 1. Phone ID: ${phoneId}`);
    
    // 2. Update user ID 48 with these credentials
    const updateRes = await pool.query(
      "UPDATE app_users SET meta_access_token = $1, meta_phone_id = $2 WHERE id = 48 RETURNING id, username",
      [token, phoneId]
    );
    
    if (updateRes.rows.length > 0) {
      console.log(`Successfully copied credentials to ${updateRes.rows[0].username} (ID: 48)`);
    } else {
      console.log("Failed to find or update User ID 48.");
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}
run();
