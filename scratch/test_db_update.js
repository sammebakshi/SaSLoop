const pool = require("../db");

async function testUpdate() {
  try {
    const activeState = {
      tableBills: { "table-1": [{ name: "Pizza", qty: 2, price: 120 }] },
      tableStatuses: { "table-1": "OCCUPIED" },
      tableBillNumbers: { "table-1": "B-999" },
      tableActiveTimestamps: { "table-1": Date.now() },
      tables: [{ id: "table-1", table_name: "Table 1", is_temporary: false }]
    };

    console.log("Saving test activeState...");
    const updateRes = await pool.query(
      `UPDATE restaurants 
       SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), '{active_pos_state}', $1::jsonb) 
       WHERE user_id = 48 RETURNING settings`,
      [JSON.stringify(activeState)]
    );
    console.log("Updated settings keys:", Object.keys(updateRes.rows[0].settings));
    console.log("Updated settings active_pos_state:", updateRes.rows[0].settings.active_pos_state);

    // Clean up/Reset
    console.log("Resetting activeState...");
    await pool.query(
      `UPDATE restaurants 
       SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), '{active_pos_state}', 'null'::jsonb) 
       WHERE user_id = 48`
    );
    console.log("Reset completed.");
  } catch (err) {
    console.error("Test Update Error:", err);
  } finally {
    await pool.end();
  }
}

testUpdate();
