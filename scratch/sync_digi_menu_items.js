const pool = require('../db');

async function syncDigiMenu() {
  try {
    // Check items in menu 34
    const m34Items = await pool.query("SELECT * FROM outlet_menu_items WHERE menu_id = 34");
    console.log(`Found ${m34Items.rows.length} items in pos menu (34). Syncing to DIGI MENU (35)...`);

    let addedCount = 0;
    for (const item of m34Items.rows) {
      const checkRes = await pool.query(
        "SELECT id FROM outlet_menu_items WHERE menu_id = 35 AND (short_code = $1 OR item_name = $2)",
        [item.short_code, item.item_name]
      );
      if (checkRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO outlet_menu_items 
           (menu_id, item_id, short_code, item_name, base_price, category_id, kitchen_dept_id, tax_group_id, food_type, description, stock_qty, is_active, item_type, hsn_code, is_recommended, sale_price_2, sale_price_3, image_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            35, item.item_id, item.short_code, item.item_name, item.base_price, 
            item.category_id, item.kitchen_dept_id, item.tax_group_id, item.food_type, 
            item.description, item.stock_qty, item.is_active, item.item_type, 
            item.hsn_code, item.is_recommended, item.sale_price_2, item.sale_price_3, item.image_url
          ]
        );
        addedCount++;
      }
    }
    console.log(`✅ Successfully synced ${addedCount} items into DIGI MENU (35)!`);

    const cnt35 = await pool.query("SELECT count(*) FROM outlet_menu_items WHERE menu_id = 35");
    console.log("DIGI MENU (35) item count now:", cnt35.rows[0].count);

  } catch (err) {
    console.error("Sync Error:", err);
  } finally {
    process.exit();
  }
}

syncDigiMenu();
