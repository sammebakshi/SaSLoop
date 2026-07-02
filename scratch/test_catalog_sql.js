const pool = require('../db');

async function run() {
  try {
    const ownerId = 55;
    const res = await pool.query(
      `SELECT bi.id, 
              bi.user_id,
              bi.code, 
              bi.product_name, 
              bi.product_name as name, 
              bi.price, 
              bi.availability, 
              bi.image_url, 
              bi.description, 
              bi.tax_applicable,
              bi.is_veg,
              CASE WHEN bi.is_veg = true THEN 'veg' ELSE 'non-veg' END as food_type,
              bi.stock_count,
              bi.tax_percent,
              bi.variants,
              bi.modifiers,
              bi.kot_category,
              bi.hsn_code,
              bi.barcode,
              bi.cost_price,
              bi.category,
              bi.sub_category,
              bi.sale_price_2,
              bi.sale_price_3
       FROM business_items bi
       WHERE bi.user_id = $1
         AND NOT EXISTS (
           SELECT 1 FROM outlet_menu_items omi
           WHERE omi.short_code = bi.code
             AND bi.code IS NOT NULL AND bi.code != ''
             AND omi.item_type = '1'
         )
       ORDER BY bi.id ASC`,
      [ownerId]
    );
    console.log(`Query returned ${res.rows.length} rows.`);
    console.log("\nUnique categories in query result:");
    const cats = [...new Set(res.rows.map(r => r.category))];
    console.log(cats);
  } catch (e) {
    console.error("SQL query failed:", e);
  } finally {
    await pool.end();
  }
}

run();
