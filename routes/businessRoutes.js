const express = require("express");
const router = express.Router();
const pool = require("../db");
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
    target_user_id
  } = req.body;

  try {
    let userId = req.user.id;
    if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
       userId = target_user_id;
    }

    console.log(`💾 SAVING BUSINESS RULES FOR USER_ID: ${userId}`);

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
              loyalty_enabled=$25, points_per_100=$26, points_to_amount_ratio=$27, min_redeem_points=$28, max_redeem_per_order=$29
          WHERE user_id=$30 RETURNING *`,
        [
          name !== undefined ? name : e.name, 
          phone !== undefined ? phone : e.phone, 
          address !== undefined ? address : e.address, 
          businessType !== undefined ? businessType : e.business_type, 
          settings !== undefined ? { ...(e.settings || {}), ...settings } : e.settings,
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
          userId
        ]
      );
      if (bot_knowledge !== undefined) {
          await pool.query("UPDATE app_users SET bot_knowledge = $1 WHERE id = $2", [bot_knowledge, userId]);
      }
      
      console.log(`✅ BUSINESS UPDATED FOR ${userId}:`, result.rows[0]);
      return res.json({ message: "Business updated successfully", business: result.rows[0] });
    }

    // 2. Insert new business
    const result = await pool.query(
      `INSERT INTO restaurants 
       (name, phone, address, user_id, business_type, settings, latitude, longitude, delivery_radius_km, kitchen_number, notification_numbers, track_inventory, low_stock_threshold, currency_code, cgst_percent, sgst_percent, gst_included, show_gst_on_receipt, logo_url, banner_url, social_instagram, social_facebook, social_twitter, social_youtube, social_website, loyalty_enabled, points_per_100, points_to_amount_ratio, min_redeem_points, max_redeem_per_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *`,
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
          parseInt(max_redeem_per_order) || 300
      ]
    );
    if (bot_knowledge !== undefined) {
        await pool.query("UPDATE app_users SET bot_knowledge = $1 WHERE id = $2", [bot_knowledge, userId]);
    }

    console.log(`✨ NEW BUSINESS CREATED FOR ${userId}:`, result.rows[0]);
    res.json({ message: "Business created successfully", business: result.rows[0] });

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

module.exports = router;
