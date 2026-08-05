const pool = require("../db");

async function checkColors() {
  try {
    const res = await pool.query("SELECT id, settings FROM restaurants WHERE id = 3");
    console.log("Restaurant 3 settings:", JSON.stringify(res.rows[0]?.settings?.theme, null, 2));

    const dig = await pool.query("SELECT * FROM digital_order_settings WHERE id = 1");
    console.log("Digital settings row:", dig.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

checkColors();
