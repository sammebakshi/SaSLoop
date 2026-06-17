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
    const res = await axios.get("http://127.0.0.1:5000/api/catalog", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Total items returned in catalog:", res.data.length);
    const items = res.data.filter(item => 
      ['KABAB', 'RISTA', 'GOSHTABA', 'DANIYA KORMA'].includes(item.name) || 
      ['KABAB', 'RISTA', 'GOSHTABA', 'DANIYA KORMA'].includes(item.product_name)
    );
    console.log("Filtered items of interest:");
    console.dir(items, { depth: null });
  } catch (err) {
    console.error("API Error:", err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

test();
