const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config({ path: 'c:/Users/Sajad/Desktop/SaSLoop/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const TARGET_USER_ID = 55;
const OTHER_USER_ID = 56;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

async function runTest() {
  try {
    console.log("--- STARTING WIPE ENDPOINT INTEGRATION TEST ---");

    // 1. Generate JWT Token for TARGET_USER_ID
    const token = jwt.sign(
      { id: TARGET_USER_ID, bizId: TARGET_USER_ID, role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`Generated JWT token for user ${TARGET_USER_ID}`);

    // 2. Prepare database. Make sure we have mock data for target user and other user.
    // Clean up first to have a clean start
    await pool.query("DELETE FROM orders WHERE user_id IN ($1, $2)", [TARGET_USER_ID, OTHER_USER_ID]);
    await pool.query("DELETE FROM customer_loyalty WHERE user_id IN ($1, $2)", [TARGET_USER_ID, OTHER_USER_ID]);
    await pool.query("DELETE FROM kots WHERE user_id IN ($1, $2)", [TARGET_USER_ID, OTHER_USER_ID]);

    console.log("Inserting mock records...");
    
    // Insert mock orders
    await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, order_reference, customer_name, total_price, payment_status, status, items) 
       VALUES ($1, 3, 'REF-TEST-1', 'Target Customer', 150.00, 'paid', 'completed', '[]')`,
      [TARGET_USER_ID]
    );
    await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, order_reference, customer_name, total_price, payment_status, status, items) 
       VALUES ($1, 3, 'REF-TEST-2', 'Other Customer', 200.00, 'paid', 'completed', '[]')`,
      [OTHER_USER_ID]
    );

    // Insert mock customer loyalty
    await pool.query(
      `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent)
       VALUES ($1, '1234567890', 'Loyal Cust 1', 100, 50.00, 500.00)`,
      [TARGET_USER_ID]
    );
    await pool.query(
      `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent)
       VALUES ($1, '0987654321', 'Loyal Cust 2', 50, 20.00, 200.00)`,
      [OTHER_USER_ID]
    );

    // Insert mock KOTs
    await pool.query(
      `INSERT INTO kots (user_id, table_number, status, items)
       VALUES ($1, 'Table-5', 'pending', '[]')`,
      [TARGET_USER_ID]
    );
    await pool.query(
      `INSERT INTO kots (user_id, table_number, status, items)
       VALUES ($1, 'Table-10', 'pending', '[]')`,
      [OTHER_USER_ID]
    );

    // Check counts before wipe
    const targetOrderCountBefore = (await pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [TARGET_USER_ID])).rows[0].count;
    const otherOrderCountBefore = (await pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [OTHER_USER_ID])).rows[0].count;
    const targetLoyaltyCountBefore = (await pool.query("SELECT COUNT(*) FROM customer_loyalty WHERE user_id = $1", [TARGET_USER_ID])).rows[0].count;
    const otherLoyaltyCountBefore = (await pool.query("SELECT COUNT(*) FROM customer_loyalty WHERE user_id = $1", [OTHER_USER_ID])).rows[0].count;

    console.log("\nCounts BEFORE wipe:");
    console.log(`Target User ${TARGET_USER_ID}: orders = ${targetOrderCountBefore}, loyalty = ${targetLoyaltyCountBefore}`);
    console.log(`Other User ${OTHER_USER_ID}: orders = ${otherOrderCountBefore}, loyalty = ${otherLoyaltyCountBefore}`);

    if (parseInt(targetOrderCountBefore) === 0 || parseInt(otherOrderCountBefore) === 0) {
      throw new Error("Failed to insert mock data!");
    }

    // 3. Make HTTP request to /api/pos/clear-sales-data
    console.log("\nSending POST request to /api/pos/clear-sales-data...");
    const response = await axios.post(
      'http://localhost:5000/api/pos/clear-sales-data',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    // 4. Verify counts AFTER wipe
    const targetOrderCountAfter = (await pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [TARGET_USER_ID])).rows[0].count;
    const otherOrderCountAfter = (await pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [OTHER_USER_ID])).rows[0].count;
    const targetLoyaltyCountAfter = (await pool.query("SELECT COUNT(*) FROM customer_loyalty WHERE user_id = $1", [TARGET_USER_ID])).rows[0].count;
    const otherLoyaltyCountAfter = (await pool.query("SELECT COUNT(*) FROM customer_loyalty WHERE user_id = $1", [OTHER_USER_ID])).rows[0].count;

    console.log("\nCounts AFTER wipe:");
    console.log(`Target User ${TARGET_USER_ID}: orders = ${targetOrderCountAfter}, loyalty = ${targetLoyaltyCountAfter}`);
    console.log(`Other User ${OTHER_USER_ID}: orders = ${otherOrderCountAfter}, loyalty = ${otherLoyaltyCountAfter}`);

    // Assertions
    let passed = true;
    if (parseInt(targetOrderCountAfter) === 0 && parseInt(targetLoyaltyCountAfter) === 0) {
      console.log("\n✅ SUCCESS: Target user data was completely wiped!");
    } else {
      console.log("\n❌ FAILURE: Target user data was NOT wiped completely.");
      passed = false;
    }

    if (parseInt(otherOrderCountAfter) > 0 && parseInt(otherLoyaltyCountAfter) > 0) {
      console.log("✅ SUCCESS: Other user's data was NOT affected!");
    } else {
      console.log("❌ FAILURE: Other user's data was deleted or altered.");
      passed = false;
    }

    if (passed) {
      console.log("\n⭐️ ALL ENDPOINT INTEGRATION TESTS PASSED SUCCESSFULLY! ⭐️");
    } else {
      console.log("\n❌ INTEGRATION TEST FAILED!");
    }

  } catch (err) {
    console.error("Test failed with error:", err.message);
    if (err.response) {
      console.error("Response error data:", err.response.data);
    }
  } finally {
    await pool.end();
  }
}

runTest();
