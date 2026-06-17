const pool = require("../db");

async function checkCounts() {
  try {
    const contactsRes = await pool.query("SELECT COUNT(*) FROM marketing_contacts");
    console.log("Total rows in marketing_contacts:", contactsRes.rows[0].count);

    const loyaltyRes = await pool.query("SELECT COUNT(*) FROM customer_loyalty");
    console.log("Total rows in customer_loyalty:", loyaltyRes.rows[0].count);

    const distinctUsers = await pool.query("SELECT DISTINCT user_id FROM customer_loyalty");
    console.log("Distinct user_ids in customer_loyalty:", distinctUsers.rows.map(r => r.user_id));

    for (const row of distinctUsers.rows) {
      const uid = row.user_id;
      const segmentRes = await pool.query(`
        WITH customer_data AS (
          SELECT 
            customer_number,
            points,
            total_spent,
            last_visit,
            COALESCE(name, 'Customer') as name,
            EXTRACT(DAY FROM (NOW() - last_visit)) as days_since_visit
          FROM customer_loyalty
          WHERE user_id = $1
        )
        SELECT 
          COUNT(*) FILTER (WHERE total_spent > 5000 OR points > 1000) as vip_count,
          COUNT(*) FILTER (WHERE days_since_visit > 14) as at_risk_count,
          COUNT(*) as total_count
        FROM customer_data
      `, [uid]);
      console.log(`User ${uid} segment counts:`, segmentRes.rows[0]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkCounts();
