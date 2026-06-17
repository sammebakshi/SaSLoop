const jwt = require("jsonwebtoken");
const axios = require("axios");
const pool = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

async function testDynamicSync() {
  try {
    console.log("=== STARTING DYNAMIC SYNC TEST ===");

    // 1. Generate JWT token for User ID 48 (shahetehzeeb)
    const token = jwt.sign(
      { id: 48, email: "shahetehzeeb@example.com", role: "user" },
      JWT_SECRET
    );
    console.log("Generated JWT Token.");

    const headers = { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    // Find or resolve an active outlet menu for user 48
    const menuRes = await pool.query(
      "SELECT id FROM outlet_menus WHERE outlet_id = '48' OR user_id = 48 LIMIT 1"
    );
    if (menuRes.rows.length === 0) {
      throw new Error("No outlet menu configuration found for outlet ID 48");
    }
    const menuId = menuRes.rows[0].id;
    console.log(`Using outlet menu ID: ${menuId}`);

    // Generate unique short code for testing
    const uniqueShortCode = "TEST-" + Math.floor(Math.random() * 100000);
    const testItem = {
      menu_id: menuId,
      short_code: uniqueShortCode,
      item_name: "DYNAMIC SYNC TEST BURGER",
      price: "189.50",
      category_id: "",
      department_id: "",
      tax_group_id: "",
      food_type: "Veg",
      description: "A delicious test burger created dynamically.",
      current_stock: 50,
      item_type: "0",
      hsn_code: "9901",
      recommended: true,
      availability: true
    };

    // 2. CREATE ITEM via API POST /api/brand/outlet-menu-items
    console.log("Creating new menu item via API...");
    const createRes = await axios.post(
      "http://localhost:5000/api/brand/outlet-menu-items",
      testItem,
      { headers }
    );
    const newItem = createRes.data;
    console.log(`Created item ID: ${newItem.id} in outlet_menu_items.`);
    
    // Check if synced to business_items
    console.log("Verifying sync in business_items...");
    const biCheckRes1 = await pool.query(
      "SELECT * FROM business_items WHERE user_id = 48 AND product_name = $1",
      [testItem.item_name]
    );
    
    if (biCheckRes1.rows.length === 0) {
      throw new Error("❌ Sync failed: item not found in business_items after creation!");
    }
    const biItem = biCheckRes1.rows[0];
    console.log(`✅ Success: Found synced item in business_items. ID: ${biItem.id}, Price: ${biItem.price}, Stock: ${biItem.stock_count}`);

    // 3. EDIT ITEM via API PUT /api/brand/outlet-menu-items/:id
    console.log(`Modifying item ID: ${newItem.id} via API (changing price, description, and image URL)...`);
    const updatePayload = {
      price: "249.99",
      description: "A super premium updated dynamic test burger.",
      image_url: "/uploads/premium_burger_test.jpg",
      availability: false,
      current_stock: "25"
    };

    const updateRes = await axios.put(
      `http://localhost:5000/api/brand/outlet-menu-items/${newItem.id}`,
      updatePayload,
      { headers }
    );
    console.log("Update API call returned success.");

    // Check if updates synced to business_items
    console.log("Verifying updates synced to business_items...");
    const biCheckRes2 = await pool.query(
      "SELECT * FROM business_items WHERE id = $1 AND user_id = 48",
      [biItem.id]
    );
    
    const updatedBi = biCheckRes2.rows[0];
    console.log("Updated business_item details in DB:", {
      price: updatedBi.price,
      description: updatedBi.description,
      image_url: updatedBi.image_url,
      availability: updatedBi.availability,
      stock_count: updatedBi.stock_count
    });

    if (
      parseFloat(updatedBi.price) === 249.99 &&
      updatedBi.description === updatePayload.description &&
      updatedBi.image_url === updatePayload.image_url &&
      updatedBi.availability === false &&
      updatedBi.stock_count === 25
    ) {
      console.log("✅ SUCCESS: All updates synced perfectly to business_items!");
    } else {
      throw new Error("❌ Sync verification failed: updated values do not match in business_items!");
    }

    // Cleanup test data
    console.log("Cleaning up test data from DB...");
    await pool.query("DELETE FROM outlet_menu_items WHERE id = $1", [newItem.id]);
    await pool.query("DELETE FROM business_items WHERE id = $1", [biItem.id]);
    console.log("Cleanup complete.");
    console.log("=== ALL TESTS PASSED SUCCESSFULLY ===");

  } catch (err) {
    console.error("Test Error:", err.response ? err.response.data : err.message);
  } finally {
    await pool.end();
  }
}

testDynamicSync();
