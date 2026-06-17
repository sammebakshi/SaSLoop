const pool = require("../db");

async function simulateSync() {
  try {
    const activeState = {
      tables: [
        { id: "table-5", table_name: "Table 5", is_temporary: false },
        { id: "temp-pickup-123", table_name: "Pickup Guest", is_temporary: true, original_order_type: "PICKUP" }
      ],
      tableBills: {
        "table-5": [
          { name: "Chicken Biryani", qty: 2, price: 250 },
          { name: "Garlic Naan", qty: 3, price: 40 }
        ],
        "temp-pickup-123": [
          { name: "Butter Chicken", qty: 1, price: 320 },
          { name: "Jeera Rice", qty: 1, price: 120 }
        ]
      },
      tableStatuses: {
        "table-5": "SAVED",
        "temp-pickup-123": "SAVED"
      },
      tableBillNumbers: {
        "table-5": "B-501",
        "temp-pickup-123": "B-502"
      },
      tableActiveTimestamps: {
        "table-5": Date.now() - 300000, // 5 mins ago
        "temp-pickup-123": Date.now() - 120000 // 2 mins ago
      }
    };

    console.log("Simulating POS active state upload...");
    const updateRes = await pool.query(
      `UPDATE restaurants 
       SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), '{active_pos_state}', $1::jsonb) 
       WHERE user_id = 48 RETURNING settings`,
      [JSON.stringify(activeState)]
    );
    console.log("POS active state simulated successfully in database.");
  } catch (err) {
    console.error("Simulation Error:", err);
  } finally {
    await pool.end();
  }
}

simulateSync();
