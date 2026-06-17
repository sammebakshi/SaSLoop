const pool = require('../db');

async function testTransition() {
  try {
    // 1. Create a dummy PENDING order in the database
    console.log("Creating dummy pending order...");
    const orderRes = await pool.query(
      `INSERT INTO orders (
         user_id, restaurant_id, order_reference, customer_name, customer_number, items,
         total_price, payment_method, status, payment_status, table_number, address,
         source, discount_amount, tax_cgst, tax_sgst, tip_amount, bill_no, order_type,
         delivery_charge, service_charge, created_at
       ) VALUES (
         48, 1, 'TEST-TRANSITION-123', 'Sajad Bakshi', '+917006089744', '[]',
         1500.00, 'CASH', 'PENDING', 'PENDING', '0', 'pickup', 'POS_TERMINAL',
         0, 0, 0, 0, 'B-999', 'PICKUP', 0, 0, NOW()
       ) RETURNING *`
    );
    const order = orderRes.rows[0];
    console.log(`Dummy order created. ID: ${order.id}, Status: ${order.status}, Total Price: ${order.total_price}`);

    // Mimic the PUT /:id update database transaction and status check
    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = 48", [order.id]);
    
    // Simulate updating the order status to COMPLETED
    const result = await pool.query(
      `UPDATE orders SET status = 'COMPLETED' WHERE id = $1 AND user_id = 48 RETURNING *`,
      [order.id]
    );
    const updatedOrder = result.rows[0];
    console.log(`Updated order status in database. New Status: ${updatedOrder.status}`);

    // Mimic the awardLoyaltyPoints call
    const bizRes = await pool.query(
      "SELECT loyalty_enabled, points_per_100, loyalty_bill_amount_threshold, loyalty_points_earned, loyalty_points_dinein, loyalty_points_pickup, loyalty_points_delivery FROM restaurants WHERE user_id = 48"
    );
    const bizData = bizRes.rows[0];
    const cleanPhone = (updatedOrder.customer_number || "").replace(/\D/g, "");
    const dbPhone = cleanPhone ? `+${cleanPhone}` : "";
    
    let channelAllowed = true;
    if (bizData) {
      const ordType = String(updatedOrder.order_type || updatedOrder.address || '').toUpperCase();
      const isDineIn = (updatedOrder.table_number && updatedOrder.table_number !== "0" && updatedOrder.table_number !== "") || ordType === 'DINEIN' || ordType === 'DINE_IN';
      const isPickup = ordType === 'PICKUP' || ordType === 'TAKEAWAY' || ordType === 'QUICK';
      const isDelivery = ordType === 'DELIVERY';

      if (isDineIn) {
        channelAllowed = bizData.loyalty_points_dinein ?? true;
      } else if (isPickup) {
        channelAllowed = bizData.loyalty_points_pickup ?? true;
      } else if (isDelivery) {
        channelAllowed = bizData.loyalty_points_delivery ?? true;
      } else {
        channelAllowed = bizData.loyalty_points_delivery ?? true;
      }
    }

    if (updatedOrder.status === 'COMPLETED' && checkRes.rows[0].status !== 'COMPLETED') {
      console.log(`[TRANSITION MATCHED] Triggering awardLoyaltyPoints...`);
      if (dbPhone && bizData && (bizData.loyalty_enabled ?? true) && channelAllowed) {
        let earned = 0;
        if (bizData.loyalty_bill_amount_threshold && bizData.loyalty_points_earned) {
          const threshold = parseFloat(bizData.loyalty_bill_amount_threshold);
          const pointsEarned = parseInt(bizData.loyalty_points_earned);
          if (threshold > 0) {
            earned = Math.floor((parseFloat(updatedOrder.total_price) || 0) / threshold) * pointsEarned;
          }
        } else {
          const ptsEarnRate = (parseFloat(bizData.points_per_100) || 5) / 100;
          earned = Math.floor((parseFloat(updatedOrder.total_price) || 0) * ptsEarnRate);
        }

        console.log(`[TRANSITION AWARD] Earned points: ${earned}`);

        const loyaltyRes = await pool.query(
          `INSERT INTO customer_loyalty (user_id, customer_number, points, total_spent, last_visit)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (user_id, customer_number) 
           DO UPDATE SET 
              total_spent = customer_loyalty.total_spent + EXCLUDED.total_spent,
              points = COALESCE(customer_loyalty.points, 0) + EXCLUDED.points,
              last_visit = NOW() RETURNING points`,
          [48, dbPhone, earned, parseFloat(updatedOrder.total_price) || 0]
        );
        console.log(`[TRANSITION SUCCESS] New points balance: ${loyaltyRes.rows[0].points}`);
      }
    }

    // Clean up
    console.log("Cleaning up database...");
    await pool.query("DELETE FROM orders WHERE id = $1", [order.id]);
    await pool.query(
      `UPDATE customer_loyalty 
       SET points = 100, total_spent = 0.00, last_visit = '2026-05-25 12:21:47.728'::timestamp
       WHERE customer_number = '+917006089744'`
    );
    console.log("Cleanup complete.");

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await pool.end();
  }
}

testTransition();
