const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const envPath = 'c:/Users/Sajad/Desktop/SaSLoop/.env';
const serverPath = 'c:/Users/Sajad/Desktop/SaSLoop/server.js';
require('dotenv').config({ path: envPath });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// User 56: Unauthorized Staff (allow_clear_data_on_logout is false)
const UNAUTHORIZED_USER_ID = 56;
// User 57: Authorized Staff (allow_clear_data_on_logout is true)
const AUTHORIZED_USER_ID = 57;
// Target business ID
const BIZ_ID = 55;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setupPermissions() {
  console.log("Setting up staff permissions in DB...");
  const unauthorizedPerms = {
    pos_access: {
      Settings: {
        allow_clear_data_on_logout: false
      }
    }
  };
  await pool.query(
    "UPDATE app_users SET staff_permissions = $1 WHERE id = $2",
    [JSON.stringify(unauthorizedPerms), UNAUTHORIZED_USER_ID]
  );

  const authorizedPerms = {
    pos_access: {
      Settings: {
        allow_clear_data_on_logout: true
      }
    }
  };
  await pool.query(
    "UPDATE app_users SET staff_permissions = $1 WHERE id = $2",
    [JSON.stringify(authorizedPerms), AUTHORIZED_USER_ID]
  );
  console.log("Permissions set successfully.");
}

async function setupMockData() {
  console.log("Inserting mock records...");
  // Clear first
  await pool.query("DELETE FROM orders WHERE user_id = $1", [BIZ_ID]);
  await pool.query("DELETE FROM customer_loyalty WHERE user_id = $1", [BIZ_ID]);

  // Insert mock orders
  await pool.query(
    `INSERT INTO orders (user_id, restaurant_id, order_reference, customer_name, total_price, payment_status, status, items) 
     VALUES ($1, 3, 'REF-TEST-WIPE', 'Target Customer', 150.00, 'paid', 'completed', '[]')`,
    [BIZ_ID]
  );

  // Insert mock customer loyalty
  await pool.query(
    `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent)
     VALUES ($1, '1234567890', 'Loyal Cust Wipe', 100, 50.00, 500.00)`,
    [BIZ_ID]
  );
}

async function runSecurityTests() {
  let envOriginalContent = '';
  let serverOriginalContent = '';
  try {
    envOriginalContent = fs.readFileSync(envPath, 'utf8');
    serverOriginalContent = fs.readFileSync(serverPath, 'utf8');
  } catch (err) {
    console.error("Could not read setup files:", err);
    process.exit(1);
  }

  try {
    await setupPermissions();

    const unauthorizedToken = jwt.sign(
      { id: UNAUTHORIZED_USER_ID, bizId: BIZ_ID, role: 'staff' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const authorizedToken = jwt.sign(
      { id: AUTHORIZED_USER_ID, bizId: BIZ_ID, role: 'staff' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ========================================================
    // CASE 1: DEVELOPMENT MODE BYPASS
    // ========================================================
    console.log("\n--- TEST CASE 1: Development Mode (NODE_ENV=development) ---");
    await setupMockData();

    console.log("Sending wipe request for unauthorized user (User 56) in Dev mode...");
    let response1 = await axios.post(
      'http://localhost:5000/api/pos/clear-sales-data',
      {},
      { headers: { Authorization: `Bearer ${unauthorizedToken}` } }
    );
    console.log("Dev mode response status:", response1.status);
    console.log("Dev mode response message:", response1.data.message);

    // Verify wipe succeeded
    const ordersCount1 = (await pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [BIZ_ID])).rows[0].count;
    if (parseInt(ordersCount1) === 0) {
      console.log("✅ Case 1 Passed: Unauthorized user successfully cleared data in development mode.");
    } else {
      console.log("❌ Case 1 Failed: Data was not cleared.");
    }

    // ========================================================
    // SWITCH TO PRODUCTION MODE
    // ========================================================
    console.log("\nSwitching NODE_ENV to production in .env...");
    const prodEnvContent = envOriginalContent.replace('NODE_ENV=development', 'NODE_ENV=production');
    fs.writeFileSync(envPath, prodEnvContent, 'utf8');
    
    console.log("Touching server.js to force nodemon restart...");
    fs.writeFileSync(serverPath, serverOriginalContent + '\n// FORCE RESTART FOR PROD TEST', 'utf8');

    console.log("Waiting 4 seconds for nodemon to detect change and restart...");
    await sleep(4000);

    // ========================================================
    // CASE 2: PRODUCTION MODE - UNAUTHORIZED STAFF (SHOULD FAIL)
    // ========================================================
    console.log("\n--- TEST CASE 2: Production Mode (NODE_ENV=production) - Unauthorized Staff ---");
    await setupMockData();

    console.log("Sending wipe request for unauthorized user (User 56) in Prod mode...");
    try {
      await axios.post(
        'http://localhost:5000/api/pos/clear-sales-data',
        {},
        { headers: { Authorization: `Bearer ${unauthorizedToken}` } }
      );
      console.log("❌ Case 2 Failed: Request succeeded but should have been blocked with 403.");
    } catch (err) {
      if (err.response) {
        console.log("Prod mode unauthorized response status:", err.response.status);
        console.log("Prod mode unauthorized error:", err.response.data.error);
        if (err.response.status === 403) {
          console.log("✅ Case 2 Passed: Request correctly blocked with 403 Forbidden!");
        } else {
          console.log("❌ Case 2 Failed: Blocked with status " + err.response.status);
        }
      } else {
        console.log("❌ Case 2 Failed: Connection error:", err.message);
      }
    }

    // Verify data is STILL present
    const ordersCount2 = (await pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [BIZ_ID])).rows[0].count;
    if (parseInt(ordersCount2) > 0) {
      console.log("✅ Case 2 Verified: Data was NOT wiped.");
    } else {
      console.log("❌ Case 2 Warning: Data is missing.");
    }

    // ========================================================
    // CASE 3: PRODUCTION MODE - AUTHORIZED STAFF (SHOULD SUCCEED)
    // ========================================================
    console.log("\n--- TEST CASE 3: Production Mode (NODE_ENV=production) - Authorized Staff ---");
    console.log("Sending wipe request for authorized user (User 57) in Prod mode...");
    
    let response3 = await axios.post(
      'http://localhost:5000/api/pos/clear-sales-data',
      {},
      { headers: { Authorization: `Bearer ${authorizedToken}` } }
    );
    console.log("Prod mode authorized response status:", response3.status);
    console.log("Prod mode authorized message:", response3.data.message);

    // Verify wipe succeeded
    const ordersCount3 = (await pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [BIZ_ID])).rows[0].count;
    if (parseInt(ordersCount3) === 0) {
      console.log("✅ Case 3 Passed: Authorized user successfully cleared data in production mode.");
    } else {
      console.log("❌ Case 3 Failed: Data was not cleared.");
    }

  } catch (err) {
    console.error("Test execution error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  } finally {
    // RESTORE ENV
    console.log("\nRestoring NODE_ENV to development in .env...");
    fs.writeFileSync(envPath, envOriginalContent, 'utf8');
    
    console.log("Restoring server.js...");
    fs.writeFileSync(serverPath, serverOriginalContent, 'utf8');

    console.log("Waiting 4 seconds for nodemon to restart in development mode...");
    await sleep(4000);
    
    await pool.end();
    console.log("Test suite completed.");
  }
}

runSecurityTests();
