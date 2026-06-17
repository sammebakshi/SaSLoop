const pool = require("../db");
const axios = require("axios");

async function testConnection() {
  try {
    const res = await pool.query(
      "SELECT id, username, meta_phone_id, meta_access_token FROM app_users WHERE id = 48"
    );
    const user = res.rows[0];
    if (!user || !user.meta_phone_id || !user.meta_access_token) {
      console.log("❌ User 48 has no Meta credentials configured.");
      return;
    }

    const phoneId = user.meta_phone_id.trim();
    const token = user.meta_access_token.trim();

    console.log(`Testing Meta connection for ${user.username} (${phoneId})...`);

    try {
      const metaRes = await axios.get(`https://graph.facebook.com/v21.0/${phoneId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      console.log("✅ Meta Token is VALID!");
      console.log("Response:", metaRes.data);
    } catch (metaErr) {
      console.log("❌ Meta Token is INVALID or Expired!");
      if (metaErr.response) {
        console.log("Meta API Error:", JSON.stringify(metaErr.response.data, null, 2));
      } else {
        console.log("Network Error:", metaErr.message);
      }
    }
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
