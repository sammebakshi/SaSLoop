const pool = require('../db');
const axios = require('axios');
(async () => {
  const targetId = 6;
  const userRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [targetId]);
  let { meta_access_token: token, meta_phone_id: phoneId } = userRes.rows[0] || {};
  
  let isShared = false;
  if (!token || !phoneId) {
     const fallbackRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = 1");
     const fallback = fallbackRes.rows[0] || {};
     token = fallback.meta_access_token;
     phoneId = fallback.meta_phone_id;
     isShared = true;
  }
  console.log("DB check:", { token: !!token, phoneId, isShared });

  if (token && phoneId) {
    try {
      const testRes = await axios.get(`https://graph.facebook.com/v21.0/${phoneId.trim()}`, {
         headers: { "Authorization": `Bearer ${token.trim()}` }
      });
      console.log("Meta Response:", testRes.status, testRes.data);
      console.log("Resulting verified_name:", isShared ? "Shared Channel" : testRes.data.verified_name);
    } catch (e) {
      console.error("Meta API error:", e.response?.data || e.message);
    }
  }
  pool.end();
})().catch(console.error);
