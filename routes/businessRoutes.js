const express = require("express");
const router = express.Router();
const pool = require("../db");
const whatsappManager = require("../whatsappManager");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/business/setup
const fs = require('fs');
router.post("/setup", authMiddleware, async (req, res) => {
  // HARD LOG TO FILE
  fs.appendFileSync('setup_debug.log', `\n[${new Date().toISOString()}] BODY: ` + JSON.stringify(req.body));
  
  console.log("--- INCOMING SETUP DATA ---");
  console.log("Keys:", Object.keys(req.body));
  console.log("Raw Payload:", JSON.stringify(req.body, null, 2));
  
  const { 
    name, phone, address, businessType, settings, bot_knowledge,
    latitude, longitude, delivery_radius_km,
    kitchen_number, notification_numbers, track_inventory, low_stock_threshold, currency_code,
    cgst_percent, sgst_percent, gst_included, show_gst_on_receipt,
    logo_url, banner_url, social_instagram, social_facebook, social_twitter, social_youtube, social_website,
    loyalty_enabled, points_per_100, points_to_amount_ratio, min_redeem_points, max_redeem_per_order,
    delivery_tiers, is_auth_required, fulfillment_options,
    target_user_id
  } = req.body;

  try {
    let userId = req.user.id;
    if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
       userId = target_user_id;
    }

    console.log(`💾 SAVING BUSINESS RULES FOR USER_ID: ${userId}`);
    let finalBiz;

    // 1. Check if user already has a business
    const existing = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
    if (existing.rows.length > 0) {
      const e = existing.rows[0];
      // Update business
      const result = await pool.query(
        `UPDATE restaurants 
         SET name=$1, phone=$2, address=$3, business_type=$4, settings=$5,
             latitude=$6, longitude=$7, delivery_radius_km=$8,
             kitchen_number=$9, notification_numbers=$10, track_inventory=$11, low_stock_threshold=$12, currency_code=$13,
              cgst_percent=$14, sgst_percent=$15, gst_included=$16, show_gst_on_receipt=$17,
              logo_url=$18, banner_url=$19, social_instagram=$20, social_facebook=$21, social_twitter=$22, social_youtube=$23, social_website=$24,
              loyalty_enabled=$25, points_per_100=$26, points_to_amount_ratio=$27, min_redeem_points=$28, max_redeem_per_order=$29,
              delivery_tiers=$30, is_auth_required=$31, fulfillment_options=$32
          WHERE user_id=$33 RETURNING *`,
        [
          name !== undefined ? name : e.name, 
          phone !== undefined ? phone : e.phone, 
          address !== undefined ? address : e.address, 
          businessType !== undefined ? businessType : e.business_type, 
          JSON.stringify(settings !== undefined ? { ...(e.settings || {}), ...settings } : (e.settings || {})),
          (latitude !== undefined && latitude !== "") ? latitude : (latitude === "" ? null : e.latitude), 
          (longitude !== undefined && longitude !== "") ? longitude : (longitude === "" ? null : e.longitude), 
          delivery_radius_km !== undefined ? delivery_radius_km : e.delivery_radius_km,
          kitchen_number !== undefined ? kitchen_number : e.kitchen_number, 
          notification_numbers !== undefined ? notification_numbers : e.notification_numbers, 
          track_inventory !== undefined ? track_inventory : e.track_inventory, 
          low_stock_threshold !== undefined ? low_stock_threshold : e.low_stock_threshold, 
          currency_code !== undefined ? currency_code : e.currency_code,
          cgst_percent !== undefined ? parseFloat(cgst_percent) : e.cgst_percent, 
          sgst_percent !== undefined ? parseFloat(sgst_percent) : e.sgst_percent, 
          gst_included !== undefined ? !!gst_included : e.gst_included, 
          show_gst_on_receipt !== undefined ? !!show_gst_on_receipt : e.show_gst_on_receipt,
          logo_url !== undefined ? logo_url : e.logo_url, 
          banner_url !== undefined ? banner_url : e.banner_url, 
          social_instagram !== undefined ? social_instagram : e.social_instagram, 
          social_facebook !== undefined ? social_facebook : e.social_facebook, 
          social_twitter !== undefined ? social_twitter : e.social_twitter, 
          social_youtube !== undefined ? social_youtube : e.social_youtube, 
          social_website !== undefined ? social_website : e.social_website,
          loyalty_enabled !== undefined ? !!loyalty_enabled : e.loyalty_enabled,
          points_per_100 !== undefined ? parseInt(points_per_100) : e.points_per_100,
          points_to_amount_ratio !== undefined ? parseFloat(points_to_amount_ratio) : e.points_to_amount_ratio,
          min_redeem_points !== undefined ? parseInt(min_redeem_points) : e.min_redeem_points,
          max_redeem_per_order !== undefined ? parseInt(max_redeem_per_order) : e.max_redeem_per_order,
          JSON.stringify(delivery_tiers !== undefined ? delivery_tiers : (e.delivery_tiers || [])),
          is_auth_required !== undefined ? !!is_auth_required : e.is_auth_required,
          JSON.stringify(fulfillment_options !== undefined ? fulfillment_options : (e.fulfillment_options || {dinein: true, pickup: true, delivery: true})),
          userId
        ]
      );
      if (bot_knowledge !== undefined) {
          await pool.query("UPDATE app_users SET bot_knowledge = $1 WHERE id = $2", [bot_knowledge, userId]);
      }
      
      console.log(`✅ BUSINESS UPDATED FOR ${userId}:`, result.rows[0]);
      finalBiz = result.rows[0];
    } else {
      // 2. Insert new business
      const result = await pool.query(
        `INSERT INTO restaurants 
         (name, phone, address, user_id, business_type, settings, latitude, longitude, delivery_radius_km, kitchen_number, notification_numbers, track_inventory, low_stock_threshold, currency_code, cgst_percent, sgst_percent, gst_included, show_gst_on_receipt, logo_url, banner_url, social_instagram, social_facebook, social_twitter, social_youtube, social_website, loyalty_enabled, points_per_100, points_to_amount_ratio, min_redeem_points, max_redeem_per_order, delivery_tiers, is_auth_required, fulfillment_options) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33) RETURNING *`,
        [
            name, phone, address || '', userId, businessType || 'restaurant', settings || {},
            (latitude === "" ? null : latitude) || null, (longitude === "" ? null : longitude) || null, delivery_radius_km || 10,
            kitchen_number || '', notification_numbers || [], track_inventory || false, low_stock_threshold || 5, currency_code || 'INR',
            parseFloat(cgst_percent) || 0, parseFloat(sgst_percent) || 0, !!gst_included, show_gst_on_receipt !== undefined ? !!show_gst_on_receipt : true,
            logo_url || null, banner_url || null, social_instagram || '', social_facebook || '', social_twitter || '', social_youtube || '', social_website || '',
            loyalty_enabled !== undefined ? !!loyalty_enabled : true,
            parseInt(points_per_100) || 5,
            parseFloat(points_to_amount_ratio) || 10.00,
            parseInt(min_redeem_points) || 300,
            parseInt(max_redeem_per_order) || 300,
            JSON.stringify(delivery_tiers || []),
            !!is_auth_required,
            JSON.stringify(fulfillment_options || {dinein: true, pickup: true, delivery: true})
        ]
      );
      console.log(`✨ NEW BUSINESS CREATED FOR ${userId}:`, result.rows[0]);
      finalBiz = result.rows[0];
    }

    if (bot_knowledge !== undefined) {
        await pool.query("UPDATE app_users SET bot_knowledge = $1 WHERE id = $2", [bot_knowledge, userId]);
    }

    // 🔥 AUTOMATIC WHATSAPP SYNC (Background)
    console.log(`[TRIGGER] Launching WhatsApp Sync for ${finalBiz.name}`);
    whatsappManager.syncBusinessProfileToWhatsApp(userId, finalBiz).catch(e => console.error("WhatsApp Async Sync Failed:", e));

    res.json({ message: "Business setup saved successfully", business: finalBiz });

  } catch (err) {
    console.error("BUSINESS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/business/status
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const { target_user_id } = req.query;
    let userId = req.user.id;
    if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
       userId = target_user_id;
    }

    const existing = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
    const userRow = await pool.query("SELECT bot_knowledge FROM app_users WHERE id = $1", [userId]);
    
    if (existing.rows.length > 0) {
      res.json({ hasBusiness: true, business: existing.rows[0], bot_knowledge: userRow.rows[0]?.bot_knowledge });
    } else {
      res.json({ hasBusiness: false, bot_knowledge: userRow.rows[0]?.bot_knowledge });
    }
  } catch (err) {
    console.error("BUSINESS STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/business/waiter-requests
router.get("/waiter-requests", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.id;
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
           userId = target_user_id;
        }

        const result = await pool.query(
            "SELECT * FROM waiter_requests WHERE user_id = $1 AND status = 'PENDING' ORDER BY created_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("WAITER REQUESTS ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/business/waiter-requests/resolve
router.put("/waiter-requests/resolve", authMiddleware, async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query("UPDATE waiter_requests SET status = 'COMPLETED' WHERE id = $1", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error("RESOLVE WAITER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// STAFF MANAGEMENT
// ============================================

// GET /api/business/staff
router.get("/staff", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.id;
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
           userId = target_user_id;
        }

        const result = await pool.query(
            "SELECT id, name, email, role, status, staff_permissions FROM app_users WHERE parent_user_id = $1",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/business/staff
const bcrypt = require("bcrypt");
router.post("/staff", authMiddleware, async (req, res) => {
    const { name, email, password, role, permissions, target_user_id, phone, pos_pin } = req.body;
    try {
        let userId = req.user.id;
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
           userId = target_user_id;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO app_users (name, email, password, role, parent_user_id, staff_permissions, phone, pos_pin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, role, phone, pos_pin",
            [name, email, hashedPassword, role, userId, JSON.stringify(permissions || {}), phone, pos_pin]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/business/staff/:id
router.delete("/staff/:id", authMiddleware, async (req, res) => {
    try {
        await pool.query("DELETE FROM app_users WHERE id = $1 AND parent_user_id = $2", [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// EXPENSE TRACKER (LEDGER)
// ============================================

// GET /api/business/expenses
router.get("/expenses", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.id;
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
           userId = target_user_id;
        }

        const result = await pool.query(
            "SELECT * FROM business_expenses WHERE user_id = $1 ORDER BY expense_date DESC, created_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/business/expenses
router.post("/expenses", authMiddleware, async (req, res) => {
    const { category, amount, note, expense_date, target_user_id } = req.body;
    try {
        let userId = req.user.id;
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
           userId = target_user_id;
        }

        const result = await pool.query(
            "INSERT INTO business_expenses (user_id, category, amount, note, expense_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, category, amount, note, expense_date || new Date()]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/business/expenses/:id
router.delete("/expenses/:id", authMiddleware, async (req, res) => {
    try {
        await pool.query("DELETE FROM business_expenses WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/public/widget/:bizId - Serves a dynamic JS file for the chat widget
router.get("/public/widget/:bizId", async (req, res) => {
    try {
        const { bizId } = req.params;
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE id = $1", [bizId]);
        if (bizRes.rows.length === 0) return res.status(404).send("Business not found");
        
        const biz = bizRes.rows[0];
        const settings = biz.settings || {};
        const color = settings.widget_color || '#25D366';
        const greeting = settings.widget_greeting || "Hi! How can we help you today?";
        const position = settings.widget_position || 'right';
        const phone = biz.phone.replace(/\D/g, "");
        const logo = biz.logo_url ? (biz.logo_url.startsWith('http') ? biz.logo_url : `https://sasloop.in${biz.logo_url}`) : 'https://sasloop.in/logo.svg';

        res.setHeader('Content-Type', 'application/javascript');
        res.send(`
(function() {
    const style = document.createElement('style');
    style.innerHTML = \`
        #sasloop-widget { position: fixed; bottom: 20px; ${position}: 20px; z-index: 999999; font-family: sans-serif; }
        .sasloop-fab { width: 60px; height: 60px; background: ${color}; rounded-full; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 50%; transition: transform 0.3s; }
        .sasloop-fab:hover { transform: scale(1.1); }
        .sasloop-popover { position: absolute; bottom: 80px; ${position}: 0; width: 300px; background: white; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: none; overflow: hidden; border: 1px solid #eee; }
        .sasloop-header { background: ${color}; color: white; padding: 20px; display: flex; items-center: center; gap: 12px; }
        .sasloop-header img { width: 40px; height: 40px; border-radius: 10px; background: white; padding: 2px; }
        .sasloop-body { padding: 20px; background: #f9f9f9; }
        .sasloop-bubble { background: white; padding: 12px; border-radius: 0 15px 15px 15px; font-size: 14px; color: #444; box-shadow: 0 2px 5px rgba(0,0,0,0.05); line-height: 1.4; }
        .sasloop-footer { padding: 15px; background: white; }
        .sasloop-btn { display: block; text-align: center; background: #25D366; color: white; text-decoration: none; padding: 12px; border-radius: 12px; font-weight: bold; font-size: 14px; }
    \`;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'sasloop-widget';
    container.innerHTML = \`
        <div class="sasloop-popover" id="sasloop-popover">
            <div class="sasloop-header">
                <img src="${logo}" alt="Logo">
                <div>
                    <div style="font-weight: bold; font-size: 16px;">${biz.name}</div>
                    <div style="font-size: 11px; opacity: 0.8;">Online | Typically replies in minutes</div>
                </div>
            </div>
            <div class="sasloop-body">
                <div class="sasloop-bubble">${greeting}</div>
            </div>
            <div class="sasloop-footer">
                <a href="https://wa.me/${phone}?text=Hi! I am interested in your services." target="_blank" class="sasloop-btn">Start Chat on WhatsApp</a>
            </div>
        </div>
        <div class="sasloop-fab" id="sasloop-fab">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        </div>
    \`;
    document.body.appendChild(container);

    const fab = document.getElementById('sasloop-fab');
    const popover = document.getElementById('sasloop-popover');
    fab.addEventListener('click', () => {
        popover.style.display = popover.style.display === 'block' ? 'none' : 'block';
    });
})();
        `);
    } catch (err) {
        res.status(500).send("Error generating widget");
    }
});

module.exports = router;

