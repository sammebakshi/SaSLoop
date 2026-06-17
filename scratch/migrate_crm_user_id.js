const pool = require("../db");

async function run() {
  try {
    console.log("🚀 Starting CRM user_id migration...");

    const res1 = await pool.query(`
      UPDATE customers c
      SET user_id = u.parent_user_id
      FROM app_users u
      WHERE c.user_id = u.id AND u.parent_user_id IS NOT NULL
      RETURNING c.id, c.name, c.user_id
    `);
    console.log(`Updated ${res1.rowCount} rows in customers.`);

    const res2 = await pool.query(`
      UPDATE customer_loyalty cl
      SET user_id = u.parent_user_id
      FROM app_users u
      WHERE cl.user_id = u.id AND u.parent_user_id IS NOT NULL
      RETURNING cl.id, cl.name, cl.user_id
    `);
    console.log(`Updated ${res2.rowCount} rows in customer_loyalty.`);

    const res3 = await pool.query(`
      UPDATE customer_transactions ct
      SET user_id = u.parent_user_id
      FROM app_users u
      WHERE ct.user_id = u.id AND u.parent_user_id IS NOT NULL
      RETURNING ct.id, ct.user_id
    `);
    console.log(`Updated ${res3.rowCount} rows in customer_transactions.`);

    const res4 = await pool.query(`
      UPDATE customer_feedback cf
      SET user_id = u.parent_user_id
      FROM app_users u
      WHERE cf.user_id = u.id AND u.parent_user_id IS NOT NULL
      RETURNING cf.id, cf.user_id
    `);
    console.log(`Updated ${res4.rowCount} rows in customer_feedback.`);

    console.log("🎉 CRM user_id migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await pool.end();
  }
}

run();
