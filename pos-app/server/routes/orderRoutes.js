const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const whatsappManager = require("../whatsappManager");
const { triggerWebhook } = require("../utils/webhookUtils");
const { Tag, tagsToBase64, ZATCA_TAGS } = require("../utils/zatcaUtils");

// Helper function to extract all possible variations of a phone number
function getPhoneVariations(phone) {
  if (!phone) return [];
  const cleanPhone = phone.replace(/\D/g, "");
  const tenDigits = cleanPhone.slice(-10);
  return [
    phone,
    cleanPhone,
    `+${cleanPhone}`,
    tenDigits,
    `+${tenDigits}`,
    `+91${tenDigits}`
  ].filter((v, i, self) => v && self.indexOf(v) === i);
}

// Helper function to find standard customer_number in database
async function findExistingCustomerNumber(userId, phone) {
  if (!phone) return phone;
  const phones = getPhoneVariations(phone);
  const res = await pool.query(
    "SELECT customer_number FROM customer_loyalty WHERE user_id = $1 AND customer_number = ANY($2) LIMIT 1",
    [userId, phones]
  );
  if (res.rows.length > 0) {
    return res.rows[0].customer_number;
  }
  return phone;
}

async function deductRedeemedPoints(userId, customerNumber, pointsRedeemed, orderRef) {
  if (!customerNumber || !pointsRedeemed || pointsRedeemed <= 0) return;
  try {
    const bizRes = await pool.query(
      "SELECT loyalty_enabled FROM restaurants WHERE user_id = $1",
      [userId]
    );
    const bizData = bizRes.rows[0];
    if (bizData && bizData.loyalty_enabled === false) {
      console.log(`🎁 [SKIPPED] Loyalty program is disabled for Biz ${userId}. Points redemption skipped.`);
      return;
    }
    const targetPhone = await findExistingCustomerNumber(userId, customerNumber);
    await pool.query(
      "UPDATE customer_loyalty SET points = COALESCE(points, 0) - $1 WHERE user_id = $2 AND customer_number = $3",
      [pointsRedeemed, userId, targetPhone]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'POINTS_REDEEMED', 0.00, $3, $4, NOW())`,
      [userId, targetPhone, -pointsRedeemed, `Points redeemed for Order: ${orderRef}`]
    );
    console.log(`🎁 Deducted ${pointsRedeemed} points from ${targetPhone} for Biz ${userId} on Order ${orderRef}`);
  } catch (err) {
    console.error("Failed to deduct redeemed points:", err);
  }
}

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
    
    if (dbPhone && bizData && (bizData.loyalty_enabled ?? true) && channelAllowed) {
      const targetPhone = await findExistingCustomerNumber(userId, dbPhone);
      let earned = 0;
      if (bizData.loyalty_bill_amount_threshold && bizData.loyalty_points_earned) {
        const threshold = parseFloat(bizData.loyalty_bill_amount_threshold);
        const pointsEarned = parseInt(bizData.loyalty_points_earned);
        const billVal = parseFloat(order.total_price) || 0;
        if (threshold > 0) {
          earned = billVal >= threshold ? Math.floor(billVal * (pointsEarned / threshold)) : 0;
        }
      } else {
        // Fallback to legacy points_per_100 calculation
        const ptsEarnRate = (parseFloat(bizData.points_per_100) || 5) / 100;
        earned = Math.floor((parseFloat(order.total_price) || 0) * ptsEarnRate);
      }
      
      const loyaltyRes = await pool.query(
        `INSERT INTO customer_loyalty (user_id, customer_number, points, total_spent, last_visit)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id, customer_number) 
         DO UPDATE SET 
            total_spent = customer_loyalty.total_spent + EXCLUDED.total_spent,
            points = COALESCE(customer_loyalty.points, 0) + EXCLUDED.points,
            last_visit = NOW() RETURNING points`,
        [userId, targetPhone, earned, parseFloat(order.total_price) || 0]
      );
      
      if (earned > 0) {
        const newBal = loyaltyRes.rows[0]?.points ?? 0;
        pointsSummary = `\n🎁 *Loyalty Reward:* You earned *${earned} points*!\n🌟 *New Balance:* *${newBal} points*`;
        
        // Log transaction
        await pool.query(
          `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
           VALUES ($1, $2, 'POINTS_EARNED', 0.00, $3, $4, NOW())`,
          [userId, targetPhone, earned, `Points earned for Order Bill: ${order.bill_no || order.order_reference}`]
        );
      }
    }
  } catch (loyaltyErr) {
    console.error("Completion Loyalty Error:", loyaltyErr);
  }
  return pointsSummary;
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const { 
        customer_name, customer_number, customer_phone, items, total_price, 
        payment_method, status, table_id, order_type,
        address, table_number, discount, discount_amount, tax_cgst, tax_sgst, tip_amount, bill_no,
        delivery_charge, service_charge,
        pre_order_id, pre_order_advance, pre_order_balance,
        paid_amount, credit_amount, order_reference, waiter_id,
        source, charge_details,
        pre_order_scheduled_date, pre_order_scheduled_time,
        coupon_code, rider_id, points_redeemed,
        created_at
    } = req.body;

    const parsedPreOrderId = (pre_order_id && !isNaN(parseInt(pre_order_id))) ? parseInt(pre_order_id) : null;
    const finalDiscount = discount !== undefined ? discount : (discount_amount !== undefined ? discount_amount : 0);

    const orderRef = order_reference || `POS-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const cleanCustomerNumber = customer_number || customer_phone || '';

    const restRes = await pool.query("SELECT id FROM restaurants WHERE user_id = $1", [userId]);
    const restaurantId = restRes.rows[0]?.id || null;

    if (bill_no) {
      const existingBill = await pool.query(
        `SELECT * FROM orders 
         WHERE user_id = $1 
           AND bill_no = $2 
           AND created_at >= NOW() - INTERVAL '2 hours'
         LIMIT 1`,
        [userId, bill_no]
      );
      if (existingBill.rows.length > 0) {
        const existingOrder = existingBill.rows[0];
        if (existingOrder.status === 'PENDING') {
          console.log(`[SETTLEMENT] Existing PENDING order found for bill_no ${bill_no}. Updating it to ${status || 'COMPLETED'}.`);
          
          let upperMethod = String(payment_method || 'CASH').trim().toUpperCase();
          if (upperMethod === 'DUE') {
            upperMethod = 'CREDIT';
          }

          const finalPaidAmount = (upperMethod === 'CREDIT') ? 0 : 
                                  ((upperMethod === 'SPLIT') ? (parseFloat(paid_amount) || 0) : 
                                   (parseFloat(paid_amount) > parseFloat(total_price) ? parseFloat(paid_amount) : parseFloat(total_price || 0)));
          const finalCreditAmount = (upperMethod === 'CREDIT') ? parseFloat(total_price || 0) : 
                                    ((upperMethod === 'SPLIT') ? (parseFloat(credit_amount) || 0) : 0);

          let paymentStatus = 'PENDING';
          if (upperMethod === 'CREDIT') {
            paymentStatus = 'UNPAID';
          } else if (upperMethod === 'SPLIT') {
            if (finalCreditAmount > 0 && finalPaidAmount > 0) {
              paymentStatus = 'PARTIALLY_PAID';
            } else if (finalCreditAmount > 0) {
              paymentStatus = 'UNPAID';
            } else {
              paymentStatus = 'PAID';
            }
          } else if (upperMethod === 'CASH' || status === 'COMPLETED') {
            paymentStatus = 'PAID';
          }

          const result = await pool.query(
            `UPDATE orders SET 
              customer_name = $1, customer_number = $2, items = $3, 
              total_price = $4, payment_method = $5, status = $6, payment_status = $7,
              discount_amount = $8, tax_cgst = $9, tax_sgst = $10, tip_amount = $11,
              paid_amount = $12, credit_amount = $13, waiter_id = $14, charge_details = $15,
              source = $16, table_number = $17, order_type = $18, coupon_code = $20, rider_id = $21, redeemed_points = $22, created_at = COALESCE($23::timestamp, created_at, NOW())
             WHERE id = $19 RETURNING *, 
               (SELECT COALESCE(name, username) FROM app_users WHERE id = waiter_id) as waiter_name,
               (SELECT name FROM delivery_partners WHERE id = rider_id) as rider_name,
               (SELECT phone FROM delivery_partners WHERE id = rider_id) as rider_phone`,
            [
              customer_name || 'Walk-in', cleanCustomerNumber, JSON.stringify(items),
              total_price, upperMethod, status || 'COMPLETED', paymentStatus,
              finalDiscount || 0, tax_cgst || 0, tax_sgst || 0, tip_amount || 0,
              finalPaidAmount, finalCreditAmount, waiter_id || null,
              charge_details ? JSON.stringify(charge_details) : '[]',
              source || 'POS_WINDOWS', table_number || (table_id ? table_id.toString() : '0'),
              order_type || address || 'QUICK',
              existingOrder.id,
              coupon_code || null,
              rider_id || null,
              parseInt(points_redeemed) || 0,
              created_at || null
            ]
          );

          const updatedOrder = result.rows[0];

          // Deduct redeemed points from loyalty balance ONLY if the order is completed (settled)
          if (updatedOrder.status === 'COMPLETED' && (parseInt(points_redeemed) || 0) > 0) {
              await deductRedeemedPoints(userId, cleanCustomerNumber, parseInt(points_redeemed), updatedOrder.bill_no || updatedOrder.order_reference || orderRef);
          }

          // 🏆 AWARD LOYALTY POINTS IF COMPLETED
          if (updatedOrder.status === 'COMPLETED') {
              await awardLoyaltyPoints(updatedOrder, userId);
          }

          // If CREDIT or SPLIT payment method with credit_amount > 0, deduct from customer balance
          const isCreditOrSplit = (upperMethod === 'CREDIT' || (upperMethod === 'SPLIT' && finalCreditAmount > 0));
          if (isCreditOrSplit && cleanCustomerNumber) {
            try {
              const targetCustomerNumber = await findExistingCustomerNumber(userId, cleanCustomerNumber);
              const loyaltyRes = await pool.query(
                "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
                [userId, targetCustomerNumber]
              );
              if (loyaltyRes.rows.length === 0) {
                const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, targetCustomerNumber]);
                const custName = custRes.rows[0]?.name || customer_name || "Customer";
                await pool.query(
                  `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
                   VALUES ($1, $2, $3, 0, $4, 0.00, NOW())`,
                  [userId, targetCustomerNumber, custName, -finalCreditAmount]
                );
              } else {
                await pool.query(
                  `UPDATE customer_loyalty 
                   SET balance = COALESCE(balance, 0) - $1, last_visit = NOW() 
                   WHERE user_id = $2 AND customer_number = $3`,
                  [finalCreditAmount, userId, targetCustomerNumber]
                );
              }

              await pool.query(
                `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                 VALUES ($1, $2, 'CREDIT_PURCHASE', $3, 0, $4, NOW())`,
                [userId, targetCustomerNumber, -finalCreditAmount, `Credit purchase for Order Bill: ${bill_no || orderRef}`]
              );
            } catch (balErr) {
              console.error("Failed to deduct customer balance for credit purchase:", balErr);
            }
          }

          // Check if there is an overpayment (extra paid amount)
          const extraPaidAmount = Math.max(0, finalPaidAmount + finalCreditAmount - total_price);
          if (extraPaidAmount > 0 && cleanCustomerNumber) {
            try {
              const targetCustomerNumber = await findExistingCustomerNumber(userId, cleanCustomerNumber);
              const loyaltyRes = await pool.query(
                "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
                [userId, targetCustomerNumber]
              );
              if (loyaltyRes.rows.length === 0) {
                const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, targetCustomerNumber]);
                const custName = custRes.rows[0]?.name || customer_name || "Customer";
                await pool.query(
                  `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
                   VALUES ($1, $2, $3, 0, $4, 0.00, NOW())`,
                  [userId, targetCustomerNumber, custName, extraPaidAmount]
                );
              } else {
                await pool.query(
                  `UPDATE customer_loyalty 
                   SET balance = COALESCE(balance, 0) + $1, last_visit = NOW() 
                   WHERE user_id = $2 AND customer_number = $3`,
                  [extraPaidAmount, userId, targetCustomerNumber]
                );
              }

              await pool.query(
                `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                 VALUES ($1, $2, 'BILL_PAYMENT', $3, 0, $4, NOW())`,
                [userId, targetCustomerNumber, extraPaidAmount, `Overpayment advance/payoff for Order Bill: ${bill_no || orderRef}`]
              );
            } catch (balErr) {
              console.error("Failed to add customer balance for overpayment:", balErr);
            }
          }

          // Trigger notifications/webhooks
          try {
              const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
              const biz = bizRes.rows[0];
              const symbol = biz?.currency_code === 'USD' ? '$' : '₹';
              
              await whatsappManager.notifyKitchenAndStaff(
                  userId, orderRef, updatedOrder.customer_name, updatedOrder.customer_number, items,
                  total_price, total_price, 0, 0, 0, 0, symbol,
                  'POS', updatedOrder.address, updatedOrder.table_number
              );
              
              if (biz) {
                  triggerWebhook(biz, 'order.created', updatedOrder);
              }
          } catch (err) {
              console.error("POS Order Notification Error:", err);
          }

          return res.json(updatedOrder);
        } else if (existingOrder.total_price === total_price) {
          console.log(`[DEDUPLICATION] Order with bill_no ${bill_no} and total_price ${total_price} already exists recently. Returning existing.`);
          return res.json(existingOrder);
        }
      }
    }

    if (order_reference) {
      const existingRef = await pool.query(
        "SELECT * FROM orders WHERE user_id = $1 AND order_reference = $2",
        [userId, order_reference]
      );
      if (existingRef.rows.length > 0) {
        console.log(`Order with reference ${order_reference} already exists, returning existing.`);
        return res.json(existingRef.rows[0]);
      }
    }

    let upperMethod = String(payment_method || 'CASH').trim().toUpperCase();
    if (upperMethod === 'DUE') {
      upperMethod = 'CREDIT';
    }

    const finalPaidAmount = (upperMethod === 'CREDIT') ? 0 : 
                            ((upperMethod === 'SPLIT') ? (parseFloat(paid_amount) || 0) : 
                             (parseFloat(paid_amount) > parseFloat(total_price) ? parseFloat(paid_amount) : parseFloat(total_price || 0)));
    const finalCreditAmount = (upperMethod === 'CREDIT') ? parseFloat(total_price || 0) : 
                              ((upperMethod === 'SPLIT') ? (parseFloat(credit_amount) || 0) : 0);

    let paymentStatus = 'PENDING';
    if (upperMethod === 'CREDIT') {
      paymentStatus = 'UNPAID';
    } else if (upperMethod === 'SPLIT') {
      if (finalCreditAmount > 0 && finalPaidAmount > 0) {
        paymentStatus = 'PARTIALLY_PAID';
      } else if (finalCreditAmount > 0) {
        paymentStatus = 'UNPAID';
      } else {
        paymentStatus = 'PAID';
      }
    } else if (upperMethod === 'CASH' || status === 'COMPLETED') {
      paymentStatus = 'PAID';
    }
    
    const deviceId = req.headers['x-device-id'] || req.headers['X-Device-ID'] || req.query.device_id || null;

    const result = await pool.query(
      `INSERT INTO orders (
        user_id, restaurant_id, order_reference, customer_name, customer_number, items, 
        total_price, payment_method, status, payment_status, 
        table_number, address, source, discount_amount, tax_cgst, tax_sgst, tip_amount, bill_no, order_type, delivery_charge, service_charge,
        pre_order_id, pre_order_advance, pre_order_balance, paid_amount, credit_amount, waiter_id, charge_details, device_id, pre_order_scheduled_date, pre_order_scheduled_time, coupon_code, rider_id, redeemed_points, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, COALESCE($35::timestamp, NOW())) RETURNING *, 
        (SELECT COALESCE(name, username) FROM app_users WHERE id = waiter_id) as waiter_name,
        (SELECT name FROM delivery_partners WHERE id = rider_id) as rider_name,
        (SELECT phone FROM delivery_partners WHERE id = rider_id) as rider_phone`,
      [
        userId, restaurantId, orderRef, customer_name || 'Walk-in', cleanCustomerNumber, 
        JSON.stringify(items), total_price, upperMethod, 
        status || 'PENDING', paymentStatus,
        table_number || (table_id ? table_id.toString() : '0'), 
        address || (order_type || 'POS'), source || 'POS_WINDOWS',
        finalDiscount || 0, tax_cgst || 0, tax_sgst || 0, tip_amount || 0, bill_no || '', order_type || address || 'QUICK',
        parseFloat(delivery_charge) || 0, parseFloat(service_charge) || 0,
        parsedPreOrderId, parseFloat(pre_order_advance) || 0, parseFloat(pre_order_balance) || 0,
        finalPaidAmount, finalCreditAmount, waiter_id || null,
        charge_details ? JSON.stringify(charge_details) : '[]',
        deviceId,
        pre_order_scheduled_date || null,
        pre_order_scheduled_time || null,
        coupon_code || null,
        rider_id || null,
        parseInt(points_redeemed) || 0,
        created_at || null
      ]
    );

    const newOrder = result.rows[0];

    // Deduct redeemed points from loyalty balance ONLY if the order is completed immediately (settled)
    if (newOrder.status === 'COMPLETED' && (parseInt(points_redeemed) || 0) > 0) {
      await deductRedeemedPoints(userId, cleanCustomerNumber, parseInt(points_redeemed), newOrder.bill_no || newOrder.order_reference || orderRef);
    }

    // 🏆 AWARD LOYALTY POINTS IF COMPLETED IMMEDIATELY (POS SALE)
    if (newOrder.status === 'COMPLETED') {
        await awardLoyaltyPoints(newOrder, userId);
    }

    // If CREDIT or SPLIT payment method with credit_amount > 0, deduct from customer balance
    const isCreditOrSplit = (upperMethod === 'CREDIT' || (upperMethod === 'SPLIT' && finalCreditAmount > 0));
    if (isCreditOrSplit && cleanCustomerNumber) {
      try {
        const targetCustomerNumber = await findExistingCustomerNumber(userId, cleanCustomerNumber);
        const loyaltyRes = await pool.query(
          "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
          [userId, targetCustomerNumber]
        );
        if (loyaltyRes.rows.length === 0) {
          const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, targetCustomerNumber]);
          const custName = custRes.rows[0]?.name || customer_name || "Customer";
          await pool.query(
            `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
             VALUES ($1, $2, $3, 0, $4, 0.00, NOW())`,
            [userId, targetCustomerNumber, custName, -finalCreditAmount]
          );
        } else {
          await pool.query(
            `UPDATE customer_loyalty 
             SET balance = COALESCE(balance, 0) - $1, last_visit = NOW() 
             WHERE user_id = $2 AND customer_number = $3`,
            [finalCreditAmount, userId, targetCustomerNumber]
          );
        }

        await pool.query(
          `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
           VALUES ($1, $2, 'CREDIT_PURCHASE', $3, 0, $4, NOW())`,
          [userId, targetCustomerNumber, -finalCreditAmount, `Credit purchase for Order Bill: ${bill_no || orderRef}`]
        );
      } catch (balErr) {
        console.error("Failed to deduct customer balance for credit purchase:", balErr);
      }
    }

    // Check if there is an overpayment (extra paid amount)
    const extraPaidAmount = Math.max(0, finalPaidAmount + finalCreditAmount - total_price);
    if (extraPaidAmount > 0 && cleanCustomerNumber) {
      try {
        const targetCustomerNumber = await findExistingCustomerNumber(userId, cleanCustomerNumber);
        const loyaltyRes = await pool.query(
          "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
          [userId, targetCustomerNumber]
        );
        if (loyaltyRes.rows.length === 0) {
          const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, targetCustomerNumber]);
          const custName = custRes.rows[0]?.name || customer_name || "Customer";
          await pool.query(
            `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
             VALUES ($1, $2, $3, 0, $4, 0.00, NOW())`,
            [userId, targetCustomerNumber, custName, extraPaidAmount]
          );
        } else {
          await pool.query(
            `UPDATE customer_loyalty 
             SET balance = COALESCE(balance, 0) + $1, last_visit = NOW() 
             WHERE user_id = $2 AND customer_number = $3`,
            [extraPaidAmount, userId, targetCustomerNumber]
          );
        }

        await pool.query(
          `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
           VALUES ($1, $2, 'BILL_PAYMENT', $3, 0, $4, NOW())`,
          [userId, targetCustomerNumber, extraPaidAmount, `Overpayment advance/payoff for Order Bill: ${bill_no || orderRef}`]
        );
      } catch (balErr) {
        console.error("Failed to add customer balance for overpayment:", balErr);
      }
    }

    // --- HIGH-TECH: AUTOMATIC STOCK DEDUCTION (BOM) ---
    try {
        const parsedItems = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
        for (const item of parsedItems) {
            // Find recipe for this item
            const recipeRes = await pool.query("SELECT raw_item_id, quantity FROM recipes WHERE menu_item_id = $1", [item.id]);
            if (recipeRes.rows.length > 0) {
                for (const ingredient of recipeRes.rows) {
                    const deductQty = ingredient.quantity * (item.qty || 1);
                    // Deduct from raw stock
                    await pool.query(
                        "UPDATE inventory_raw SET current_stock = current_stock - $1, updated_at = NOW() WHERE id = $2 AND business_id = $3",
                        [deductQty, ingredient.raw_item_id, userId]
                    );
                    // Log the movement
                    await pool.query(
                        "INSERT INTO inventory_logs (raw_item_id, change_amount, type, reference, created_at) VALUES ($1, $2, $3, $4, NOW())",
                        [ingredient.raw_item_id, -deductQty, 'SALE', `Order ${orderRef}`]
                    );
                }
            }
        }
    } catch (stockErr) {
        console.error("Stock Deduction Failed:", stockErr);
    }

    // 🔥 Trigger KOT and Staff Notifications
    try {
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        const symbol = biz?.currency_code === 'USD' ? '$' : '₹';
        
        await whatsappManager.notifyKitchenAndStaff(
            userId, orderRef, newOrder.customer_name, newOrder.customer_number, items,
            total_price, total_price, 0, 0, 0, 0, symbol,
            'POS', newOrder.address, newOrder.table_number
        );
        
        // Trigger Webhook for Dashboard Sync
        if (biz) {
            triggerWebhook(biz, 'order.created', newOrder);
        }
    } catch (err) {
        console.error("POS Order Notification Error:", err);
    }

    res.json(newOrder);
  } catch (err) {
    console.error("🔥 POS ORDER CREATE ERROR:", err);
    res.status(500).json({ error: "Failed to create POS order" });
  }
});

// ✅ UPDATE EXISTING ORDER (EDIT INVOICE / MODIFY ITEMS)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.bizId;

    // Verify ownership
    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or order not found" });
    }
    const existingOrder = checkRes.rows[0];

    const {
      customer_name, customer_number, customer_phone, items, total_price,
      payment_method, status, table_id, order_type,
      address, table_number, discount, discount_amount, tax_cgst, tax_sgst, tip_amount, bill_no,
      delivery_charge, service_charge, subtotal,
      paid_amount, credit_amount, waiter_id, charge_details,
      pre_order_scheduled_date, pre_order_scheduled_time,
      coupon_code, rider_id, points_redeemed
    } = req.body;

    const finalItems = items !== undefined 
      ? JSON.stringify(items) 
      : (typeof existingOrder.items === 'string' ? existingOrder.items : JSON.stringify(existingOrder.items || []));
    const finalCustomerName = customer_name !== undefined ? customer_name : (existingOrder.customer_name || 'Walk-in');
    const cleanCust = customer_number || customer_phone || '';
    const cleanCustomerNumber = cleanCust !== '' ? cleanCust : (existingOrder.customer_number || '');
    const finalCustomerNumber = cleanCustomerNumber;
    const finalTotalPrice = total_price !== undefined ? total_price : existingOrder.total_price;
    const finalStatus = status !== undefined ? status : existingOrder.status;
    const finalOrderType = order_type !== undefined ? order_type : (existingOrder.order_type || 'QUICK');
    const finalAddress = address !== undefined ? address : (existingOrder.address || 'POS');
    const finalTableNumber = table_number !== undefined ? table_number : (table_id ? table_id.toString() : (existingOrder.table_number || '0'));
    const finalWaiterId = waiter_id !== undefined ? (waiter_id || null) : existingOrder.waiter_id;
    const finalRiderId = rider_id !== undefined ? (rider_id || null) : existingOrder.rider_id;
    const finalDeliveryCharge = delivery_charge !== undefined ? parseFloat(delivery_charge) : parseFloat(existingOrder.delivery_charge || 0);
    const finalServiceCharge = service_charge !== undefined ? parseFloat(service_charge) : parseFloat(existingOrder.service_charge || 0);
    const finalDiscount = discount !== undefined ? discount : (discount_amount !== undefined ? discount_amount : (existingOrder.discount_amount || 0));

    let upperMethod = String(payment_method || existingOrder.payment_method || 'CASH').trim().toUpperCase();
    if (upperMethod === 'DUE') {
      upperMethod = 'CREDIT';
    }

    const finalPaidAmount = (upperMethod === 'CREDIT') ? 0 : 
                            ((upperMethod === 'SPLIT') ? (parseFloat(paid_amount) || 0) : 
                             (parseFloat(paid_amount) > parseFloat(finalTotalPrice) ? parseFloat(paid_amount) : parseFloat(finalTotalPrice || 0)));
    const finalCreditAmount = (upperMethod === 'CREDIT') ? parseFloat(finalTotalPrice || 0) : 
                              ((upperMethod === 'SPLIT') ? (parseFloat(credit_amount) || 0) : 0);

    let paymentStatus = existingOrder.payment_status || 'PENDING';
    if (payment_method || status) {
      if (upperMethod === 'CREDIT') {
        paymentStatus = 'UNPAID';
      } else if (upperMethod === 'SPLIT') {
        if (finalCreditAmount > 0 && finalPaidAmount > 0) {
          paymentStatus = 'PARTIALLY_PAID';
        } else if (finalCreditAmount > 0) {
          paymentStatus = 'UNPAID';
        } else {
          paymentStatus = 'PAID';
        }
      } else if (upperMethod === 'CASH' || finalStatus === 'COMPLETED') {
        paymentStatus = 'PAID';
      }
    }
    const result = await pool.query(
      `UPDATE orders SET
        customer_name = $1, customer_number = $2, items = $3,
        total_price = $4, payment_method = $5, status = $6,
        payment_status = $7, table_number = $8, address = $9,
        discount_amount = $10, tax_cgst = $11, tax_sgst = $12,
        tip_amount = $13, bill_no = $14, order_type = $15,
        delivery_charge = $16, service_charge = $17,
        paid_amount = $18, credit_amount = $19, waiter_id = $20,
        charge_details = $21,
        pre_order_scheduled_date = $24,
        pre_order_scheduled_time = $25,
        coupon_code = $26,
        rider_id = $27,
        redeemed_points = $28
      WHERE id = $22 AND user_id = $23 RETURNING *, 
        (SELECT COALESCE(name, username) FROM app_users WHERE id = waiter_id) as waiter_name,
        (SELECT name FROM delivery_partners WHERE id = rider_id) as rider_name,
        (SELECT phone FROM delivery_partners WHERE id = rider_id) as rider_phone`,
      [
        finalCustomerName, finalCustomerNumber, finalItems,
        finalTotalPrice, upperMethod, finalStatus,
        paymentStatus,
        finalTableNumber,
        finalAddress,
        finalDiscount || 0, tax_cgst || 0, tax_sgst || 0,
        tip_amount || 0, bill_no || '', finalOrderType,
        finalDeliveryCharge, finalServiceCharge,
        finalPaidAmount, finalCreditAmount, finalWaiterId,
        charge_details ? JSON.stringify(charge_details) : (existingOrder.charge_details ? JSON.stringify(existingOrder.charge_details) : '[]'),
        id, userId,
        (pre_order_scheduled_date && pre_order_scheduled_date !== '') ? pre_order_scheduled_date : null,
        (pre_order_scheduled_time && pre_order_scheduled_time !== '') ? pre_order_scheduled_time : null,
        coupon_code || null,
        finalRiderId,
        points_redeemed !== undefined ? points_redeemed : (existingOrder.redeemed_points || 0)
      ]
    );

    const updatedOrder = result.rows[0];

    // Adjust loyalty points based on order status and redeemed points transition
    const oldStatus = checkRes.rows[0].status;
    const newStatus = updatedOrder.status;
    const oldRedeemedPoints = parseInt(checkRes.rows[0].redeemed_points) || 0;
    const newRedeemedPoints = parseInt(points_redeemed) || 0;

    if (oldStatus !== 'COMPLETED' && newStatus === 'COMPLETED') {
      // Transition from pending/other to settled: deduct full redeemed points
      if (newRedeemedPoints > 0 && cleanCustomerNumber) {
        await deductRedeemedPoints(userId, cleanCustomerNumber, newRedeemedPoints, updatedOrder.bill_no || updatedOrder.order_reference || id);
      }
    } else if (oldStatus === 'COMPLETED' && newStatus === 'COMPLETED') {
      // Adjusted order details while completed: adjust by difference
      const pointsDiff = newRedeemedPoints - oldRedeemedPoints;
      if (pointsDiff !== 0 && cleanCustomerNumber) {
        try {
          await pool.query(
            "UPDATE customer_loyalty SET points = COALESCE(points, 0) - $1 WHERE user_id = $2 AND customer_number = $3",
            [pointsDiff, userId, cleanCustomerNumber]
          );
          await pool.query(
            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
             VALUES ($1, $2, 'POINTS_REDEEMED', 0.00, $3, $4, NOW())`,
            [userId, cleanCustomerNumber, -pointsDiff, `Adjustment for modified Order Ref: ${updatedOrder.bill_no || updatedOrder.order_reference || id}`]
          );
          console.log(`🎁 Adjusted loyalty points by ${-pointsDiff} for ${cleanCustomerNumber} due to Order update`);
        } catch (adjustErr) {
          console.error("Failed to adjust customer loyalty points on order update:", adjustErr);
        }
      }
    } else if (oldStatus === 'COMPLETED' && newStatus !== 'COMPLETED') {
      // Transition from completed back to pending or cancelled: refund full old redeemed points
      if (oldRedeemedPoints > 0 && cleanCustomerNumber) {
        try {
          await pool.query(
            "UPDATE customer_loyalty SET points = COALESCE(points, 0) + $1 WHERE user_id = $2 AND customer_number = $3",
            [oldRedeemedPoints, userId, cleanCustomerNumber]
          );
          await pool.query(
            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
             VALUES ($1, $2, 'POINTS_REFUND', 0.00, $3, $4, NOW())`,
            [userId, cleanCustomerNumber, oldRedeemedPoints, `Points refund due to Order transition to ${newStatus}: ${updatedOrder.bill_no || updatedOrder.order_reference || id}`]
          );
          console.log(`🎁 Refunded ${oldRedeemedPoints} points to ${cleanCustomerNumber} due to status transition to ${newStatus}`);
        } catch (refundErr) {
          console.error("Failed to refund loyalty points on status transition:", refundErr);
        }
      }
    }

    // 🏆 AWARD LOYALTY POINTS IF TRANSITIONED TO COMPLETED
    if (updatedOrder.status === 'COMPLETED' && checkRes.rows[0].status !== 'COMPLETED') {
        await awardLoyaltyPoints(updatedOrder, userId);
    }

    // Handle customer credit & overpayment adjustments when order changes
    const oldPrice = parseFloat(checkRes.rows[0].total_price || 0);
    const oldPaymentMethod = checkRes.rows[0].payment_method;
    const oldCustomer = checkRes.rows[0].customer_number;

    const oldCreditAmount = (oldPaymentMethod === 'CREDIT') 
      ? oldPrice 
      : ((oldPaymentMethod === 'SPLIT') ? parseFloat(checkRes.rows[0].credit_amount || 0) : 0);

    const newCreditAmount = (upperMethod === 'CREDIT') 
      ? parseFloat(total_price || 0) 
      : ((upperMethod === 'SPLIT') ? finalCreditAmount : 0);

    const oldExtraAmount = Math.max(0, parseFloat(checkRes.rows[0].paid_amount || 0) + oldCreditAmount - oldPrice);
    const newExtraAmount = Math.max(0, finalPaidAmount + newCreditAmount - total_price);

    if ((oldCreditAmount > 0 && oldCustomer) || (newCreditAmount > 0 && cleanCustomerNumber) ||
        (oldExtraAmount > 0 && oldCustomer) || (newExtraAmount > 0 && cleanCustomerNumber)) {
      try {
        // 1. Revert old credit
        if (oldCreditAmount > 0 && oldCustomer) {
          await pool.query(
            `UPDATE customer_loyalty 
             SET balance = COALESCE(balance, 0) + $1, last_visit = NOW() 
             WHERE user_id = $2 AND customer_number = $3`,
            [oldCreditAmount, userId, oldCustomer]
          );
          await pool.query(
            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
             VALUES ($1, $2, 'CREDIT_REFUND', $3, 0, $4, NOW())`,
            [userId, oldCustomer, oldCreditAmount, `Refund of credit purchase for modified Order Bill: ${bill_no || checkRes.rows[0].bill_no || id}`]
          );
        }

        // 2. Revert old overpayment (reversal of advance)
        if (oldExtraAmount > 0 && oldCustomer) {
          await pool.query(
            `UPDATE customer_loyalty 
             SET balance = COALESCE(balance, 0) - $1, last_visit = NOW() 
             WHERE user_id = $2 AND customer_number = $3`,
            [oldExtraAmount, userId, oldCustomer]
          );
          await pool.query(
            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
             VALUES ($1, $2, 'BILL_PAYMENT_REVERSAL', $3, 0, $4, NOW())`,
            [userId, oldCustomer, -oldExtraAmount, `Reversal of overpayment for modified Order Bill: ${bill_no || checkRes.rows[0].bill_no || id}`]
          );
        }

        // 3. Apply new credit
        if (newCreditAmount > 0 && cleanCustomerNumber) {
          const loyaltyRes = await pool.query(
            "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
            [userId, cleanCustomerNumber]
          );
          if (loyaltyRes.rows.length === 0) {
            const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, cleanCustomerNumber]);
            const custName = custRes.rows[0]?.name || customer_name || "Customer";
            await pool.query(
              `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
               VALUES ($1, $2, $3, 0, $4, 0.00, NOW())`,
              [userId, cleanCustomerNumber, custName, -newCreditAmount]
            );
          } else {
            await pool.query(
              `UPDATE customer_loyalty 
               SET balance = COALESCE(balance, 0) - $1, last_visit = NOW() 
               WHERE user_id = $2 AND customer_number = $3`,
              [newCreditAmount, userId, cleanCustomerNumber]
            );
          }
          await pool.query(
            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
             VALUES ($1, $2, 'CREDIT_PURCHASE', $3, 0, $4, NOW())`,
            [userId, cleanCustomerNumber, -newCreditAmount, `Credit purchase for Order Bill: ${bill_no || id}`]
          );
        }

        // 4. Apply new overpayment
        if (newExtraAmount > 0 && cleanCustomerNumber) {
          const loyaltyRes = await pool.query(
            "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
            [userId, cleanCustomerNumber]
          );
          if (loyaltyRes.rows.length === 0) {
            const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, cleanCustomerNumber]);
            const custName = custRes.rows[0]?.name || customer_name || "Customer";
            await pool.query(
              `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
               VALUES ($1, $2, $3, 0, $4, 0.00, NOW())`,
              [userId, cleanCustomerNumber, custName, newExtraAmount]
            );
          } else {
            await pool.query(
              `UPDATE customer_loyalty 
               SET balance = COALESCE(balance, 0) + $1, last_visit = NOW() 
               WHERE user_id = $2 AND customer_number = $3`,
              [newExtraAmount, userId, cleanCustomerNumber]
            );
          }
          await pool.query(
            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
             VALUES ($1, $2, 'BILL_PAYMENT', $3, 0, $4, NOW())`,
            [userId, cleanCustomerNumber, newExtraAmount, `Overpayment advance/payoff for Order Bill: ${bill_no || id}`]
          );
        }
      } catch (adjustErr) {
        console.error("Failed to adjust customer balance on order update:", adjustErr);
      }
    }

    // 🔥 Trigger Webhook for Dashboard Sync
    try {
      const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
      const biz = bizRes.rows[0];
      if (biz) {
        triggerWebhook(biz, 'order.updated', updatedOrder);
      }
    } catch (webhookErr) {
      console.error("Webhook trigger error on order update:", webhookErr);
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("🔥 POS ORDER UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update POS order" });
  }
});

// ✅ GET RECENT ORDERS (LIMIT 50)
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const { terminal } = req.query;

    let queryText = `
       SELECT o.*, 
              COALESCE(w.name, w.username) as waiter_name,
              dp.name as rider_name,
              dp.phone as rider_phone
       FROM orders o 
       LEFT JOIN app_users w ON o.waiter_id = w.id 
       LEFT JOIN delivery_partners dp ON o.rider_id = dp.id
       WHERE o.user_id = $1`;
    let queryParams = [userId];

    if (terminal === 'POS_ANDROID') {
      queryText += " AND o.source IN ('POS_ANDROID', 'POS_WINDOWS', 'POS_WINDOWS_OFFLINE', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU')";
    } else if (terminal === 'POS_WINDOWS') {
      queryText += " AND (o.source IS NULL OR o.source IN ('POS_WINDOWS', 'POS_WINDOWS_OFFLINE', 'POS_ANDROID', 'POS_TERMINAL', 'POS_OFFLINE', 'POS_MANUAL', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU'))";
    }

    const deviceId = req.headers['x-device-id'] || req.headers['X-Device-ID'] || req.query.device_id || null;
    if (deviceId) {
      queryParams.push(deviceId);
      queryText += ` AND o.device_id = $${queryParams.length}`;
    }

    queryText += " ORDER BY o.created_at DESC LIMIT 50";

    const dbRes = await pool.query(queryText, queryParams);
    res.json(dbRes.rows);
  } catch (err) {
    console.error("🔥 RECENT ORDERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET ALL ORDERS FOR LOGGED-IN BUSINESS (or target user if admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { target_user_id, startDate, endDate, terminal } = req.query;
    let userId = req.user.bizId;

    // If target_user_id is supplied (e.g. from POS or Android Orders App)
    if (target_user_id) {
       userId = target_user_id;
    }

    let queryText = `
      SELECT o.*, 
             COALESCE(w.name, w.username) as waiter_name,
             dp.name as rider_name,
             dp.phone as rider_phone
      FROM orders o 
      LEFT JOIN app_users w ON o.waiter_id = w.id 
      LEFT JOIN delivery_partners dp ON o.rider_id = dp.id
      WHERE o.user_id = $1`;
    let queryParams = [userId];

    if (startDate) {
      queryParams.push(startDate);
      queryText += ` AND o.created_at >= $${queryParams.length}`;
    }
    if (endDate) {
      queryParams.push(endDate);
      queryText += ` AND o.created_at <= $${queryParams.length}`;
    }

    if (terminal === 'POS_ANDROID') {
      queryText += " AND o.source IN ('POS_ANDROID', 'POS_WINDOWS', 'POS_WINDOWS_OFFLINE', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU')";
    } else if (terminal === 'POS_WINDOWS') {
      queryText += " AND (o.source IS NULL OR o.source IN ('POS_WINDOWS', 'POS_WINDOWS_OFFLINE', 'POS_ANDROID', 'POS_TERMINAL', 'POS_OFFLINE', 'POS_MANUAL', 'ONLINE_ORDER', 'WHATSAPP', 'QR_MENU'))";
    }

    const deviceId = req.headers['x-device-id'] || req.headers['X-Device-ID'] || req.query.device_id || null;
    if (deviceId) {
      queryParams.push(deviceId);
      queryText += ` AND o.device_id = $${queryParams.length}`;
    }

    queryText += " ORDER BY o.created_at DESC";

    const dbRes = await pool.query(queryText, queryParams);
    res.json(dbRes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE ORDER STATUS
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason, source } = req.body;
    const userId = req.user.bizId;

    // Verify ownership & Fetch order data for notification
    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const order = checkRes.rows[0];

    if (status === 'CANCELLED' && rejection_reason) {
      await pool.query("UPDATE orders SET status = $1, rejection_reason = $2, source = COALESCE($3, source) WHERE id = $4", [status, rejection_reason, source || null, id]);
    } else {
      await pool.query("UPDATE orders SET status = $1, source = COALESCE($2, source) WHERE id = $3", [status, source || null, id]);
    }

    // 🔥 WEBHOOK TRIGGER
    const bizRes = await pool.query("SELECT id, name, settings FROM restaurants WHERE user_id = $1", [userId]);
    if (bizRes.rows.length > 0) {
        triggerWebhook(bizRes.rows[0], 'order.status_changed', { order_id: id, status, reference: order.order_reference });
    }

    
    // Proactively Notify Customer via WhatsApp
    try {
        const customerNumber = order.customer_number;
        const ref = order.order_reference || `#${id}`;
        let updateMsg = "";
        
        if (status === 'PROCESSING') {
            updateMsg = `🔥 *Order Confirmed & Preparing:* Your order *${ref}* is now being prepared! We'll notify you when it's on the way.`;
        } else if (status === 'DISPATCHED') {
            const isTable = order.table_number && order.table_number !== "0";
            const isPickup = order.address?.toLowerCase() === 'pickup';
            
            if (isTable) {
                updateMsg = `🍽️ *Serving Now:* Your order *${ref}* is being served to *Table ${order.table_number}*. Enjoy your meal!`;
            } else if (isPickup) {
                updateMsg = `🛍️ *Ready for Pickup:* Your order *${ref}* is ready! Please collect it from the counter.`;
            } else {
                updateMsg = `🚚 *Out for Delivery:* Your order *${ref}* is on the way! Our rider will contact you shortly.`;
            }
        } else if (status === 'COMPLETED') {
            // 🏆 AWARD LOYALTY POINTS ON COMPLETION
            const pointsSummary = await awardLoyaltyPoints(order, userId);

            const isTable = order.table_number ? true : false;
            if (isTable) {
                updateMsg = `🏁 *Served:* Your items for Table *${order.table_number}* have been served. Enjoy your meal! 🍽️${pointsSummary}\n\nHow was your experience? Reply with a rating (1 to 5)!`;
            } else {
                updateMsg = `🏁 *Delivered:* Your order *${ref}* was successful. Enjoy!${pointsSummary}\n\nHow was your experience? Reply with a rating (1 to 5) and any comments!`;
            }
        } else if (status === 'CANCELLED') {
            const finalReason = rejection_reason || order.rejection_reason;
            updateMsg = `❌ *Cancelled:* Your order *${ref}* has been cancelled.${finalReason ? `\nReason: *${finalReason}*` : ''}`;
            
            // 🔄 REFUND CREDIT ON CANCELLATION
            const creditRefundAmount = (String(order.payment_method).toUpperCase() === 'CREDIT')
              ? (parseFloat(order.total_price) || 0)
              : ((String(order.payment_method).toUpperCase() === 'SPLIT') ? (parseFloat(order.credit_amount) || 0) : 0);

            if (creditRefundAmount > 0) {
                try {
                    const cleanPhone = order.customer_number || "";
                    if (cleanPhone) {
                        await pool.query(
                            "UPDATE customer_loyalty SET balance = COALESCE(balance, 0) + $1 WHERE user_id = $2 AND customer_number = $3",
                            [creditRefundAmount, userId, cleanPhone]
                        );
                        await pool.query(
                            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                             VALUES ($1, $2, 'CREDIT_REFUND', $3, 0, $4, NOW())`,
                            [userId, cleanPhone, creditRefundAmount, `Credit refund for cancelled Order Bill: ${order.bill_no || order.order_reference || id}`]
                        );
                        console.log(`🔄 Refunded credit ${creditRefundAmount} to ${cleanPhone} for cancelled order ${id}`);
                    }
                } catch (creditRefundErr) {
                    console.error("Refund credit fail:", creditRefundErr);
                }
            }

            // 🔄 REVERT OVERPAYMENT ON CANCELLATION
            const oldCredit = (String(order.payment_method).toUpperCase() === 'CREDIT')
              ? (parseFloat(order.total_price) || 0)
              : ((String(order.payment_method).toUpperCase() === 'SPLIT') ? (parseFloat(order.credit_amount) || 0) : 0);
            const extraRefundAmount = Math.max(0, (parseFloat(order.paid_amount) || 0) + oldCredit - (parseFloat(order.total_price) || 0));

            if (extraRefundAmount > 0) {
                try {
                    const cleanPhone = order.customer_number || "";
                    if (cleanPhone) {
                        await pool.query(
                            "UPDATE customer_loyalty SET balance = COALESCE(balance, 0) - $1 WHERE user_id = $2 AND customer_number = $3",
                            [extraRefundAmount, userId, cleanPhone]
                        );
                        await pool.query(
                            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                             VALUES ($1, $2, 'BILL_PAYMENT_REVERSAL', $3, 0, $4, NOW())`,
                            [userId, cleanPhone, -extraRefundAmount, `Overpayment reversal for cancelled Order Bill: ${order.bill_no || order.order_reference || id}`]
                        );
                        console.log(`🔄 Reverted overpayment ${extraRefundAmount} for cancelled order ${id}`);
                    }
                } catch (overpayRevertErr) {
                    console.error("Revert overpayment fail:", overpayRevertErr);
                }
            }

            // 🔄 RETURN POINTS ON CANCELLATION
            if ((parseInt(order.redeemed_points) || 0) > 0) {
                try {
                    const cleanPhone = (order.customer_number || "").replace(/\D/g, "");
                    const dbPhone = cleanPhone ? `+${cleanPhone}` : "";
                    if (dbPhone) {
                        await pool.query(
                            "UPDATE customer_loyalty SET points = points + $1 WHERE user_id = $2 AND customer_number = $3",
                            [order.redeemed_points, userId, dbPhone]
                        );
                        // Log refund transaction
                        await pool.query(
                            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                             VALUES ($1, $2, 'POINTS_REFUNDED', 0.00, $3, $4, NOW())`,
                            [userId, dbPhone, order.redeemed_points, `Points refunded for cancelled Order: ${order.bill_no || order.order_reference || id}`]
                        );
                        updateMsg += `\n🎁 ${order.redeemed_points} points have been returned to your balance.`;
                        console.log(`🔄 Returned ${order.redeemed_points} points to ${dbPhone} for Biz ${userId}`);
                    }
                } catch (refundErr) { console.error("Refund points fail:", refundErr); }
            }

            // 🛵 NOTIFY RIDER IF DISPATCHED
            if (order.rider_id) {
                try {
                    const riderRes = await pool.query("SELECT phone FROM delivery_partners WHERE id = $1", [order.rider_id]);
                    const riderPhone = riderRes.rows[0]?.phone;
                    if (riderPhone) {
                        const riderMsg = `🚨 *ORDER CANCELLED!* \n━━━━━━━━━━━━━━\nOrder *${ref}* for *${order.customer_name}* has been cancelled. \n\nPlease do not deliver and return to base if necessary. 🙏`;
                        await whatsappManager.sendOfficialMessage(riderPhone, riderMsg, userId);
                    }
                } catch (riderNotifErr) { console.error("Rider cancellation notif fail:", riderNotifErr); }
            }
        }

        // 🔥 EXTRA: If admin manually moves order from AWAITING_PAYMENT to PENDING/PROCESSING, trigger KOT
        if (order.status === 'AWAITING_PAYMENT' && (status === 'PENDING' || status === 'PROCESSING')) {
            const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
            const biz = bizRes.rows[0];
            const itemsArr = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
            const symbol = biz?.currency_code === 'USD' ? '$' : '₹';
            
            await whatsappManager.notifyKitchenAndStaff(
                userId, order.order_reference, order.customer_name, order.customer_number, itemsArr,
                parseFloat(order.total_price), parseFloat(order.total_price), 0, 0, 0, 0, symbol,
                'manual-override', order.address, order.table_number
            );
        }

        if (updateMsg && customerNumber) {
            await whatsappManager.sendOfficialMessage(customerNumber, updateMsg, userId, `STATUS_${id}_${status}`);
        }
    } catch (notifErr) { console.error("Notification Fail:", notifErr); }

    res.json({ message: "Order status updated and customer notified" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE PAYMENT STATUS
router.put("/:id/payment", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    const userId = req.user.bizId;

    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await pool.query("UPDATE orders SET payment_status = $1 WHERE id = $2", [payment_status, id]);
    res.json({ message: "Payment status updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 💸 ADD CHARGES TO ORDER (Dynamic Update)
router.patch("/:id/charges", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount } = req.body;
    const userId = req.user.bizId;

    // Fetch current order
    const orderRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (orderRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const order = orderRes.rows[0];
    const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);

    // Add charge as a special item
    items.push({ 
      id: `CHARGE-${Math.random().toString(36).substring(7).toUpperCase()}`, 
      name: title, 
      qty: 1, 
      price: parseFloat(amount),
      is_charge: true 
    });

    const newTotal = parseFloat(order.total_price) + parseFloat(amount);

    await pool.query("UPDATE orders SET items = $1, total_price = $2 WHERE id = $3", [JSON.stringify(items), newTotal, id]);

    res.json({ message: "Charge applied successfully", total_price: newTotal });
  } catch (err) {
    console.error("🔥 ADD CHARGES ERROR:", err);
    res.status(500).json({ error: "Failed to apply charges" });
  }
});

// 🎁 ADD DISCOUNT TO ORDER (Dynamic Update)
router.patch("/:id/discount", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type } = req.body; // type can be 'FIXED' or 'PERCENTAGE'
    const userId = req.user.bizId;

    // Fetch current order
    const orderRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (orderRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const order = orderRes.rows[0];
    const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);

    let discountAmount = parseFloat(amount);
    if (type === 'PERCENTAGE') {
        const currentSubtotal = items.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
        discountAmount = (currentSubtotal * parseFloat(amount)) / 100;
    }

    // Add discount as a special item with negative price
    items.push({ 
      id: `DISCOUNT-${Math.random().toString(36).substring(7).toUpperCase()}`, 
      name: title || "Discount", 
      qty: 1, 
      price: -discountAmount,
      is_discount: true 
    });

    const newTotal = parseFloat(order.total_price) - discountAmount;

    await pool.query("UPDATE orders SET items = $1, total_price = $2 WHERE id = $3", [JSON.stringify(items), newTotal, id]);

    res.json({ message: "Discount applied successfully", total_price: newTotal });
  } catch (err) {
    console.error("🔥 ADD DISCOUNT ERROR:", err);
    res.status(500).json({ error: "Failed to apply discount" });
  }
});

// ✂️ SPLIT BILL BY ITEMS
router.post("/:id/split", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { items_to_split } = req.body; // Array of {id, qty}
    const userId = req.user.bizId;

    // Fetch current order
    const orderRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (orderRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const order = orderRes.rows[0];
    const originalItems = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);

    const splitItems = [];
    const remainingItems = [];

    for (const item of originalItems) {
        const splitSpec = items_to_split.find(s => s.id === item.id);
        if (splitSpec) {
            if (splitSpec.qty >= item.qty) {
                // Move full item
                splitItems.push(item);
            } else {
                // Split quantity
                splitItems.push({ ...item, qty: splitSpec.qty });
                remainingItems.push({ ...item, qty: item.qty - splitSpec.qty });
            }
        } else {
            remainingItems.push(item);
        }
    }

    if (splitItems.length === 0) {
        return res.status(400).json({ error: "No items selected for split" });
    }

    // Recalculate totals
    const calcTotal = (items) => items.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
    const remainingTotal = calcTotal(remainingItems);
    const splitTotal = calcTotal(splitItems);

    // Update original order
    await pool.query("UPDATE orders SET items = $1, total_price = $2 WHERE id = $3", [JSON.stringify(remainingItems), remainingTotal, id]);

    // Create new order
    const orderRef = `SPLIT-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const newOrderRes = await pool.query(
      `INSERT INTO orders (
        user_id, restaurant_id, order_reference, customer_name, customer_number, items, 
        total_price, payment_method, status, payment_status, 
        table_number, address, source, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) RETURNING *`,
      [
        userId, order.restaurant_id || null, orderRef, order.customer_name, order.customer_number, 
        JSON.stringify(splitItems), splitTotal, order.payment_method, 
        order.status, order.payment_status, 
        order.table_number, order.address, 'POS_TERMINAL'
      ]
    );

    res.json({ 
        message: "Bill split successfully", 
        original_order: { id, total_price: remainingTotal },
        new_order: newOrderRes.rows[0]
    });

  } catch (err) {
    console.error("🔥 SPLIT ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to split order" });
  }
});

// ✅ GET ZATCA QR CODE FOR ORDER (Phase 4 Compliance)
router.get("/:id/zatca-qr", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.bizId;

    // Fetch order details
    const orderRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (orderRes.rows.length === 0) return res.status(404).json({ error: "Order not found" });

    const order = orderRes.rows[0];

    // Fetch business details (Seller Name and VAT Number)
    const userRes = await pool.query("SELECT business_name, gst_number FROM app_users WHERE id = $1", [userId]);
    const user = userRes.rows[0];

    const sellerName = user.business_name || "SaSLoop Merchant";
    const sellerTRN = user.gst_number || "300000000000003"; // Dummy TRN if missing
    const invoiceDate = order.created_at.toISOString();
    const invoiceTotal = String(order.total_price);
    
    // Assuming 15% VAT for KSA if not specified
    const vatTotal = String((parseFloat(order.total_price) * 0.15).toFixed(2)); 

    const tags = [
      new Tag(ZATCA_TAGS.SELLER_NAME, sellerName),
      new Tag(ZATCA_TAGS.SELLER_TRN, sellerTRN),
      new Tag(ZATCA_TAGS.INVOICE_DATE, invoiceDate),
      new Tag(ZATCA_TAGS.INVOICE_TOTAL, invoiceTotal),
      new Tag(ZATCA_TAGS.VAT_TOTAL, vatTotal)
    ];

    const qrBase64 = tagsToBase64(tags);

    res.json({ qrCode: qrBase64 });
  } catch (err) {
    console.error("🔥 ZATCA QR ERROR:", err);
    res.status(500).json({ error: "Failed to generate ZATCA QR" });
  }
});

// ✅ DELETE SINGLE ORDER
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.bizId || req.user.id;
    await pool.query("DELETE FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete order:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ BULK DELETE ORDERS
router.post("/bulk-delete", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.user.bizId || req.user.id;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid order IDs" });
    }
    await pool.query("DELETE FROM orders WHERE id = ANY($1) AND user_id = $2", [ids.map(Number), userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to bulk delete orders:", err);
    res.status(500).json({ error: err.message });
  }
});



// 🚚 UPDATE DELIVERY CHARGE & TRIGGER WHATSAPP CONFIRMATION
router.put("/:id/delivery-charge", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.bizId;
    const { delivery_charge } = req.body;
    const newCharge = parseFloat(delivery_charge || 0);

    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }
    const order = checkRes.rows[0];

    const oldCharge = parseFloat(order.delivery_charge || 0);
    const oldTotal = parseFloat(order.total_price || 0);
    const subtotal = oldTotal - oldCharge;
    const newTotal = subtotal + newCharge;

    const result = await pool.query(
      "UPDATE orders SET delivery_charge = $1, total_price = $2, status = 'AWAITING_CUSTOMER_CONFIRMATION' WHERE id = $3 AND user_id = $4 RETURNING *",
      [newCharge, newTotal, id, userId]
    );

    const updatedOrder = result.rows[0];

    try {
      const targetPhone = updatedOrder.customer_number;
      if (targetPhone) {
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        const symbol = (biz && biz.currency_code === "USD") ? String.fromCharCode(36) : "₹";

        const chargeMsg = [
          "📦 *AREA SERVICEABLE & ORDER TOTAL UPDATED!*",
          "━━━━━━━━━━━━━━━━",
          "*Order Ref:* " + (updatedOrder.order_reference || ("#" + updatedOrder.id)),
          "*Address:* " + (updatedOrder.address || ""),
          "Subtotal: " + symbol + subtotal.toFixed(2),
          "Delivery Charge: +" + symbol + newCharge.toFixed(2),
          "───────────────",
          "*Total Amount Payable: " + symbol + newTotal.toFixed(2) + "*",
          "━━━━━━━━━━━━━━━━",
          "Your area is serviceable! Please confirm if you accept the total amount including delivery charges so we can process your order: 👇"
        ].join("\n");

        await whatsappManager.sendButtons(targetPhone, chargeMsg, [
          { id: "confirm_charge_" + updatedOrder.id, title: "✅ Confirm Order" },
          { id: "cancel_charge_" + updatedOrder.id, title: "❌ Cancel Order" }
        ], userId);
      }
    } catch (waErr) {
      console.error("WhatsApp delivery charge confirmation notification error:", waErr);
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("🔥 UPDATE DELIVERY CHARGE ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to update delivery charge" });
  }
});

// 💳 UPDATE ORDER PAYMENT STATUS (POS & Orders App)
router.put("/:id/payment", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;

    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    const order = checkRes.rows[0];

    const newPayStatus = payment_status ? String(payment_status).toUpperCase() : (order.payment_status || 'RECEIVED');
    const newPayMethod = payment_method ? String(payment_method).toUpperCase() : (order.payment_method || 'CASH');

    const updateRes = await pool.query(
      `UPDATE orders 
       SET payment_status = $1, 
           payment_method = $2,
           updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [newPayStatus, newPayMethod, id]
    );

    const updatedOrder = updateRes.rows[0];

    // Trigger Webhook & Notifications if needed
    try {
      const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [order.user_id]);
      const biz = bizRes.rows[0];
      if (biz) {
        triggerWebhook(biz, 'order.updated', updatedOrder);
      }
    } catch (wErr) {
      console.error("Webhook trigger fail on payment update:", wErr);
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("🔥 UPDATE PAYMENT STATUS ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to update payment status" });
  }
});

module.exports = router;
