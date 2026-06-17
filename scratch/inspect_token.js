const axios = require('axios');
const pool = require('../db');

async function inspectToken() {
  try {
    const res = await pool.query("SELECT meta_access_token FROM app_users WHERE id = 48");
    const token = res.rows[0]?.meta_access_token?.trim();
    if (!token) {
      console.log("No token found for user 48.");
      return;
    }

    console.log("Inspecting token...");
    
    // First, get token info using debug_token endpoint
    const debugUrl = `https://graph.facebook.com/debug_token?input_token=${token}`;
    const debugRes = await axios.get(debugUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("=== TOKEN DEBUG INFO ===");
    console.log(JSON.stringify(debugRes.data, null, 2));

    // Also get business account info or phone number info
    const meRes = await axios.get("https://graph.facebook.com/v21.0/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("\n=== '/me' ENDPOINT INFO ===");
    console.log(JSON.stringify(meRes.data, null, 2));

  } catch (err) {
    if (err.response) {
      console.error("Meta API Error:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Error:", err.message);
    }
  } finally {
    await pool.end();
  }
}

inspectToken();
