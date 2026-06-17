const jwt = require("jsonwebtoken");
const axios = require("axios");
const pool = require("../db");

const JWT_SECRET = "secretkey";
const API_URL = "http://localhost:5000/api";

// Generate token for shahetehzeeb (id: 48, role: 'user')
const user = { id: 48, bizId: 48, email: "shahetehzeeb@example.com", role: "user" };
const token = jwt.sign(
  { id: user.id, bizId: user.bizId, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: "1h" }
);

const headers = { Authorization: `Bearer ${token}` };

async function verify() {
  try {
    console.log("=== Verification Started ===");
    console.log("Token Generated:", token);

    // 1. Test GET /categories (Should return categories for outlet 48 and global ones)
    console.log("\n1. Testing GET /api/brand/categories...");
    let res = await axios.get(`${API_URL}/brand/categories`, { headers });
    console.log(`Successfully fetched ${res.data.length} categories.`);
    const customCats = res.data.filter(c => c.outlet_id === 48);
    console.log(`Outlet-specific categories count (outlet_id = 48): ${customCats.length}`);
    console.table(customCats.map(c => ({ id: c.id, name: c.name, outlet_id: c.outlet_id })));

    // 2. Test POST /categories (Should create category with outlet_id = 48)
    console.log("\n2. Testing POST /api/brand/categories...");
    const testCatName = "TEST CAT " + Date.now();
    res = await axios.post(`${API_URL}/brand/categories`, {
      name: testCatName,
      is_active: true
    }, { headers });
    console.log("Created Category:", res.data);
    if (res.data.outlet_id === 48) {
      console.log("✅ SUCCESS: Category created with fallback outlet_id = 48.");
    } else {
      console.error("❌ FAILURE: Category created with wrong/null outlet_id:", res.data.outlet_id);
    }

    // Clean up created test category
    if (res.data.id) {
      await pool.query("DELETE FROM categories WHERE id = $1", [res.data.id]);
      console.log("Cleaned up test category.");
    }

    // 3. Test GET /api/option-groups (Should return option groups for outlet 48)
    console.log("\n3. Testing GET /api/option-groups...");
    res = await axios.get(`${API_URL}/option-groups`, { headers });
    console.log(`Successfully fetched ${res.data.length} option groups.`);
    const customOgs = res.data.filter(o => o.outlet_id === 48 || o.outlet_id === '48');
    console.log(`Outlet-specific option groups count (outlet_id = 48): ${customOgs.length}`);
    console.table(res.data.map(o => ({ id: o.id, name: o.name, outlet_id: o.outlet_id })));

    // 4. Test POST /api/option-groups (Should create option group with outlet_id = 48)
    console.log("\n4. Testing POST /api/option-groups...");
    const testOgName = "TEST OG " + Date.now();
    res = await axios.post(`${API_URL}/option-groups`, {
      name: testOgName,
      is_active: true,
      min_selectable: 0,
      max_selectable: 1,
      is_addon: false,
      associated_options: [],
      linked_main_items: []
    }, { headers });
    console.log("Created Option Group:", res.data);
    // Fetch newly created option group to check outlet_id (POST returns the row, let's verify)
    const dbOg = await pool.query("SELECT * FROM option_groups WHERE id = $1", [res.data.id]);
    const createdOg = dbOg.rows[0];
    if (createdOg.outlet_id === 48) {
      console.log("✅ SUCCESS: Option group created with fallback outlet_id = 48.");
    } else {
      console.error("❌ FAILURE: Option group created with wrong/null outlet_id:", createdOg.outlet_id);
    }

    // Clean up created test option group
    if (res.data.id) {
      await pool.query("DELETE FROM option_groups WHERE id = $1", [res.data.id]);
      console.log("Cleaned up test option group.");
    }

  } catch (err) {
    console.error("Verification failed with error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  } finally {
    await pool.end();
  }
}

verify();
