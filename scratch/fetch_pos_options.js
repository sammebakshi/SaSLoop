const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: require('path').join(__dirname, '../.env') });

async function run() {
  try {
    const userId = 49; // shahetehzeebpos
    const bizId = 48;  // parent_user_id
    const token = jwt.sign(
        { id: userId, bizId, role: 'staff', isPOS: true },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "24h" }
    );

    console.log("Mock Token Generated successfully.");
    console.log("Requesting GET http://localhost:5000/api/pos/option-groups...");
    const res = await axios.get("http://localhost:5000/api/pos/option-groups", {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Response Status:", res.status);
    console.log("Response Data:");
    console.dir(res.data, { depth: null });
  } catch (e) {
    console.error("Request failed:", e.message);
    if (e.response) {
      console.error("Response data:", e.response.data);
    }
  }
}

run();
