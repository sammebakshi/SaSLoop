const pool = require("../db");

async function runTest() {
  try {
    const res = await pool.query("SELECT * FROM orders WHERE id = 43");
    const order = res.rows[0];
    console.log("Raw Order:", {
      id: order.id,
      customer_name: order.customer_name,
      total_price: order.total_price,
      subtotal: order.subtotal,
      items_type: typeof order.items,
      items: order.items
    });

    const items = Array.isArray(order.items) 
      ? order.items 
      : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);

    const calc = items.reduce((sum, item) => {
      const base = parseFloat(item.price || 0) * parseFloat(item.qty || item.quantity || 1);
      const modifiersTotal = (item.modifiers || []).reduce((ma, m) => ma + parseFloat(m.price || 0) * parseFloat(item.qty || item.quantity || 1), 0);
      return sum + base + modifiersTotal;
    }, 0);
    console.log("Calculated Subtotal:", calc);

    // Let's also see what getReceiptSubtotal returns:
    const baseReduce = items.reduce((sum, item) => 
      sum + (parseFloat(item.price || 0) + (item.modifiers || []).reduce((ma, m) => ma + parseFloat(m.price || 0), 0)) * parseFloat(item.qty || item.quantity || 1), 0);
    console.log("Base Inline Reduce:", baseReduce);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

runTest();
