const pool = require('../db');

async function convertDgToPs() {
  try {
    console.log("🔄 Converting POS Menu (Menu 34) short codes from 'DG' to 'PS'...");

    // 1. Fetch items in Menu 34
    const res = await pool.query("SELECT id, short_code, item_name FROM outlet_menu_items WHERE menu_id = 34");
    console.log(`Found ${res.rows.length} items in Menu 34.`);

    let updatedCount = 0;
    for (const item of res.rows) {
      if (item.short_code && item.short_code.startsWith('DG')) {
        const newCode = item.short_code.replace(/^DG/, 'PS');
        await pool.query(
          "UPDATE outlet_menu_items SET short_code = $1 WHERE id = $2",
          [newCode, item.id]
        );

        // Also update corresponding business_items if matching by product_name or old code
        await pool.query(
          "UPDATE business_items SET code = $1 WHERE user_id = 55 AND (code = $2 OR product_name = $3)",
          [newCode, item.short_code, item.item_name]
        );

        updatedCount++;
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} items in POS Menu 34 to 'PS' short codes!`);

    // Sample inspect
    const sample = await pool.query("SELECT id, short_code, item_name FROM outlet_menu_items WHERE menu_id = 34 LIMIT 10");
    console.log("\n=== Sample Updated POS Menu 34 Items ===");
    console.table(sample.rows);

  } catch (err) {
    console.error("Conversion Error:", err);
  } finally {
    process.exit();
  }
}

convertDgToPs();
