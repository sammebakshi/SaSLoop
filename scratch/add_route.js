const fs = require('fs');

const route = [
  '// 🚚 UPDATE DELIVERY CHARGE & TRIGGER WHATSAPP CONFIRMATION',
  'router.put("/:id/delivery-charge", authMiddleware, async (req, res) => {',
  '  try {',
  '    const { id } = req.params;',
  '    const userId = req.user.bizId;',
  '    const { delivery_charge } = req.body;',
  '    const newCharge = parseFloat(delivery_charge || 0);',
  '',
  '    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);',
  '    if (checkRes.rows.length === 0) {',
  '      return res.status(404).json({ error: "Order not found or unauthorized" });',
  '    }',
  '    const order = checkRes.rows[0];',
  '',
  '    const oldCharge = parseFloat(order.delivery_charge || 0);',
  '    const oldTotal = parseFloat(order.total_price || 0);',
  '    const subtotal = oldTotal - oldCharge;',
  '    const newTotal = subtotal + newCharge;',
  '',
  '    const result = await pool.query(',
  '      "UPDATE orders SET delivery_charge = $1, total_price = $2, status = \'AWAITING_CUSTOMER_CONFIRMATION\' WHERE id = $3 AND user_id = $4 RETURNING *",',
  '      [newCharge, newTotal, id, userId]',
  '    );',
  '',
  '    const updatedOrder = result.rows[0];',
  '',
  '    try {',
  '      const targetPhone = updatedOrder.customer_number;',
  '      if (targetPhone) {',
  '        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);',
  '        const biz = bizRes.rows[0];',
  '        const symbol = (biz && biz.currency_code === "USD") ? String.fromCharCode(36) : "₹";',
  '',
  '        const chargeMsg = [',
  '          "📦 *AREA SERVICEABLE & ORDER TOTAL UPDATED!*",',
  '          "━━━━━━━━━━━━━━━━",',
  '          "*Order Ref:* " + (updatedOrder.order_reference || ("#" + updatedOrder.id)),',
  '          "*Address:* " + (updatedOrder.address || ""),',
  '          "Subtotal: " + symbol + subtotal.toFixed(2),',
  '          "Delivery Charge: +" + symbol + newCharge.toFixed(2),',
  '          "───────────────",',
  '          "*Total Amount Payable: " + symbol + newTotal.toFixed(2) + "*",',
  '          "━━━━━━━━━━━━━━━━",',
  '          "Your area is serviceable! Please confirm if you accept the total amount including delivery charges so we can process your order: 👇"',
  '        ].join("\\n");',
  '',
  '        await whatsappManager.sendButtons(targetPhone, chargeMsg, [',
  '          { id: "confirm_charge_" + updatedOrder.id, title: "✅ Confirm Order" },',
  '          { id: "cancel_charge_" + updatedOrder.id, title: "❌ Cancel Order" }',
  '        ], userId);',
  '      }',
  '    } catch (waErr) {',
  '      console.error("WhatsApp delivery charge confirmation notification error:", waErr);',
  '    }',
  '',
  '    res.json(updatedOrder);',
  '  } catch (err) {',
  '    console.error("🔥 UPDATE DELIVERY CHARGE ERROR:", err);',
  '    res.status(500).json({ error: err.message || "Failed to update delivery charge" });',
  '  }',
  '});'
].join('\n');

function appendRoute(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  const idx = content.indexOf('// 🚚 UPDATE DELIVERY CHARGE');
  if (idx !== -1) {
    content = content.substring(0, idx) + 'module.exports = router;\n';
  }
  content = content.replace('module.exports = router;', route + '\n\nmodule.exports = router;');
  fs.writeFileSync(file, content, 'utf8');
  console.log("Appended route safely to", file);
}

appendRoute('routes/orderRoutes.js');
appendRoute('pos-app/server/routes/orderRoutes.js');
