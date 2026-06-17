const pool = require('../db');

// Mimic the awardLoyaltyPoints function from routes/orderRoutes.js
async function awardLoyaltyPoints(order, userId) {
  let pointsSummary = "";
  try {
    const bizRes = await pool.query(
      "SELECT loyalty_enabled, points_per_100, loyalty_bill_amount_threshold, loyalty_points_earned, loyalty_points_dinein, loyalty_points_pickup, loyalty_points_delivery FROM restaurants WHERE user_id = $1",
      [userId]
    );
    const bizData = bizRes.rows[0];
    const cleanPhone = (order.customer_number || "").replace(/\D/g, "");
    const dbPhone = cleanPhone ? `+${cleanPhone}` : "";
    
    let channelAllowed = true;
    if (bizData) {
      const ordType = String(order.order_type || order.address || '').toUpperCase();
      const isDineIn = (order.table_number && order.table_number !== "0" && order.table_number !== "") || ordType === 'DINEIN' || ordType === 'DINE_IN';
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
    
    console.log(`[TEST DEBUG] dbPhone: ${dbPhone}, loyalty_enabled: ${bizData?.loyalty_enabled}, channelAllowed: ${channelAllowed}`);

    if (dbPhone && bizData && (bizData.loyalty_enabled ?? true) && channelAllowed) {
      let earned = 0;
      if (bizData.loyalty_bill_amount_threshold && bizData.loyalty_points_earned) {
        const threshold = parseFloat(bizData.loyalty_bill_amount_threshold);
        const pointsEarned = parseInt(bizData.loyalty_points_earned);
        if (threshold > 0) {
          earned = Math.floor((parseFloat(order.total_price) || 0) / threshold) * pointsEarned;
        }
      } else {
        // Fallback to legacy points_per_100 calculation
        const ptsEarnRate = (parseFloat(bizData.points_per_100) || 5) / 100;
        earned = Math.floor((parseFloat(order.total_price) || 0) * ptsEarnRate);
      }
      
      console.log(`[TEST DEBUG] Order Total: ${order.total_price}, Points Earned: ${earned}`);

      const loyaltyRes = await pool.query(
        `INSERT INTO customer_loyalty (user_id, customer_number, points, total_spent, last_visit)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id, customer_number) 
         DO UPDATE SET 
            total_spent = customer_loyalty.total_spent + EXCLUDED.total_spent,
            points = COALESCE(customer_loyalty.points, 0) + EXCLUDED.points,
            last_visit = NOW() RETURNING points`,
        [userId, dbPhone, earned, parseFloat(order.total_price) || 0]
      );
      
      const newBal = loyaltyRes.rows[0]?.points ?? 0;
      pointsSummary = `\n🎁 *Loyalty Reward:* You earned *${earned} points*!\n🌟 *New Balance:* *${newBal} points*`;
      console.log(`[TEST SUCCESS] pointsSummary: ${pointsSummary.replace(/\n/g, ' ')}`);
    } else {
      console.log(`[TEST SKIPPED] Loyalty conditions not met.`);
    }
  } catch (loyaltyErr) {
    console.error("Completion Loyalty Error:", loyaltyErr);
  }
  return pointsSummary;
}

async function runTest() {
  console.log("--- TEST 1: Order Total 900.00 (under 1000 threshold) ---");
  await awardLoyaltyPoints({
    customer_number: "+917006089744",
    total_price: "900.00",
    order_type: "PICKUP",
    table_number: "0"
  }, 48);

  console.log("\n--- TEST 2: Order Total 1200.00 (above 1000 threshold) ---");
  await awardLoyaltyPoints({
    customer_number: "+917006089744",
    total_price: "1200.00",
    order_type: "PICKUP",
    table_number: "0"
  }, 48);

  console.log("\n=== AFTER TESTS: CUSTOMER LOYALTY STATUS ===");
  const loyRes = await pool.query(
    `SELECT id, user_id, customer_number, name, points, balance, total_spent, last_visit 
     FROM customer_loyalty 
     WHERE customer_number = '+917006089744'`
  );
  console.table(loyRes.rows);

  // Revert/cleanup the spent and points added to Sajad Bakshi during test
  console.log("\nCleaning up test edits...");
  await pool.query(
    `UPDATE customer_loyalty 
     SET points = 100, total_spent = 0.00, last_visit = '2026-05-25 12:21:47.728'::timestamp
     WHERE customer_number = '+917006089744'`
  );
  console.log("Cleanup complete.");

  await pool.end();
}

runTest();
