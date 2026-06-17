const { Pool } = require('pg');
const axios = require('axios');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function testVerification(userId) {
  try {
    const userRes = await pool.query("SELECT username, meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [userId]);
    let { username, meta_access_token: token, meta_phone_id: phoneId } = userRes.rows[0] || {};
    
    console.log(`Verifying credentials for ${username} (ID: ${userId})...`);
    
    let isShared = false;
    if (!token || !phoneId) {
      console.log("No custom keys found, falling back to Master Admin (User ID 1)...");
      const fallbackRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = 1");
      const fallback = fallbackRes.rows[0] || {};
      token = fallback.meta_access_token;
      phoneId = fallback.meta_phone_id;
      isShared = true;
    }
    
    console.log(`Using Phone ID: ${phoneId}`);
    
    if (!token || !phoneId) {
      console.log("Result: NOT CONFIGURABLE (Credentials missing)");
      return;
    }
    
    try {
      const testRes = await axios.get(`https://graph.facebook.com/v21.0/${phoneId.trim()}`, {
         headers: { "Authorization": `Bearer ${token.trim()}` }
      });
      if (testRes.status === 200) {
         console.log(`Result: CONNECTED!${isShared ? ' (Shared)' : ''}`);
         console.log("  Verified Name:", testRes.data.verified_name);
         console.log("  Display Phone:", testRes.data.display_phone_number);
      }
    } catch (metaErr) {
      console.log("Result: DISCONNECTED (Meta API Error)");
      console.log("  Error message:", metaErr.response?.data?.error?.message || metaErr.message);
    }
  } catch (err) {
    console.error("Verification logic exception:", err.message);
  } finally {
    await pool.end();
  }
}

testVerification(48);
