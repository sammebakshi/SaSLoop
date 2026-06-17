const pool = require("../db");

async function run() {
  try {
    const res = await pool.query("SELECT id, items, total_price, tax_cgst, tax_sgst, discount_amount FROM orders WHERE customer_number = '+918899889900'");
    console.log("=== ORDER ITEMS DETAILS ===");
    res.rows.forEach(r => {
      console.log(`Order ID: ${r.id}, Total: ${r.total_price}, CGST: ${r.tax_cgst}, SGST: ${r.tax_sgst}, Discount: ${r.discount_amount}`);
      console.log("Items JSON:", JSON.stringify(r.items, null, 2));
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
