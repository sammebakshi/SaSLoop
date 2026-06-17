const axios = require("axios");
const pool = require("../db");

async function run() {
  try {
    const res = await pool.query(
      "SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = 48"
    );
    const { meta_access_token: token, meta_phone_id: phoneId } = res.rows[0];
    console.log("Token length:", token.length);

    console.log("Attempting to GET /app...");
    try {
      const appRes = await axios.get(`https://graph.facebook.com/v21.0/app`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("GET /app Success:", appRes.data);
    } catch (err) {
      console.error("GET /app Failed:", err.response?.data || err.message);
    }

    console.log("\nAttempting to GET /debug_token...");
    try {
      const debugRes = await axios.get(
        `https://graph.facebook.com/debug_token?input_token=${token}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("GET /debug_token Success:", debugRes.data);
    } catch (err) {
      console.error("GET /debug_token Failed:", err.response?.data || err.message);
    }

    console.log("\nAttempting to GET /me...");
    try {
      const meRes = await axios.get(`https://graph.facebook.com/v21.0/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("GET /me Success:", meRes.data);
    } catch (err) {
      console.error("GET /me Failed:", err.response?.data || err.message);
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

run();
