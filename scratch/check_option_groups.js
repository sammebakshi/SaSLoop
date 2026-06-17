const jwt = require("jsonwebtoken");
const axios = require("axios");

const JWT_SECRET = "secretkey";

// Generate token for user 49 (which maps to bizId 48)
const token = jwt.sign(
  { id: 49, bizId: 48, email: "shahetehzeebpos@gmail.com", role: "POS" },
  JWT_SECRET
);

async function test() {
  try {
    const res = await axios.get("http://127.0.0.1:5000/api/pos/option-groups", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Total option groups returned:", res.data.length);
    console.dir(res.data, { depth: null });
  } catch (err) {
    console.error("API Error:", err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

test();
