const pool = require("../db");

async function run() {
  try {
    console.log("Starting deletion of all sales and customers data...");

    // Order of tables to truncate (or we can use TRUNCATE ... CASCADE)
    const tables = [
      'rider_locations',
      'customer_transactions',
      'customer_loyalty',
      'pending_redemptions',
      'pending_auths',
      'chat_messages',
      'marketing_contacts',
      'customer_feedback',
      'conversation_sessions',
      'scheduled_messages',
      'reservations',
      'pre_orders',
      'kots',
      'orders',
      'customers'
    ];

    for (const table of tables) {
      try {
        const res = await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        console.log(`Successfully truncated table: ${table}`);
      } catch (err) {
        // If table doesn't exist, log and continue
        if (err.code === '42P01') {
          console.warn(`Table ${table} does not exist. Skipping.`);
        } else {
          console.error(`Error truncating table ${table}:`, err.message);
        }
      }
    }

    console.log("All sales and customers data has been deleted successfully!");
  } catch (err) {
    console.error("Failed to clear data:", err);
  } finally {
    await pool.end();
  }
}

run();
