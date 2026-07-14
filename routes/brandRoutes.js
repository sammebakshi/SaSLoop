const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const XLSX = require("xlsx");

// Helper to synchronize outlet_menu_items edits back to business_items (for POS catalog)
async function syncOutletItemToBusinessCatalog(outletMenuItemId, userId) {
  try {
    const omiRes = await pool.query(
      `SELECT omi.*, c.name as category_name, om.outlet_id 
       FROM outlet_menu_items omi
       LEFT JOIN categories c ON omi.category_id = c.id
       LEFT JOIN outlet_menus om ON omi.menu_id = om.id
       WHERE omi.id = $1`,
      [outletMenuItemId]
    );
    if (omiRes.rows.length === 0) return;
    const omi = omiRes.rows[0];

    const categoryName = omi.category_name || 'Uncategorized';
    const isVeg = omi.food_type?.toLowerCase() === 'veg';
    const price = parseFloat(omi.base_price) || 0;
    const stockCount = omi.stock_qty ? Math.round(parseFloat(omi.stock_qty)) : 0;
    const desc = omi.description || '';
    const salePrice2 = (omi.sale_price_2 !== undefined && omi.sale_price_2 !== '' && omi.sale_price_2 !== null) ? parseFloat(omi.sale_price_2) : null;
    const salePrice3 = (omi.sale_price_3 !== undefined && omi.sale_price_3 !== '' && omi.sale_price_3 !== null) ? parseFloat(omi.sale_price_3) : null;

    let biId = omi.item_id;

    if (biId) {
      const biCheck = await pool.query("SELECT id FROM business_items WHERE id = $1 AND user_id = $2", [biId, userId]);
      if (biCheck.rows.length === 0) {
        biId = null;
      }
    }

    if (!biId) {
      const nameCheck = await pool.query(
        "SELECT id FROM business_items WHERE user_id = $1 AND product_name = $2 AND category = $3 LIMIT 1",
        [userId, omi.item_name, categoryName]
      );
      if (nameCheck.rows.length > 0) {
        biId = nameCheck.rows[0].id;
        await pool.query("UPDATE outlet_menu_items SET item_id = $1 WHERE id = $2", [biId, omi.id]);
      }
    }

    if (biId) {
      await pool.query(
        `UPDATE business_items SET 
           code = COALESCE($1, code), 
           product_name = $2, 
           category = $3, 
           price = $4, 
           availability = $5, 
           image_url = COALESCE($6, image_url), 
           description = COALESCE($7, description), 
           is_veg = $8, 
           stock_count = $9,
           sale_price_2 = $10,
           sale_price_3 = $11
         WHERE id = $12 AND user_id = $13`,
        [
          omi.short_code, omi.item_name, categoryName, price, 
          omi.is_active, omi.image_url, desc, isVeg, 
          stockCount, salePrice2, salePrice3, biId, userId
        ]
      );
    } else {
      const insRes = await pool.query(
        `INSERT INTO business_items (
           user_id, code, product_name, category, price, availability, image_url, description, 
           tax_applicable, is_veg, stock_count, tax_percent, cost_price, kot_category, variants, modifiers,
           sale_price_2, sale_price_3
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, $9, $10, 0.00, 0.00, 'Main Kitchen', '[]', '[]', $11, $12) RETURNING id`,
        [
          userId, omi.short_code, omi.item_name, categoryName, price, 
          omi.is_active, omi.image_url, desc, isVeg, stockCount,
          salePrice2, salePrice3
        ]
      );
      const newBiId = insRes.rows[0].id;
      await pool.query("UPDATE outlet_menu_items SET item_id = $1 WHERE id = $2", [newBiId, omi.id]);
    }
  } catch (err) {
    console.error(`[SYNC-ERROR] Failed to sync outlet item ${outletMenuItemId} to business items:`, err);
  }
}

// ============================================
// 🏙️ MARKET MANAGEMENT
// ============================================


router.get("/markets", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.id;
    const result = await pool.query("SELECT * FROM markets WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/markets", authMiddleware, async (req, res) => {
  const { name, target_user_id } = req.body;
  const userId = target_user_id || req.user.id;
  try {
    const result = await pool.query("INSERT INTO markets (user_id, name) VALUES ($1, $2) RETURNING *", [userId, name]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🏷️ BRAND MANAGEMENT
// ============================================

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.id;
    const result = await pool.query(`
      SELECT b.*, m.name as market_name 
      FROM brands b 
      LEFT JOIN markets m ON b.market_id = m.id 
      WHERE b.user_id = $1 ORDER BY b.created_at DESC`, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  const { 
    name, short_name, market_id, phone, fssai_no, gst_no, pan_no, 
    logo_url, website_url, address, google_analytics_id, is_default 
  } = req.body;
  try {
    // If setting as default, unset others
    if (is_default) {
        await pool.query("UPDATE brands SET is_default = false WHERE user_id = $1", [req.user.id]);
    }

    const result = await pool.query(
      `INSERT INTO brands 
       (user_id, name, short_name, market_id, phone, fssai_no, gst_no, pan_no, logo_url, website_url, address, google_analytics_id, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [req.user.id, name, short_name, market_id, phone, fssai_no, gst_no, pan_no, logo_url, website_url, address, google_analytics_id, !!is_default]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { 
    name, short_name, market_id, phone, fssai_no, gst_no, pan_no, 
    logo_url, website_url, address, google_analytics_id, is_default, is_active 
  } = req.body;
  try {
    if (is_default) {
        await pool.query("UPDATE brands SET is_default = false WHERE user_id = $1", [req.user.id]);
    }

    const result = await pool.query(
      `UPDATE brands 
       SET name=$1, short_name=$2, market_id=$3, phone=$4, fssai_no=$5, gst_no=$6, pan_no=$7, 
           logo_url=$8, website_url=$9, address=$10, google_analytics_id=$11, is_default=$12, is_active=$13
       WHERE id=$14 AND user_id=$15 RETURNING *`,
      [name, short_name, market_id, phone, fssai_no, gst_no, pan_no, logo_url, website_url, address, google_analytics_id, !!is_default, !!is_active, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FETCH ALL OUTLETS FOR THE BRAND OWNER
router.get("/outlets", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, b.name as brand_parent_name, u.email as outlet_email, u.name as owner_name
      FROM restaurants r
      LEFT JOIN brands b ON r.brand_id = b.id
      JOIN app_users u ON r.user_id = u.id
      WHERE u.id = $1 OR u.parent_user_id = $1`, [req.user.bizId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch brand outlets error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ ADD NEW OUTLET (Creates User + Restaurant Profile)
const bcrypt = require("bcryptjs");
router.post("/outlets/add", authMiddleware, async (req, res) => {
  const { 
    name, email, password, brand_id, country, timezone, 
    start_day_time, close_day_time, bill_reset_cycle, kot_reset_cycle,
    notification_email, zip_code, city, location, address, outlet_code,
    phone, logo_url
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Create the Outlet User
    const hashedPassword = await bcrypt.hash(password || 'outlet123', 10);
    const userRes = await client.query(
      "INSERT INTO app_users (name, email, password, role, parent_user_id, phone, status) VALUES ($1, $2, $3, 'user', $4, $5, 'active') RETURNING id",
      [name, email, hashedPassword, req.user.id, phone]
    );
    const newUserId = userRes.rows[0].id;

    // 2. Create the Restaurant Profile
    const restRes = await client.query(
      `INSERT INTO restaurants 
       (user_id, name, brand_id, country, timezone, start_day_time, close_day_time, 
        bill_reset_cycle, kot_reset_cycle, notification_email, zip_code, city, 
        location, address, outlet_code, phone, logo_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [
        newUserId, name, brand_id || null, country || 'India', timezone || 'Asia/Kolkata', 
        start_day_time || '09:00', close_day_time || '23:00', bill_reset_cycle || 'DAILY', 
        kot_reset_cycle || 'DAILY', notification_email, zip_code, city, location, 
        address, outlet_code, phone, logo_url
      ]
    );

    await client.query("COMMIT");
    res.json(restRes.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Add outlet error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ✅ UPDATE OUTLET
router.put("/outlets/update/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { 
    name, brand_id, country, timezone, start_day_time, close_day_time, 
    bill_reset_cycle, kot_reset_cycle, notification_email, zip_code, city, 
    location, address, outlet_code, phone, logo_url,
    logout_pos_on_close, passcode_protection_enabled, send_ebill_whatsapp, feedback_active
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE restaurants 
       SET name=$1, brand_id=$2, country=$3, timezone=$4, start_day_time=$5, close_day_time=$6, 
           bill_reset_cycle=$7, kot_reset_cycle=$8, notification_email=$9, zip_code=$10, city=$11, 
           location=$12, address=$13, outlet_code=$14, phone=$15, logo_url=$16,
           logout_pos_on_close=$17, passcode_protection_enabled=$18, send_ebill_whatsapp=$19, feedback_active=$20
       WHERE id=$21 RETURNING *`,
      [
        name, brand_id || null, country, timezone, start_day_time, close_day_time, 
        bill_reset_cycle, kot_reset_cycle, notification_email, zip_code, city, 
        location, address, outlet_code, phone, logo_url,
        !!logout_pos_on_close, !!passcode_protection_enabled, !!send_ebill_whatsapp, !!feedback_active,
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🏢 CLUSTER MANAGEMENT
// ============================================

router.get("/clusters", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.id;
    const result = await pool.query(`
      SELECT c.*, m.name as market_name, b.name as brand_name 
      FROM clusters c
      LEFT JOIN markets m ON c.market_id = m.id
      LEFT JOIN brands b ON c.brand_id = b.id
      WHERE c.user_id = $1 ORDER BY c.created_at DESC`, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/clusters", authMiddleware, async (req, res) => {
  const { name, market_id, brand_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clusters (user_id, name, market_id, brand_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.id, name, market_id, brand_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/clusters/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM clusters WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🎭 DESIGNATION MANAGEMENT
// ============================================

router.get("/designations", authMiddleware, async (req, res) => {
  let { target_user_id, outlet_id } = req.query;
  const loggedInUserId = req.user.id;
  const bizId = req.user.bizId || loggedInUserId;
  
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  
  try {
    // If target_user_id is provided, we are in an impersonation context (Brand Owner viewing an Outlet)
    const contextUserId = target_user_id || loggedInUserId;
    
    let query = "SELECT * FROM outlet_designations WHERE (user_id = $1 OR user_id = $2)";
    const params = [contextUserId, bizId];

    if (outlet_id && outlet_id !== "global" && outlet_id !== 'null' && outlet_id !== 'undefined') {
      query += " AND (outlet_id = $3 OR outlet_id IS NULL)";
      params.push(outlet_id);
    } else {
      query += " AND outlet_id IS NULL";
    }

    query += " ORDER BY name ASC";
    const result = await pool.query(query, params);
    
    // Auto-seed standard designations if missing
    const standardDesignations = [
      'Joker',
      'Delivery Boy',
      'Waiter',
      'Kitchen Display',
      'captain',
      'Manager',
      'Billing User'
    ];
    
    const ownerId = target_user_id || req.user.bizId || req.user.id;
    const existingNames = result.rows.map(r => r.name.toLowerCase());
    const missing = standardDesignations.filter(d => !existingNames.includes(d.toLowerCase()));
    
    if (missing.length > 0) {
      const finalOutletId = (outlet_id && outlet_id !== "global" && outlet_id !== 'null' && outlet_id !== 'undefined') ? outlet_id : null;
      for (const name of missing) {
        try {
          await pool.query(
            "INSERT INTO outlet_designations (user_id, name, is_active, outlet_id) VALUES ($1, $2, true, $3) ON CONFLICT DO NOTHING",
            [ownerId, name, finalOutletId]
          );
        } catch (e) {
          console.error("Failed to seed designation:", name, e.message);
        }
      }
      const reFetch = await pool.query(query, params);
      return res.json(reFetch.rows);
    }
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/designations", authMiddleware, async (req, res) => {
  const { name, is_active, target_user_id, outlet_id } = req.body;
  const ownerId = target_user_id || req.user.bizId || req.user.id;
  try {
    // 🛡️ Collision Detection: Prevent duplicate designation identities in the same scope
    const existing = await pool.query(
      "SELECT id FROM outlet_designations WHERE user_id = $1 AND UPPER(name) = UPPER($2) AND (outlet_id = $3 OR (outlet_id IS NULL AND $3 IS NULL))",
      [ownerId, name, outlet_id || null]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        error: `CONFLICT: The designation '${name.toUpperCase()}' is already registered in this registry. Please use a unique identity.` 
      });
    }

    const result = await pool.query(
      "INSERT INTO outlet_designations (user_id, name, is_active, outlet_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [ownerId, name, is_active !== undefined ? !!is_active : true, outlet_id || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/designations/:id", authMiddleware, async (req, res) => {
  const { name, is_active } = req.body;
  const loggedInUserId = req.user.id;
  const bizId = req.user.bizId || loggedInUserId;

  try {
    // 1. Fetch to check ownership
    const desRes = await pool.query("SELECT * FROM outlet_designations WHERE id = $1", [req.params.id]);
    if (desRes.rows.length === 0) return res.status(404).json({ error: "Designation not found" });
    const designation = desRes.rows[0];

    // 2. Permission Check
    const ownerCheck = await pool.query("SELECT owner_id FROM app_users WHERE id = $1", [designation.user_id]);
    const isBrandOwner = ownerCheck.rows.length > 0 && ownerCheck.rows[0].owner_id === loggedInUserId;

    if (designation.user_id !== loggedInUserId && designation.user_id !== bizId && !isBrandOwner) {
      return res.status(403).json({ error: "Access denied" });
    }

    const result = await pool.query(
      "UPDATE outlet_designations SET name=COALESCE($1, name), is_active=$2 WHERE id=$3 RETURNING *",
      [name, is_active !== undefined ? !!is_active : true, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/designations/:id", authMiddleware, async (req, res) => {
  const loggedInUserId = req.user.id;
  const bizId = req.user.bizId || loggedInUserId;
  
  try {
    // 1. Fetch the designation to check ownership
    const desRes = await pool.query("SELECT * FROM outlet_designations WHERE id = $1", [req.params.id]);
    if (desRes.rows.length === 0) return res.status(404).json({ error: "Designation not found" });
    const designation = desRes.rows[0];

    // 2. Permission Check: Must be the creator OR the brand owner
    // We also check if the designation's user_id has the logged-in user as its owner
    const ownerCheck = await pool.query("SELECT owner_id FROM app_users WHERE id = $1", [designation.user_id]);
    const isBrandOwner = ownerCheck.rows.length > 0 && ownerCheck.rows[0].owner_id === loggedInUserId;

    if (designation.user_id !== loggedInUserId && designation.user_id !== bizId && !isBrandOwner) {
      return res.status(403).json({ error: "Access denied: You do not have permission to terminate this role registry entry." });
    }

    // 3. Check for dependencies (users assigned to this designation)
    const userCheck = await pool.query("SELECT id FROM app_users WHERE designation_id = $1 LIMIT 1", [req.params.id]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: "CRITICAL: Cannot terminate designation. Active users are currently registered under this identity. Please reassign them first." 
      });
    }

    // 4. Perform deletion
    await pool.query("DELETE FROM outlet_designations WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Designation Deletion Error:", err);
    res.status(500).json({ error: err.message });
  }
});



// ============================================
// 👥 OUTLET USER MANAGEMENT
// ============================================

router.get("/users", authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.query.target_user_id;
    let result;
    
    if (targetUserId) {
      // Impersonated view or specific outlet
      result = await pool.query(`
        SELECT u.*, d.name as designation_name, 
               COALESCE(r.name, p.business_name, p.name) as outlet_name
        FROM app_users u
        LEFT JOIN outlet_designations d ON u.designation_id = d.id
        LEFT JOIN app_users p ON u.parent_user_id = p.id
        LEFT JOIN restaurants r ON r.user_id = u.parent_user_id
        WHERE u.parent_user_id = $1 
        ORDER BY u.name ASC`, [targetUserId]);
    } else {
      // Global view (no target_user_id passed)
      if (req.user.role === 'brand_owner') {
        // Brand owner sees all staff of all their outlets
        result = await pool.query(`
          SELECT u.*, d.name as designation_name, 
                 COALESCE(r.name, p.business_name, p.name) as outlet_name
          FROM app_users u
          LEFT JOIN outlet_designations d ON u.designation_id = d.id
          LEFT JOIN app_users p ON u.parent_user_id = p.id
          LEFT JOIN restaurants r ON r.user_id = u.parent_user_id
          WHERE u.parent_user_id = $1 
             OR u.parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $1)
          ORDER BY u.name ASC`, [req.user.id]);
      } else {
        // Regular outlet user sees their own staff
        result = await pool.query(`
          SELECT u.*, d.name as designation_name, 
                 COALESCE(r.name, p.business_name, p.name) as outlet_name
          FROM app_users u
          LEFT JOIN outlet_designations d ON u.designation_id = d.id
          LEFT JOIN app_users p ON u.parent_user_id = p.id
          LEFT JOIN restaurants r ON r.user_id = u.parent_user_id
          WHERE u.parent_user_id = $1 
          ORDER BY u.name ASC`, [req.user.bizId]);
      }
    }
    res.json(result.rows);
  } catch (err) {
    console.error("GET /users error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/users", authMiddleware, async (req, res) => {
  const { 
    username, password, name, phone, email, designation_id, 
    user_type, access_code, mac_address, shift_time, language_preference, 
    sub_locality, city, address, web_access, role, target_user_id, verify_mac_ip
  } = req.body;
  
  const parentId = target_user_id || req.user.id;

  try {
    const finalEmail = (email && email.trim().length > 0) ? email.trim() : null;
    const finalPhone = (phone && phone.trim().length > 0) ? phone.trim() : null;
    const finalDesignationId = (designation_id && designation_id !== "") ? parseInt(designation_id) : null;

    // 🛡️ Collision Detection (Prevent 500 errors)
    const queryParts = ["username = $1"];
    const params = [username];
    
    let paramIndex = 2;
    if (finalEmail) {
      queryParts.push(`email = $${paramIndex}`);
      params.push(finalEmail);
      paramIndex++;
    }
    if (finalPhone) {
      queryParts.push(`phone = $${paramIndex}`);
      params.push(finalPhone);
      paramIndex++;
    }
    
    const collisionQuery = `SELECT id, username, email, phone FROM app_users WHERE ${queryParts.join(" OR ")}`;
    const existing = await pool.query(collisionQuery, params);

    if (existing.rows.length > 0) {
      const match = existing.rows[0];
      let conflict = "Identity record";
      if (match.username === username) conflict = "Username";
      else if (finalEmail && match.email === finalEmail) conflict = "Email";
      else if (finalPhone && match.phone === finalPhone) conflict = "Phone number";
      
      return res.status(400).json({ error: `${conflict} already in use.` });
    }

    const hashedPassword = await bcrypt.hash(password || 'user123', 10);
    const result = await pool.query(
      `INSERT INTO app_users 
       (username, password, name, phone, email, role, parent_user_id, status, 
        designation_id, user_type, access_code, mac_address, shift_time, 
        language_preference, sub_locality, address, web_access, city, verify_mac_ip) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [
        username, hashedPassword, name, finalPhone, finalEmail, role || 'staff', parentId, finalDesignationId, 
        user_type || null, access_code || null, mac_address || null, shift_time || null, 
        language_preference || 'en', sub_locality || null, address || null, 
        web_access || false, city || null, !!verify_mac_ip
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("User Creation Error:", err.message);
    res.status(500).json({ error: "Failed to provision identity. Please check system logs." });
  }
});

router.put("/users/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { username, name, phone, email, designation_id, user_type, web_access, password, status, access_code, mac_address, shift_time, language_preference, sub_locality, address, city, verify_mac_ip } = req.body;
    try {
        const finalEmail = (email && email.trim().length > 0) ? email.trim() : null;
        const finalPhone = (phone && phone.trim().length > 0) ? phone.trim() : null;
        const finalDesignationId = (designation_id && designation_id !== "") ? parseInt(designation_id) : null;

        // 🛡️ Collision Detection (excluding current user)
        const queryParts = ["username = $1"];
        const params = [username, id];
        
        let paramIndex = 3;
        if (finalEmail) {
          queryParts.push(`email = $${paramIndex}`);
          params.push(finalEmail);
          paramIndex++;
        }
        if (finalPhone) {
          queryParts.push(`phone = $${paramIndex}`);
          params.push(finalPhone);
          paramIndex++;
        }
        
        const collisionQuery = `SELECT id, username, email, phone FROM app_users WHERE (${queryParts.join(" OR ")}) AND id != $2`;
        const existing = await pool.query(collisionQuery, params);

        if (existing.rows.length > 0) {
          const match = existing.rows[0];
          let conflict = "Identity record";
          if (match.username === username) conflict = "Username";
          else if (finalEmail && match.email === finalEmail) conflict = "Email";
          else if (finalPhone && match.phone === finalPhone) conflict = "Phone number";
          
          return res.status(400).json({ error: `${conflict} already in use.` });
        }

        let result;
        if (password && password.trim().length > 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            result = await pool.query(
                `UPDATE app_users 
                 SET username=$1, name=$2, phone=$3, email=$4, designation_id=$5, user_type=$6, web_access=$7, password=$8, status=$9,
                     access_code=$10, mac_address=$11, shift_time=$12, language_preference=$13, sub_locality=$14, address=$15,
                     city=$16, verify_mac_ip=$17
                 WHERE id=$18 RETURNING *`,
                [username, name, finalPhone, finalEmail, finalDesignationId, user_type, !!web_access, hashedPassword, status || 'active', access_code || null, mac_address || null, shift_time || null, language_preference || 'en', sub_locality || null, address || null, city || null, !!verify_mac_ip, id]
            );
        } else {
            result = await pool.query(
                `UPDATE app_users 
                 SET username=$1, name=$2, phone=$3, email=$4, designation_id=$5, user_type=$6, web_access=$7, status=$8,
                     access_code=$9, mac_address=$10, shift_time=$11, language_preference=$12, sub_locality=$13, address=$14,
                     city=$15, verify_mac_ip=$16
                 WHERE id=$17 RETURNING *`,
                [username, name, finalPhone, finalEmail, finalDesignationId, user_type, !!web_access, status || 'active', access_code || null, mac_address || null, shift_time || null, language_preference || 'en', sub_locality || null, address || null, city || null, !!verify_mac_ip, id]
            );
        }
        
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error("User Update Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.delete("/users/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        // 1. Unlink from historical records (set to NULL to preserve financial data integrity)
        await client.query("UPDATE orders SET user_id = NULL WHERE user_id = $1", [id]);
        
        // 2. Perform the deletion (Audit logs are now handled via DB Cascade)
        const result = await client.query("DELETE FROM app_users WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Identity not found." });
        }
        
        await client.query("COMMIT");
        res.json({ success: true, message: "Identity successfully purged from the cluster." });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("User Deletion Error:", err.message);
        res.status(400).json({ error: "This identity is a primary anchor for an active business unit (like a Restaurant Owner) and cannot be deleted. Please transfer ownership or deactivate the account instead." });
    } finally {
        client.release();
    }
});

// ============================================
// 💳 PAYMENT MODE MANAGEMENT
// ============================================

router.get("/payment-modes/:outlet_id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM outlet_payment_modes WHERE user_id = $1 AND is_active = true", [req.params.outlet_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/payment-modes/sync", authMiddleware, async (req, res) => {
  const { outlet_id, payment_modes } = req.body; // payment_modes is array of strings
  try {
    await pool.query("DELETE FROM outlet_payment_modes WHERE user_id = $1", [outlet_id]);
    for (const mode of payment_modes) {
      await pool.query("INSERT INTO outlet_payment_modes (user_id, method_name) VALUES ($1, $2)", [outlet_id, mode]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📦 ORDER TYPE MANAGEMENT
// ============================================

router.get("/order-types/:outlet_id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM outlet_order_types WHERE outlet_id = $1", [req.params.outlet_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/order-types/sync", authMiddleware, async (req, res) => {
  const { outlet_id, order_types } = req.body;
  try {
    await pool.query("DELETE FROM outlet_order_types WHERE outlet_id = $1", [outlet_id]);
    for (const type of order_types) {
      await pool.query("INSERT INTO outlet_order_types (outlet_id, order_type) VALUES ($1, $2)", [outlet_id, type]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📊 GL MAPPING & COMMISSION
// ============================================

router.get("/gl-mappings/:outlet_id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM order_type_gl_mappings WHERE outlet_id = $1 ORDER BY order_type ASC", [req.params.outlet_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/gl-mappings", authMiddleware, async (req, res) => {
  const { outlet_id, order_type, gl_code, commission_pct } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO order_type_gl_mappings (outlet_id, order_type, gl_code, commission_pct) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (id) DO UPDATE SET gl_code=$3, commission_pct=$4 
       RETURNING *`,
      [outlet_id, order_type, gl_code, commission_pct || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/gl-mappings/:id", authMiddleware, async (req, res) => {
    const { gl_code, commission_pct, is_active } = req.body;
    try {
      const result = await pool.query(
        "UPDATE order_type_gl_mappings SET gl_code=$1, commission_pct=$2, is_active=$3 WHERE id=$4 RETURNING *",
        [gl_code, commission_pct, !!is_active, req.params.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// ============================================
// 🧾 TAX & MASTER CONFIGURATION
// ============================================

// Tax Groups
router.get("/tax-groups", authMiddleware, async (req, res) => {
  let rawOutletId = req.query.outlet_id || req.query.target_user_id;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!rawOutletId || rawOutletId === 'null' || rawOutletId === 'undefined' || rawOutletId === 'global') && req.user.role === "user") {
    rawOutletId = req.user.id;
  }
  
  // Normalize outletId
  let outletId = null;
  if (rawOutletId && rawOutletId !== "global" && rawOutletId !== "null" && rawOutletId !== "undefined") {
    outletId = parseInt(rawOutletId);
  }

  try {
    let query = `
      SELECT tg.*, u.business_name as outlet_name 
      FROM tax_product_groups tg
      LEFT JOIN app_users u ON tg.outlet_id = u.id
      WHERE tg.user_id = $1
    `;
    const params = [ownerId];
    
    if (outletId) {
      query += " AND (tg.outlet_id = $2 OR tg.outlet_id IS NULL)";
      params.push(outletId);
    } else {
      query += " AND tg.outlet_id IS NULL";
    }
    
    query += " ORDER BY tg.group_name ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { 
    console.error(`[GET /tax-groups] Error:`, err);
    res.status(500).json({ error: err.message }); 
  }
});

router.post("/tax-groups", authMiddleware, async (req, res) => {
  let { group_name, description, is_active, outlet_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  try {
    const result = await pool.query(
      "INSERT INTO tax_product_groups (user_id, group_name, description, is_active, outlet_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [ownerId, group_name, description, is_active !== undefined ? !!is_active : true, outlet_id || null]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/tax-groups/:id", authMiddleware, async (req, res) => {
  let { group_name, description, is_active, outlet_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  try {
    const result = await pool.query(
      "UPDATE tax_product_groups SET group_name=$1, description=$2, is_active=$3, outlet_id=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
      [group_name, description, !!is_active, outlet_id || null, req.params.id, ownerId]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/tax-groups/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  try {
    await pool.query("DELETE FROM tax_product_groups WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Tax Configurations (Individual Taxes like CGST, SGST)
router.get("/taxes", authMiddleware, async (req, res) => {
  const rawOutletId = req.query.outlet_id || req.query.target_user_id;
  const ownerId = req.user.bizId || req.user.id;
  
  let outletId = null;
  if (rawOutletId && rawOutletId !== "global" && rawOutletId !== "null" && rawOutletId !== "undefined") {
    outletId = parseInt(rawOutletId);
  }

  try {
    let query = `
      SELECT tc.*, tg.group_name 
      FROM tax_configurations tc
      LEFT JOIN tax_product_groups tg ON tc.tax_product_group_id = tg.id
    `;
    const params = [];
    
    if (outletId) {
      query += " WHERE (tc.outlet_id = $1 OR (tc.outlet_id IS NULL AND tc.user_id = $1))";
      params.push(outletId);
    } else {
      query += " WHERE (tc.user_id = $1 OR tc.outlet_id = $1)";
      params.push(ownerId);
    }
    
    query += " ORDER BY tc.tax_name ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { 
    console.error(`[GET /taxes] Error:`, err);
    res.status(500).json({ error: err.message }); 
  }
});

router.post("/taxes", authMiddleware, async (req, res) => {
  const { 
    tax_name, display_name, tax_value, tax_product_group_id, 
    is_inclusive, is_dividable, hide_on_bill, is_active, outlet_id, target_user_id 
  } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  console.log("[POST /taxes] Received body:", req.body);
  const effectiveOutletId = outlet_id || target_user_id;
  try {
    const result = await pool.query(
      `INSERT INTO tax_configurations 
       (user_id, tax_name, display_name, tax_value, tax_product_group_id, is_inclusive, is_dividable, hide_on_bill, is_active, outlet_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        ownerId, tax_name, display_name, tax_value, tax_product_group_id || null, 
        !!is_inclusive, !!is_dividable, !!hide_on_bill, is_active !== undefined ? !!is_active : true, effectiveOutletId || null
      ]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    console.error(`[POST /taxes] Error:`, err);
    res.status(500).json({ error: err.message }); 
  }
});

router.put("/taxes/:id", authMiddleware, async (req, res) => {
  const { 
    tax_name, display_name, tax_value, tax_product_group_id, 
    is_inclusive, is_dividable, hide_on_bill, is_active, outlet_id, target_user_id 
  } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  const effectiveOutletId = outlet_id || target_user_id;
  try {
    const result = await pool.query(
      `UPDATE tax_configurations 
       SET tax_name=$1, display_name=$2, tax_value=$3, tax_product_group_id=$4, 
           is_inclusive=$5, is_dividable=$6, hide_on_bill=$7, is_active=$8, outlet_id=$9 
       WHERE id=$10 AND (user_id=$11 OR outlet_id=$11) RETURNING *`,
      [
        tax_name, display_name, tax_value, tax_product_group_id || null, 
        !!is_inclusive, !!is_dividable, !!hide_on_bill, !!is_active, effectiveOutletId || null, 
        req.params.id, ownerId
      ]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    console.error(`[PUT /taxes/:id] Error:`, err);
    res.status(500).json({ error: err.message }); 
  }
});

router.delete("/taxes/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  try {
    await pool.query("DELETE FROM tax_configurations WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
    res.json({ success: true });
  } catch (err) { 
    console.error(`[DELETE /taxes/:id] Error:`, err);
    res.status(500).json({ error: err.message }); 
  }
});

// Kitchen Departments
router.get("/kitchen-departments", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  try {
    let query = `
      SELECT k.*, COALESCE(k.name, k.department_name) as name, u.business_name as outlet_name 
      FROM kitchen_departments k
      LEFT JOIN app_users u ON k.outlet_id = u.id
      WHERE k.user_id = $1
    `;
    const params = [ownerId];
    if (outlet_id && outlet_id !== "global" && outlet_id !== 'null' && outlet_id !== 'undefined') {
      query += " AND (k.outlet_id = $2 OR k.outlet_id IS NULL)";
      params.push(outlet_id);
    } else {
      query += " AND k.outlet_id IS NULL";
    }
    query += " ORDER BY COALESCE(k.name, k.department_name) ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/kitchen-departments", authMiddleware, async (req, res) => {
  let { name, is_active, outlet_id, target_user_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  let effectiveOutletId = outlet_id || target_user_id;
  if ((!effectiveOutletId || effectiveOutletId === 'null' || effectiveOutletId === 'undefined' || effectiveOutletId === 'global') && req.user.role === "user") {
    effectiveOutletId = req.user.id;
  }
  console.log("[POST /kitchen-departments] Received body:", req.body);
  try {
    const result = await pool.query(
      "INSERT INTO kitchen_departments (user_id, name, department_name, is_active, outlet_id) VALUES ($1, $2, $2, $3, $4) RETURNING *",
      [ownerId, name, is_active !== undefined ? !!is_active : true, effectiveOutletId || null]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/kitchen-departments/:id", authMiddleware, async (req, res) => {
    let { name, is_active, outlet_id, target_user_id } = req.body;
    const ownerId = req.user.bizId || req.user.id;
    let effectiveOutletId = outlet_id || target_user_id;
    if ((!effectiveOutletId || effectiveOutletId === 'null' || effectiveOutletId === 'undefined' || effectiveOutletId === 'global') && req.user.role === "user") {
      effectiveOutletId = req.user.id;
    }
    try {
      const result = await pool.query(
        "UPDATE kitchen_departments SET name=$1, department_name=$1, is_active=$2, outlet_id=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
        [name, !!is_active, effectiveOutletId || null, req.params.id, ownerId]
      );
      res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/kitchen-departments/:id", authMiddleware, async (req, res) => {
    const ownerId = req.user.bizId || req.user.id;
    try {
      await pool.query("DELETE FROM kitchen_departments WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Table Departments
router.get("/table-departments", authMiddleware, async (req, res) => {
  let { target_user_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!target_user_id || target_user_id === 'null' || target_user_id === 'undefined' || target_user_id === 'global') && req.user.role === "user") {
    target_user_id = req.user.id;
  }
  
  let outletId = null;
  if (target_user_id && target_user_id !== "global" && target_user_id !== "null" && target_user_id !== "undefined") {
    outletId = parseInt(target_user_id);
  }

  try {
    let query = `
      SELECT t.*, g.group_name as tax_group_name, u.business_name as outlet_name 
      FROM table_departments t
      LEFT JOIN tax_product_groups g ON t.tax_product_group_id = g.id
      LEFT JOIN app_users u ON t.outlet_id = u.id
      WHERE t.user_id = $1
    `;
    const params = [ownerId];
    if (outletId) {
      query += " AND (t.outlet_id = $2 OR t.outlet_id IS NULL)";
      params.push(outletId);
    } else {
      query += " AND t.outlet_id IS NULL";
    }
    query += " ORDER BY t.department_name ASC";
    const result = await pool.query(query, params);
    console.log("[GET /table-departments] Returning:", result.rows);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/table-departments", authMiddleware, async (req, res) => {
  let { department_name, tax_product_group_id, is_active, target_user_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!target_user_id || target_user_id === 'null' || target_user_id === 'undefined' || target_user_id === 'global') && req.user.role === "user") {
    target_user_id = req.user.id;
  }
  try {
    const result = await pool.query(
      "INSERT INTO table_departments (user_id, department_name, tax_product_group_id, is_active, outlet_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [ownerId, department_name, tax_product_group_id || null, is_active !== undefined ? !!is_active : true, target_user_id && target_user_id !== "global" && target_user_id !== "null" && target_user_id !== "undefined" ? target_user_id : null]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/table-departments/:id", authMiddleware, async (req, res) => {
  let { department_name, tax_product_group_id, is_active, target_user_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!target_user_id || target_user_id === 'null' || target_user_id === 'undefined' || target_user_id === 'global') && req.user.role === "user") {
    target_user_id = req.user.id;
  }
  try {
    const result = await pool.query(
      "UPDATE table_departments SET department_name=$1, tax_product_group_id=$2, is_active=$3, outlet_id=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
      [department_name, tax_product_group_id || null, !!is_active, target_user_id && target_user_id !== "global" && target_user_id !== "null" && target_user_id !== "undefined" ? target_user_id : null, req.params.id, ownerId]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/table-departments/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  try {
    await pool.query("DELETE FROM table_departments WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Tables
router.get("/tables", authMiddleware, async (req, res) => {
  let { target_user_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!target_user_id || target_user_id === 'null' || target_user_id === 'undefined' || target_user_id === 'global') && req.user.role === "user") {
    target_user_id = req.user.id;
  }
  
  let outletId = null;
  if (target_user_id && target_user_id !== "global" && target_user_id !== "null" && target_user_id !== "undefined") {
    outletId = parseInt(target_user_id);
  }

  try {
    let query = `
      SELECT t.*, d.department_name, u.business_name as outlet_name 
      FROM tables_list t
      LEFT JOIN table_departments d ON t.department_id = d.id
      LEFT JOIN app_users u ON t.outlet_id = u.id
      WHERE t.user_id = $1
    `;
    const params = [ownerId];
    if (outletId) {
      query += " AND (t.outlet_id = $2 OR t.outlet_id IS NULL)";
      params.push(outletId);
    } else {
      query += " AND t.outlet_id IS NULL";
    }
    query += " ORDER BY substring(t.name from '^[a-zA-Z\\s]*') ASC, COALESCE(substring(t.name from '[0-9]+')::integer, 0) ASC, t.name ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/tables", authMiddleware, async (req, res) => {
  let { name, department_id, max_persons, is_active, target_user_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!target_user_id || target_user_id === 'null' || target_user_id === 'undefined' || target_user_id === 'global') && req.user.role === "user") {
    target_user_id = req.user.id;
  }
  try {
    const result = await pool.query(
      "INSERT INTO tables_list (user_id, name, department_id, max_persons, is_active, outlet_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [ownerId, name, department_id || null, max_persons || 4, is_active !== undefined ? !!is_active : true, target_user_id && target_user_id !== "global" ? parseInt(target_user_id) : null]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/tables/:id", authMiddleware, async (req, res) => {
  let { name, department_id, max_persons, is_active, target_user_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!target_user_id || target_user_id === 'null' || target_user_id === 'undefined' || target_user_id === 'global') && req.user.role === "user") {
    target_user_id = req.user.id;
  }
  try {
    const result = await pool.query(
      "UPDATE tables_list SET name=$1, department_id=$2, max_persons=$3, is_active=$4, outlet_id=$5 WHERE id=$6 AND user_id=$7 RETURNING *",
      [name, department_id || null, max_persons || 4, !!is_active, target_user_id && target_user_id !== "global" ? parseInt(target_user_id) : null, req.params.id, ownerId]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/tables/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  try {
    await pool.query("DELETE FROM tables_list WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/tables/bulk-upload", authMiddleware, async (req, res) => {
  if (!req.files || !req.files.file) return res.status(400).json({ error: "No file uploaded" });
  
  const { target_user_id, department_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  const file = req.files.file;
  const targetOutletId = (target_user_id && target_user_id !== 'global') ? parseInt(target_user_id) : null;
  const defaultDeptId = department_id ? parseInt(department_id) : null;

  try {
    const workbook = XLSX.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let count = 0;
    for (const row of data) {
      const tableName = row['Table Name'] || row['Name'] || row['Table'];
      if (!tableName) continue;

      // Resolve Department
      let deptId = defaultDeptId;
      const deptName = row['Department'] || row['Area'] || row['Section'];
      if (deptName && !deptId) {
        let deptRes = await pool.query(
          "SELECT id FROM table_departments WHERE department_name ILIKE $1 AND user_id = $2 AND (outlet_id = $3 OR outlet_id IS NULL)",
          [deptName.toString().trim(), ownerId, targetOutletId]
        );
        if (deptRes.rows.length > 0) {
          deptId = deptRes.rows[0].id;
        } else {
          let ins = await pool.query(
            "INSERT INTO table_departments (user_id, department_name, outlet_id, is_active) VALUES ($1, $2, $3, true) RETURNING id",
            [ownerId, deptName.toString().trim(), targetOutletId]
          );
          deptId = ins.rows[0].id;
        }
      }

      const maxPersons = row['Capacity'] || row['Max Persons'] || row['Persons'] || 4;
      const isActive = row['Is Active'] !== undefined ? (row['Is Active'] === 'true' || row['Is Active'] === true || row['Is Active'] === 1) : true;

      await pool.query(
        "INSERT INTO tables_list (user_id, name, department_id, max_persons, is_active, outlet_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [ownerId, tableName.toString().trim(), deptId, parseInt(maxPersons), isActive, targetOutletId]
      );
      count++;
    }

    res.json({ success: true, count });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Categories
router.get("/categories", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  try {
    let query = "SELECT * FROM categories WHERE user_id = $1";
    const params = [ownerId];
    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') {
      query += " AND (outlet_id = $2 OR outlet_id IS NULL)";
      params.push(outlet_id);
    } else {
      query += " AND outlet_id IS NULL";
    }
    query += " ORDER BY sorting_order ASC, name ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/categories", authMiddleware, async (req, res) => {
  let { 
    name, alt_name, parent_id, sorting_order, description, 
    alt_description, ondc_category, color_code, image_url, is_active, outlet_id 
  } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  try {
    const result = await pool.query(
      `INSERT INTO categories 
       (user_id, name, alt_name, parent_id, sorting_order, description, alt_description, ondc_category, color_code, image_url, is_active, outlet_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [ownerId, name, alt_name, parent_id, sorting_order || 0, description, alt_description, ondc_category, color_code || '#000000', image_url, !!is_active, outlet_id || null]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/categories/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  try {
    await pool.query("DELETE FROM categories WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/categories/:id", authMiddleware, async (req, res) => {
  const { name, alt_name, parent_id, sorting_order, description, alt_description, ondc_category, color_code, image_url, is_active } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  try {
    const updates = [];
    const params = [];
    let pIdx = 1;

    if (name !== undefined) { updates.push(`name=$${pIdx++}`); params.push(name); }
    if (alt_name !== undefined) { updates.push(`alt_name=$${pIdx++}`); params.push(alt_name); }
    if (parent_id !== undefined) { updates.push(`parent_id=$${pIdx++}`); params.push(parent_id || null); }
    if (sorting_order !== undefined) { updates.push(`sorting_order=$${pIdx++}`); params.push(parseInt(sorting_order) || 0); }
    if (description !== undefined) { updates.push(`description=$${pIdx++}`); params.push(description); }
    if (alt_description !== undefined) { updates.push(`alt_description=$${pIdx++}`); params.push(alt_description); }
    if (ondc_category !== undefined) { updates.push(`ondc_category=$${pIdx++}`); params.push(ondc_category); }
    if (color_code !== undefined) { updates.push(`color_code=$${pIdx++}`); params.push(color_code); }
    if (image_url !== undefined) { updates.push(`image_url=$${pIdx++}`); params.push(image_url); }
    if (is_active !== undefined) { updates.push(`is_active=$${pIdx++}`); params.push(!!is_active); }

    if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

    const idIdx = pIdx++;
    params.push(req.params.id);
    const ownerIdx = pIdx++;
    params.push(ownerId);

    const query = `UPDATE categories SET ${updates.join(', ')} WHERE id=$${idIdx} AND user_id=$${ownerIdx} RETURNING *`;
    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found or unauthorized" });
    }
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// 🍱 OUTLET MENU MANAGEMENT
// ============================================

router.get("/outlet-menus", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  
  const parsedOutletId = (outlet_id && outlet_id !== "global" && outlet_id !== "null" && outlet_id !== "undefined") ? parseInt(outlet_id) : null;
  
  try {
    console.log(`[GET /outlet-menus] User: ${req.user.id}, Biz: ${req.user.bizId}, Target Outlet: ${parsedOutletId}`);
    let query = `
      SELECT om.*, COALESCE(u.business_name, u.name, 'Global Catalog') as outlet_name
      FROM outlet_menus om
      LEFT JOIN app_users u ON om.outlet_id = u.id
      WHERE om.user_id = $1
    `;
    const params = [ownerId];
    if (parsedOutletId) {
      query += " AND (om.outlet_id = $2 OR om.outlet_id IS NULL)";
      params.push(parsedOutletId);
    }
    query += " ORDER BY om.menu_name ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { 
    console.error("[GET /outlet-menus] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});

router.post("/outlet-menus", authMiddleware, async (req, res) => {
  let { 
    outlet_id, menu_name, short_name, is_pos_default, 
    is_digital_default, is_digital, use_for_mobile, is_ondc 
  } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  
  const parsedOutletId = (outlet_id && outlet_id !== "global" && outlet_id !== "null" && outlet_id !== "undefined") ? parseInt(outlet_id) : null;
  
  try {
    console.log(`[POST /outlet-menus] Creating menu: ${menu_name} for Outlet: ${parsedOutletId} (Owner: ${ownerId})`);
    const result = await pool.query(
      `INSERT INTO outlet_menus 
       (user_id, outlet_id, menu_name, short_name, is_pos_default, is_digital_default, is_digital, use_for_mobile, is_ondc) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [ownerId, parsedOutletId, menu_name, short_name, !!is_pos_default, !!is_digital_default, !!is_digital, !!use_for_mobile, !!is_ondc]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    console.error("[POST /outlet-menus] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});

router.put("/outlet-menus/:id", authMiddleware, async (req, res) => {
  let { 
    outlet_id, menu_name, short_name, is_pos_default, 
    is_digital_default, is_digital, use_for_mobile, is_ondc 
  } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  
  const parsedOutletId = (outlet_id && outlet_id !== "global" && outlet_id !== "null" && outlet_id !== "undefined") ? parseInt(outlet_id) : null;
  
  try {
    console.log(`[PUT /outlet-menus] Updating menu: ${req.params.id} for Outlet: ${parsedOutletId} (Owner: ${ownerId})`);
    const result = await pool.query(
      `UPDATE outlet_menus SET 
         menu_name=$1, short_name=$2, is_pos_default=$3, is_digital_default=$4, 
         is_digital=$5, use_for_mobile=$6, is_ondc=$7, outlet_id=$8 
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [menu_name, short_name, !!is_pos_default, !!is_digital_default, !!is_digital, !!use_for_mobile, !!is_ondc, parsedOutletId, req.params.id, ownerId]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    console.error("[PUT /outlet-menus] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});

router.delete("/outlet-menus/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  try {
    console.log(`[DELETE /outlet-menus] ID: ${req.params.id} (Owner: ${ownerId})`);
    await pool.query("DELETE FROM outlet_menus WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
    res.json({ success: true });
  } catch (err) { 
    console.error("[DELETE /outlet-menus] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});

// Menu Items
router.get("/outlet-menus/:id/items", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM outlet_menu_items WHERE menu_id = $1 ORDER BY id ASC", [req.params.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/outlet-menus/:id/items", authMiddleware, async (req, res) => {
    const ownerId = req.user.bizId || req.user.id;
    try {
      // Security check: ensure the menu belongs to the user
      const menuCheck = await pool.query("SELECT id FROM outlet_menus WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
      if (menuCheck.rows.length === 0) return res.status(403).json({ error: "Access denied" });

      await pool.query("DELETE FROM outlet_menu_items WHERE menu_id = $1", [req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/outlet-menu-items/bulk-update", authMiddleware, async (req, res) => {
  const { items } = req.body;
  try {
    const ownerId = req.user.bizId || req.user.id;
    for (const item of items) {
      const categoryId = (item.category_id && !isNaN(parseInt(item.category_id))) ? parseInt(item.category_id) : null;
      const taxGroupId = (item.tax_group_id && !isNaN(parseInt(item.tax_group_id))) ? parseInt(item.tax_group_id) : null;
      const kitchenDeptId = (item.kitchen_dept_id && !isNaN(parseInt(item.kitchen_dept_id))) ? parseInt(item.kitchen_dept_id) : null;
      const salePrice2 = (item.sale_price_2 !== undefined && item.sale_price_2 !== '' && item.sale_price_2 !== null) ? parseFloat(item.sale_price_2) : null;
      const salePrice3 = (item.sale_price_3 !== undefined && item.sale_price_3 !== '' && item.sale_price_3 !== null) ? parseFloat(item.sale_price_3) : null;

      const itemType = item.item_type !== undefined ? item.item_type : '0';

      await pool.query(
        `UPDATE outlet_menu_items SET 
         item_name=$1, short_code=$2, base_price=$3, 
         category_id=$4, tax_group_id=$5, kitchen_dept_id=$6,
         description=$7, is_active=$8, food_type=$10,
         sale_price_2=$11, sale_price_3=$12, item_type=$13
         WHERE id=$9`,
        [
          item.item_name || item.item_title, item.short_code || item.item_short_code, item.base_price || item.price, 
          categoryId, taxGroupId, kitchenDeptId,
          item.description, !!item.is_active, item.id, item.food_type,
          salePrice2, salePrice3, itemType
        ]
      );
      await syncOutletItemToBusinessCatalog(item.id, ownerId);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/outlet-menu-items", authMiddleware, async (req, res) => {
  const { 
    menu_id, short_code, item_name, price, category_id, department_id, 
    tax_group_id, food_type, description, current_stock, item_type,
    hsn_code, recommended, availability, sale_price_2, sale_price_3
  } = req.body;
  try {
    let resolvedMenuId = menu_id;
    if (!resolvedMenuId) {
      const menuRes = await pool.query(
        "SELECT id FROM outlet_menus WHERE outlet_id = $1 AND is_pos_default = true LIMIT 1",
        [String(req.user.bizId || req.user.id)]
      );
      if (menuRes.rows.length > 0) {
        resolvedMenuId = menuRes.rows[0].id;
      } else {
        const fallbackRes = await pool.query(
          "SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $2 LIMIT 1",
          [String(req.user.bizId || req.user.id), req.user.id]
        );
        if (fallbackRes.rows.length > 0) {
          resolvedMenuId = fallbackRes.rows[0].id;
        }
      }
    }

    if (!resolvedMenuId) {
      return res.status(400).json({ error: "Could not resolve an active menu for this outlet. Please create a menu first." });
    }

    const result = await pool.query(
      `INSERT INTO outlet_menu_items 
       (menu_id, short_code, item_name, base_price, category_id, kitchen_dept_id, tax_group_id, food_type, description, stock_qty, is_active, item_type, hsn_code, is_recommended, sale_price_2, sale_price_3) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        resolvedMenuId, 
        short_code, 
        item_name, 
        parseFloat(price) || 0, 
        category_id ? parseInt(category_id) : null, 
        department_id ? parseInt(department_id) : null, 
        tax_group_id ? parseInt(tax_group_id) : null, 
        food_type, 
        description, 
        current_stock !== '' && current_stock !== null && current_stock !== undefined ? parseInt(current_stock) : 0, 
        availability !== undefined ? !!availability : true, 
        item_type || '0',
        hsn_code || null,
        !!recommended,
        sale_price_2 !== undefined && sale_price_2 !== '' ? parseFloat(sale_price_2) : null,
        sale_price_3 !== undefined && sale_price_3 !== '' ? parseFloat(sale_price_3) : null
      ]
    );
    const ownerId = req.user.bizId || req.user.id;
    await syncOutletItemToBusinessCatalog(result.rows[0].id, ownerId);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/outlet-all-items", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;

  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }

  try {
    let query = `
      SELECT omi.id, 
             omi.menu_id,
             omi.item_id,
             omi.short_code as code, 
             omi.item_name as product_name, 
             omi.base_price as price, 
             omi.sale_price_2,
             omi.sale_price_3,
             omi.is_active as availability, 
             omi.item_type,
             omi.image_url,
             omi.category_id,
             omi.tax_group_id,
             omi.kitchen_dept_id,
             omi.stock_qty as current_stock,
             omi.is_recommended as recommended,
             omi.hsn_code,
             c.name as category,
             pc.name as parent_category,
             m.menu_name,
             (
               SELECT o2.item_name 
               FROM options_list ol 
               JOIN option_groups og ON ol.group_id = og.id 
               JOIN item_option_groups iog ON og.id = iog.group_id 
               JOIN outlet_menu_items o2 ON iog.item_id = o2.id 
               WHERE ol.name = omi.item_name AND o2.menu_id = omi.menu_id
               LIMIT 1
             ) as parent_item_name
      FROM outlet_menu_items omi
      JOIN outlet_menus m ON omi.menu_id = m.id
      LEFT JOIN categories c ON omi.category_id = c.id
      LEFT JOIN categories pc ON c.parent_id = pc.id
    `;
    const params = [];
    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') {
      query += " WHERE m.outlet_id = $1";
      params.push(outlet_id);
    } else {
      query += " WHERE m.user_id = $1 AND m.outlet_id IS NULL";
      params.push(ownerId);
    }
    query += " ORDER BY omi.id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/outlet-menu-items/:id", authMiddleware, async (req, res) => {
  const { 
    code, product_name, price, availability, image_url, current_stock, 
    category_id, food_type, description, item_type, recommended,
    hsn_code, department_id, tax_group_id, sale_price_2, sale_price_3
  } = req.body;
  try {
    const updates = [];
    const params = [];
    let pIdx = 1;

    if (code !== undefined) { updates.push(`short_code=$${pIdx++}`); params.push(code); }
    if (product_name !== undefined) { updates.push(`item_name=$${pIdx++}`); params.push(product_name); }
    if (price !== undefined) { updates.push(`base_price=$${pIdx++}`); params.push(parseFloat(price) || 0); }
    if (availability !== undefined) { updates.push(`is_active=$${pIdx++}`); params.push(!!availability); }
    if (image_url !== undefined) { updates.push(`image_url=$${pIdx++}`); params.push(image_url); }
    if (current_stock !== undefined) { updates.push(`stock_qty=$${pIdx++}`); params.push(current_stock !== '' && current_stock !== null ? parseInt(current_stock) : null); }
    if (category_id !== undefined) { updates.push(`category_id=$${pIdx++}`); params.push(category_id || null); }
    if (food_type !== undefined) { updates.push(`food_type=$${pIdx++}`); params.push(food_type); }
    if (description !== undefined) { updates.push(`description=$${pIdx++}`); params.push(description); }
    if (item_type !== undefined) { updates.push(`item_type=$${pIdx++}`); params.push(item_type); }
    if (recommended !== undefined) { updates.push(`is_recommended=$${pIdx++}`); params.push(!!recommended); }
    if (hsn_code !== undefined) { updates.push(`hsn_code=$${pIdx++}`); params.push(hsn_code); }
    if (department_id !== undefined) { updates.push(`kitchen_dept_id=$${pIdx++}`); params.push(department_id || null); }
    if (tax_group_id !== undefined) { updates.push(`tax_group_id=$${pIdx++}`); params.push(tax_group_id || null); }
    if (sale_price_2 !== undefined) { updates.push(`sale_price_2=$${pIdx++}`); params.push(sale_price_2 !== '' && sale_price_2 !== null ? parseFloat(sale_price_2) : null); }
    if (sale_price_3 !== undefined) { updates.push(`sale_price_3=$${pIdx++}`); params.push(sale_price_3 !== '' && sale_price_3 !== null ? parseFloat(sale_price_3) : null); }

    if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

    params.push(req.params.id);
    const query = `UPDATE outlet_menu_items SET ${updates.join(', ')} WHERE id=$${pIdx} RETURNING *`;
    
    const result = await pool.query(query, params);
    if (result.rows.length > 0) {
      const ownerId = req.user.bizId || req.user.id;
      await syncOutletItemToBusinessCatalog(result.rows[0].id, ownerId);
    }
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/outlet-menu-items/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM outlet_menu_items WHERE id = $1", [req.params.id]);
    res.json({ message: "Item deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// 🏷️ MULTIPLE PRICING
// ============================================

router.get("/multiple-pricing", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.bizId || req.user.id;
    const result = await pool.query(`
      SELECT mp.*, bi.product_name, bi.code, c.name as category_name
      FROM item_multiple_pricing mp
      JOIN business_items bi ON mp.item_id = bi.id
      LEFT JOIN categories c ON bi.category = c.name AND c.user_id = bi.user_id
      WHERE bi.user_id = $1
      ORDER BY bi.product_name ASC, mp.order_type ASC
    `, [ownerId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/multiple-pricing", authMiddleware, async (req, res) => {
  const { item_id, order_type, price } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO item_multiple_pricing (item_id, order_type, price)
      VALUES ($1, $2, $3)
      ON CONFLICT (item_id, order_type) 
      DO UPDATE SET price = EXCLUDED.price
      RETURNING *
    `, [item_id, order_type, parseFloat(price) || 0]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/multiple-pricing/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM item_multiple_pricing WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  // [Note: Duplicate /outlet-menus endpoints removed. Clean implementations are located earlier in the file]

// Bulk Upload (The Intelligent Engine)
router.post("/outlet-menus/bulk-upload", authMiddleware, async (req, res) => {
  if (!req.files || !req.files.menuFile) return res.status(400).json({ error: "No file uploaded" });
  
  const { menu_id, outlet_id } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  const file = req.files.menuFile;
  const targetOutletId = (outlet_id && outlet_id !== 'null') ? outlet_id : null;

  try {
    const workbook = XLSX.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`[Bulk Upload] Total rows detected in file: ${data.length}`);
    let skippedEmpty = 0;

    for (const row of data) {
      const itemTitle = row['Item Name'] || row['Title'] || row['Item'];
      if (!itemTitle) {
        skippedEmpty++;
        continue;
      }

      // 1. Resolve Category
      let catId = null;
      const catName = row['Category'] || row['Group'] || row['Main Category'];
      if (catName) {
        let catRes = await pool.query(
          "SELECT id FROM categories WHERE (name ILIKE $1 OR alt_name ILIKE $1) AND user_id = $2 AND (outlet_id = $3 OR outlet_id IS NULL)",
          [catName.toString().trim(), ownerId, targetOutletId]
        );
        if (catRes.rows.length > 0) {
          catId = catRes.rows[0].id;
        } else {
          let ins = await pool.query(
            "INSERT INTO categories (user_id, name, outlet_id, is_active) VALUES ($1, $2, $3, true) RETURNING id",
            [ownerId, catName.toString().trim(), targetOutletId]
          );
          catId = ins.rows[0].id;
        }
      }

      // 2. Resolve Kitchen Dept
      let deptId = null;
      const deptName = row['Kitchen Dept'] || row['Kitchen Department'] || row['Dept'] || row['KOT Category'];
      if (deptName) {
        let deptRes = await pool.query(
          "SELECT id FROM kitchen_departments WHERE (name ILIKE $1 OR department_name ILIKE $1) AND user_id = $2 AND (outlet_id = $3 OR outlet_id IS NULL)",
          [deptName.toString().trim(), ownerId, targetOutletId]
        );
        if (deptRes.rows.length > 0) {
          deptId = deptRes.rows[0].id;
        } else {
          let ins = await pool.query(
            "INSERT INTO kitchen_departments (user_id, name, department_name, outlet_id, is_active) VALUES ($1, $2, $2, $3, true) RETURNING id",
            [ownerId, deptName.toString().trim(), targetOutletId]
          );
          deptId = ins.rows[0].id;
        }
      }

      // 3. Resolve Tax Group
      let taxGroupId = null;
      const taxName = row['Product Group'] || row['Tax Group'] || row['Tax Product Group'];
      if (taxName) {
        let taxRes = await pool.query(
          "SELECT id FROM tax_product_groups WHERE group_name ILIKE $1 AND user_id = $2 AND (outlet_id = $3 OR outlet_id IS NULL)",
          [taxName.toString().trim(), ownerId, targetOutletId]
        );
        if (taxRes.rows.length > 0) {
          taxGroupId = taxRes.rows[0].id;
        } else {
          let ins = await pool.query(
            "INSERT INTO tax_product_groups (user_id, group_name, outlet_id, is_active) VALUES ($1, $2, $3, true) RETURNING id",
            [ownerId, taxName.toString().trim(), targetOutletId]
          );
          taxGroupId = ins.rows[0].id;
        }
      }

      const price = parseFloat(row['Price'] || row['Rate'] || row['Sale Price'] || 0);
      const shortCode = row['Short Code'] || row['Code'] || '';
      const description = row['Description'] || '';
      const itemType = row['Item Type'] !== undefined ? row['Item Type'].toString() : '0';

      const uploadRes = await pool.query(
        `INSERT INTO outlet_menu_items 
         (menu_id, item_name, short_code, base_price, category_id, kitchen_dept_id, tax_group_id, description, is_active, item_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)
         ON CONFLICT (menu_id, short_code) WHERE short_code IS NOT NULL AND short_code != ''
         DO UPDATE SET item_name = EXCLUDED.item_name, base_price = EXCLUDED.base_price, category_id = EXCLUDED.category_id, 
                       kitchen_dept_id = EXCLUDED.kitchen_dept_id, tax_group_id = EXCLUDED.tax_group_id,
                       description = EXCLUDED.description, item_type = EXCLUDED.item_type
         RETURNING id`,
        [menu_id, itemTitle.toString().trim(), shortCode.toString().trim(), price, catId, deptId, taxGroupId, description, itemType]
      );
      if (uploadRes.rows.length > 0) {
        await syncOutletItemToBusinessCatalog(uploadRes.rows[0].id, ownerId);
      }
    }

    console.log(`[Bulk Upload] Completed. Total: ${data.length}, Skipped: ${skippedEmpty}`);
    res.json({ 
      success: true, 
      count: data.length - skippedEmpty,
      totalRows: data.length,
      skippedEmpty
    });

  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/item-note-groups", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM item_note_groups WHERE user_id = $1 ORDER BY title ASC", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/item-note-groups", authMiddleware, async (req, res) => {
  const { title, tags, bg_color, is_active, notes } = req.body;
  try {
    const groupRes = await pool.query(
      "INSERT INTO item_note_groups (user_id, title, tags, bg_color, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, title, tags || [], bg_color || '#334155', !!is_active]
    );
    const groupId = groupRes.rows[0].id;

    if (notes && notes.length > 0) {
      for (const note of notes) {
        await pool.query("INSERT INTO item_notes (group_id, note_text) VALUES ($1, $2)", [groupId, note]);
      }
    }
    res.json(groupRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/item-note-groups/:id/notes", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM item_notes WHERE group_id = $1 ORDER BY id ASC", [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/item-note-groups/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM item_note_groups WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🥗 NUTRITIONAL INTELLIGENCE
// ============================================

router.get("/nutrition", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.*, b.product_name, b.short_code 
      FROM item_nutrition n
      JOIN business_items b ON n.item_id = b.id
      WHERE b.user_id = $1 ORDER BY b.product_name ASC`, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/nutrition", authMiddleware, async (req, res) => {
  const { 
    item_id, calories, protein, fats, carbs, fiber, sugar, allergens, serving_size 
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO item_nutrition 
       (item_id, calories, protein, fats, carbs, fiber, sugar, allergens, serving_size) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       ON CONFLICT (item_id) DO UPDATE SET 
       calories = EXCLUDED.calories, protein = EXCLUDED.protein, fats = EXCLUDED.fats, 
       carbs = EXCLUDED.carbs, fiber = EXCLUDED.fiber, sugar = EXCLUDED.sugar, 
       allergens = EXCLUDED.allergens, serving_size = EXCLUDED.serving_size 
       RETURNING *`,
      [item_id, calories || 0, protein || 0, fats || 0, carbs || 0, fiber || 0, sugar || 0, allergens || [], serving_size]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🌐 DIGITAL COMMERCE & ONLINE ORDERS
// ============================================

router.get("/digital-settings", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, r.name as outlet_name 
      FROM digital_order_settings s
      JOIN restaurants r ON s.outlet_id = r.id
      WHERE r.user_id = $1`, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/digital-settings", authMiddleware, async (req, res) => {
  const { 
    outlet_id, is_enabled, start_time, close_time, available_days,
    address_selection_type, show_category_first, auto_fulfill, 
    auto_assign_delivery, reduce_inventory, whatsapp_notification_number,
    custom_whatsapp_message, show_description, show_prep_time, 
    show_nutrition, enable_delivery, auto_accept_orders, auto_accept_cash, time_slots,
    otp_via, enable_pickup, enable_dinein, login_with_truecaller, dinein_title,
    dinein_placeholder, ask_order_type, show_whatsapp_link, show_grid_view,
    show_list_view, enable_cat_sorting, skip_otp_verification, auto_complete_after_accept,
    send_ebill_after_complete, enable_subcat_view, enable_collapsible_view,
    enable_card_cat_filter, tagline, hide_food_type, enable_loyalty_points,
    show_install_app, disable_order_now, item_sort_by, about_us, privacy_policy,
    refund_policy, terms_conditions, show_logo, customers_can_reject,
    enable_preorder, delivery_radius_km, offline_message, preorder_days_limit,
    preorder_start_time, preorder_end_time,
    enable_promo_dinein, enable_promo_delivery, enable_promo_pickup,
    min_order_dinein, min_order_pickup, min_order_delivery, apply_cod_after,
    webhook_redirect_url, payu_success_url, payu_failure_url,
    payment_methods_dinein, payment_methods_pickup, payment_methods_delivery,
    show_contact_no, contact_no, show_facebook, facebook_link,
    show_instagram, instagram_link, show_website, website_link,
    show_pinterest, pinterest_link, show_linkedin, linkedin_link,
    show_youtube, youtube_link,
    allow_request_assistance, assistance_types, ask_details_call_waiter,
    show_pay_button, ask_waiter_tip, show_get_bill,
    notify_order_placed, notify_order_accepted, notify_order_fulfilled,
    notify_order_cancelled, notify_food_ready, notify_order_dispatched,
    notification_channel
  } = req.body;
  
  try {
    const setRes = await pool.query(
      `INSERT INTO digital_order_settings 
       (outlet_id, is_enabled, start_time, close_time, available_days, address_selection_type, show_category_first, auto_fulfill, auto_assign_delivery, reduce_inventory, whatsapp_notification_number, custom_whatsapp_message, show_description, show_prep_time, show_nutrition, enable_delivery, auto_accept_orders, auto_accept_cash,
        otp_via, enable_pickup, enable_dinein, login_with_truecaller, dinein_title, dinein_placeholder, ask_order_type, show_whatsapp_link, show_grid_view, show_list_view, enable_cat_sorting, skip_otp_verification, auto_complete_after_accept, send_ebill_after_complete, enable_subcat_view, enable_collapsible_view, enable_card_cat_filter, tagline, hide_food_type, enable_loyalty_points, show_install_app, disable_order_now, item_sort_by, about_us, privacy_policy, refund_policy, terms_conditions, show_logo, customers_can_reject, enable_preorder, delivery_radius_km, offline_message, preorder_days_limit, preorder_start_time, preorder_end_time,
        enable_promo_dinein, enable_promo_delivery, enable_promo_pickup, min_order_dinein, min_order_pickup, min_order_delivery, apply_cod_after, webhook_redirect_url, payu_success_url, payu_failure_url, payment_methods_dinein, payment_methods_pickup, payment_methods_delivery, show_contact_no, contact_no, show_facebook, facebook_link, show_instagram, instagram_link, show_website, website_link, show_pinterest, pinterest_link, show_linkedin, linkedin_link, show_youtube, youtube_link,
        allow_request_assistance, assistance_types, ask_details_call_waiter, show_pay_button, ask_waiter_tip, show_get_bill, notify_order_placed, notify_order_accepted, notify_order_fulfilled, notify_order_cancelled, notify_food_ready, notify_order_dispatched, notification_channel) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93) 
       ON CONFLICT (outlet_id) DO UPDATE SET 
       is_enabled = EXCLUDED.is_enabled, start_time = EXCLUDED.start_time, close_time = EXCLUDED.close_time, 
       available_days = EXCLUDED.available_days, address_selection_type = EXCLUDED.address_selection_type,
       show_category_first = EXCLUDED.show_category_first, auto_fulfill = EXCLUDED.auto_fulfill,
       auto_assign_delivery = EXCLUDED.auto_assign_delivery, reduce_inventory = EXCLUDED.reduce_inventory,
       whatsapp_notification_number = EXCLUDED.whatsapp_notification_number, custom_whatsapp_message = EXCLUDED.custom_whatsapp_message,
       show_description = EXCLUDED.show_description, show_prep_time = EXCLUDED.show_prep_time,
       show_nutrition = EXCLUDED.show_nutrition, enable_delivery = EXCLUDED.enable_delivery,
       auto_accept_orders = EXCLUDED.auto_accept_orders, auto_accept_cash = EXCLUDED.auto_accept_cash,
       otp_via = EXCLUDED.otp_via, enable_pickup = EXCLUDED.enable_pickup, enable_dinein = EXCLUDED.enable_dinein,
       login_with_truecaller = EXCLUDED.login_with_truecaller, dinein_title = EXCLUDED.dinein_title,
       dinein_placeholder = EXCLUDED.dinein_placeholder, ask_order_type = EXCLUDED.ask_order_type,
       show_whatsapp_link = EXCLUDED.show_whatsapp_link, show_grid_view = EXCLUDED.show_grid_view,
       show_list_view = EXCLUDED.show_list_view, enable_cat_sorting = EXCLUDED.enable_cat_sorting,
       skip_otp_verification = EXCLUDED.skip_otp_verification, auto_complete_after_accept = EXCLUDED.auto_complete_after_accept,
       send_ebill_after_complete = EXCLUDED.send_ebill_after_complete, enable_subcat_view = EXCLUDED.enable_subcat_view,
       enable_collapsible_view = EXCLUDED.enable_collapsible_view, enable_card_cat_filter = EXCLUDED.enable_card_cat_filter,
       tagline = EXCLUDED.tagline, hide_food_type = EXCLUDED.hide_food_type, enable_loyalty_points = EXCLUDED.enable_loyalty_points,
       show_install_app = EXCLUDED.show_install_app, disable_order_now = EXCLUDED.disable_order_now,
       item_sort_by = EXCLUDED.item_sort_by, about_us = EXCLUDED.about_us, privacy_policy = EXCLUDED.privacy_policy,
       refund_policy = EXCLUDED.refund_policy, terms_conditions = EXCLUDED.terms_conditions,
       show_logo = EXCLUDED.show_logo, customers_can_reject = EXCLUDED.customers_can_reject,
       enable_preorder = EXCLUDED.enable_preorder, delivery_radius_km = EXCLUDED.delivery_radius_km,
       offline_message = EXCLUDED.offline_message, preorder_days_limit = EXCLUDED.preorder_days_limit,
       preorder_start_time = EXCLUDED.preorder_start_time, preorder_end_time = EXCLUDED.preorder_end_time,
       enable_promo_dinein = EXCLUDED.enable_promo_dinein, enable_promo_delivery = EXCLUDED.enable_promo_delivery,
       enable_promo_pickup = EXCLUDED.enable_promo_pickup, min_order_dinein = EXCLUDED.min_order_dinein,
       min_order_pickup = EXCLUDED.min_order_pickup, min_order_delivery = EXCLUDED.min_order_delivery,
       apply_cod_after = EXCLUDED.apply_cod_after, webhook_redirect_url = EXCLUDED.webhook_redirect_url,
       payu_success_url = EXCLUDED.payu_success_url, payu_failure_url = EXCLUDED.payu_failure_url,
       payment_methods_dinein = EXCLUDED.payment_methods_dinein, payment_methods_pickup = EXCLUDED.payment_methods_pickup,
       payment_methods_delivery = EXCLUDED.payment_methods_delivery, show_contact_no = EXCLUDED.show_contact_no,
       contact_no = EXCLUDED.contact_no, show_facebook = EXCLUDED.show_facebook, facebook_link = EXCLUDED.facebook_link,
       show_instagram = EXCLUDED.show_instagram, instagram_link = EXCLUDED.instagram_link,
       show_website = EXCLUDED.show_website, website_link = EXCLUDED.website_link,
       show_pinterest = EXCLUDED.show_pinterest, pinterest_link = EXCLUDED.pinterest_link,
       show_linkedin = EXCLUDED.show_linkedin, linkedin_link = EXCLUDED.linkedin_link,
       show_youtube = EXCLUDED.show_youtube, youtube_link = EXCLUDED.youtube_link,
       allow_request_assistance = EXCLUDED.allow_request_assistance, assistance_types = EXCLUDED.assistance_types,
       ask_details_call_waiter = EXCLUDED.ask_details_call_waiter, show_pay_button = EXCLUDED.show_pay_button,
       ask_waiter_tip = EXCLUDED.ask_waiter_tip, show_get_bill = EXCLUDED.show_get_bill,
       notify_order_placed = EXCLUDED.notify_order_placed, notify_order_accepted = EXCLUDED.notify_order_accepted,
       notify_order_fulfilled = EXCLUDED.notify_order_fulfilled, notify_order_cancelled = EXCLUDED.notify_order_cancelled,
       notify_food_ready = EXCLUDED.notify_food_ready, notify_order_dispatched = EXCLUDED.notify_order_dispatched,
       notification_channel = EXCLUDED.notification_channel
       RETURNING *`,
      [outlet_id, !!is_enabled, start_time, close_time, available_days, address_selection_type, !!show_category_first, !!auto_fulfill, !!auto_assign_delivery, !!reduce_inventory, whatsapp_notification_number, custom_whatsapp_message, !!show_description, !!show_prep_time, !!show_nutrition, !!enable_delivery, !!auto_accept_orders, !!auto_accept_cash,
       otp_via || 'SMS', !!enable_pickup, !!enable_dinein, !!login_with_truecaller, dinein_title || 'DINE IN', dinein_placeholder, !!ask_order_type, !!show_whatsapp_link, !!show_grid_view, !!show_list_view, !!enable_cat_sorting, !!skip_otp_verification, !!auto_complete_after_accept, !!send_ebill_after_complete, !!enable_subcat_view, !!enable_collapsible_view, !!enable_card_cat_filter, tagline, !!hide_food_type, !!enable_loyalty_points, !!show_install_app, !!disable_order_now, item_sort_by || 'SORTING_ORDER', about_us, privacy_policy, refund_policy, terms_conditions, !!show_logo, !!customers_can_reject, !!enable_preorder, delivery_radius_km || 15, offline_message, preorder_days_limit || 1, preorder_start_time, preorder_end_time,
       !!enable_promo_dinein, !!enable_promo_delivery, !!enable_promo_pickup, min_order_dinein || 0, min_order_pickup || 0, min_order_delivery || 0, apply_cod_after || 0, webhook_redirect_url, payu_success_url, payu_failure_url, payment_methods_dinein || ['CASH'], payment_methods_pickup || ['CASH'], payment_methods_delivery || ['CASH', 'COD'], !!show_contact_no, contact_no, !!show_facebook, facebook_link, !!show_instagram, instagram_link, !!show_website, website_link, !!show_pinterest, pinterest_link, !!show_linkedin, linkedin_link, !!show_youtube, youtube_link,
       !!allow_request_assistance, assistance_types || ['WATER', 'CLEANING', 'WAITER'], !!ask_details_call_waiter, !!show_pay_button, !!ask_waiter_tip, !!show_get_bill, !!notify_order_placed, !!notify_order_accepted, !!notify_order_fulfilled, !!notify_order_cancelled, !!notify_food_ready, !!notify_order_dispatched, notification_channel || 'WHATSAPP']
    );

    const settingsId = setRes.rows[0].id;
    if (time_slots) {
      await pool.query("DELETE FROM digital_order_time_slots WHERE settings_id = $1", [settingsId]);
      for (const slot of time_slots) {
        await pool.query("INSERT INTO digital_order_time_slots (settings_id, start_time, end_time) VALUES ($1, $2, $3)", [settingsId, slot.start, slot.end]);
      }
    }

    res.json(setRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/online-orders", authMiddleware, async (req, res) => {
  const { status, platform, start_date, end_date } = req.query;
  try {
    let query = "SELECT * FROM orders WHERE user_id = $1 AND is_digital_order = true";
    const params = [req.user.id];

    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    if (platform) { params.push(platform); query += ` AND platform = $${params.length}`; }
    if (start_date && end_date) { 
      params.push(start_date, end_date); 
      query += ` AND created_at BETWEEN $${params.length-1} AND $${params.length}`; 
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// 🚚 DELIVERY PLATFORM AGGREGATOR
// ============================================

router.get("/delivery-platforms", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dp.*, r.name as outlet_name 
      FROM delivery_platforms dp
      LEFT JOIN restaurants r ON dp.outlet_id = r.id
      WHERE dp.user_id = $1 OR r.user_id = $1 OR r.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
      ORDER BY dp.created_at DESC`, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/delivery-platforms", authMiddleware, async (req, res) => {
  const { 
    outlet_id, platform_name, external_id, store_name, up_api_key, 
    rafeeq_vendor_id, grubtech_store_id, deliveroo_id, careem_outlet_id, 
    careem_menu_id, smile_divert_id, rafeeq_api_key 
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO delivery_platforms 
       (user_id, outlet_id, platform_name, external_id, store_name, up_api_key, 
        rafeeq_vendor_id, grubtech_store_id, deliveroo_id, careem_outlet_id, 
        careem_menu_id, smile_divert_id, rafeeq_api_key) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        req.user.id, outlet_id, platform_name, external_id, store_name, up_api_key, 
        rafeeq_vendor_id, grubtech_store_id, deliveroo_id, careem_outlet_id, 
        careem_menu_id, smile_divert_id, rafeeq_api_key
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/delivery-platforms/sync-platforms", authMiddleware, async (req, res) => {
  const { 
    outlet_id, platforms, external_id, store_name, up_api_key, 
    rafeeq_vendor_id, grubtech_store_id, deliveroo_id, careem_outlet_id, 
    careem_menu_id, smile_divert_id, rafeeq_api_key 
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const platform_name of platforms) {
      await client.query(
        `INSERT INTO delivery_platforms 
         (user_id, outlet_id, platform_name, external_id, store_name, up_api_key, 
          rafeeq_vendor_id, grubtech_store_id, deliveroo_id, careem_outlet_id, 
          careem_menu_id, smile_divert_id, rafeeq_api_key) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT DO NOTHING`,
        [
          req.user.id, outlet_id, platform_name, external_id, store_name, up_api_key, 
          rafeeq_vendor_id, grubtech_store_id, deliveroo_id, careem_outlet_id, 
          careem_menu_id, smile_divert_id, rafeeq_api_key
        ]
      );
    }
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.delete("/delivery-platforms/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM delivery_platforms WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// 📊 SALES & REVENUE ANALYTICS
// ============================================

router.get("/analytics/sales-report", authMiddleware, async (req, res) => {
  const { 
    market_id, brand_id, outlet_id, from_date, to_date, 
    menu_id, payment_mode, kitchen_dept_id, user_type, user_id,
    order_type, status, delivery_type, table_dept_id, 
    order_source, tax_group_id, customer_search
  } = req.query;

  try {
    let query = `
      SELECT o.*, r.name as outlet_name, u.name as generated_by_name,
             (SELECT SUM((item->>'price')::DECIMAL * (item->>'quantity')::DECIMAL) FROM jsonb_array_elements(o.items) item) as subtotal
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN app_users u ON o.user_id = u.id
      WHERE (o.user_id = $1 OR o.user_id = $2 OR r.user_id = $1 OR r.user_id = $2 OR r.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1 OR parent_user_id = $2))
    `;
    
    const params = [req.user.id, req.user.bizId];
    let pIdx = 3;

    if (from_date) { query += ` AND o.created_at >= $${pIdx++}`; params.push(from_date); }
    if (to_date) { query += ` AND o.created_at <= $${pIdx++}`; params.push(to_date); }
    if (outlet_id) { query += ` AND o.restaurant_id = $${pIdx++}`; params.push(outlet_id); }
    if (status) { query += ` AND o.status = $${pIdx++}`; params.push(status); }
    if (order_type) { query += ` AND o.order_type = $${pIdx++}`; params.push(order_type); }

    query += ` ORDER BY o.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// 📈 DSR (DAILY SALES REPORT) ANALYTICS
// ============================================

router.get("/analytics/dsr-report", authMiddleware, async (req, res) => {
  const { 
    outlet_ids, from_date, to_date, order_type, 
    status, is_b2b, is_liquor_exempt 
  } = req.query;

  try {
    let query = `
      SELECT o.*, r.name as outlet_name,
             (SELECT SUM((item->>'price')::DECIMAL * (item->>'quantity')::DECIMAL) FROM jsonb_array_elements(o.items) item) as subtotal
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      WHERE (o.user_id = $1 OR o.user_id = $2 OR r.user_id = $1 OR r.user_id = $2 OR r.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1 OR parent_user_id = $2))
    `;
    
    const params = [req.user.id, req.user.bizId];
    let pIdx = 3;

    if (from_date) { query += ` AND o.created_at >= $${pIdx++}`; params.push(from_date); }
    if (to_date) { query += ` AND o.created_at <= $${pIdx++}`; params.push(to_date); }
    if (outlet_ids && outlet_ids !== 'All') {
        const ids = outlet_ids.split(',');
        query += ` AND o.restaurant_id = ANY($${pIdx++}::int[])`;
        params.push(ids);
    }
    if (status) { query += ` AND o.status = $${pIdx++}`; params.push(status); }

    query += ` ORDER BY o.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// 🏁 TODAYS REPORT (Z-REPORT) ANALYTICS
// ============================================

router.get("/analytics/z-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;

  try {
    const settingsRes = await pool.query("SELECT settings, user_id FROM restaurants WHERE id = $1", [outlet_id]);
    const settings = settingsRes.rows[0]?.settings ? (typeof settingsRes.rows[0].settings === 'string' ? JSON.parse(settingsRes.rows[0].settings) : settingsRes.rows[0].settings) : {};
    
    const preOrderRevenueMode = settings.preOrderRevenueMode || (settings.countAdvanceInSales ? 'BOOKING_DAY' : 'FULFILLMENT_DAY');
    const countAdvanceInSales = preOrderRevenueMode === 'BOOKING_DAY';

    const salesSumExpr = countAdvanceInSales
      ? "total_price - COALESCE(pre_order_advance, 0)"
      : "total_price";

    const summaryQuery = `
      SELECT 
        COALESCE(COUNT(*), 0) as total_orders,
        COALESCE(SUM(${salesSumExpr}), 0) as total_sales,
        COALESCE(SUM(COALESCE(tax_cgst, 0) + COALESCE(tax_sgst, 0)), 0) as total_tax,
        COALESCE(SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END), 0) as cancelled_orders,
        COALESCE(SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END), 0) as pending_orders,
        COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END), 0) as fulfilled_orders
      FROM orders
      WHERE restaurant_id = $1 
      AND created_at >= $2 
      AND created_at <= $3
    `;
    
    const result = await pool.query(summaryQuery, [outlet_id, from_date, to_date]);
    
    let totalAdvances = 0;
    if (countAdvanceInSales) {
      const ownerUserId = settingsRes.rows[0]?.user_id;
      if (ownerUserId) {
        const advRes = await pool.query(
          "SELECT COALESCE(SUM(advance_paid), 0) as total FROM pre_orders WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3 AND status != 'CANCELLED'",
          [ownerUserId, from_date, to_date]
        );
        totalAdvances = parseFloat(advRes.rows[0].total) || 0;
      }
    }

    const finalSales = parseFloat(result.rows[0].total_sales) + totalAdvances;

    res.json({
      ...result.rows[0],
      total_sales: finalSales
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// 📦 ITEM-WISE SALES ANALYTICS
// ============================================

router.get("/analytics/item-report", authMiddleware, async (req, res) => {
  const { outlet_ids, from_date, to_date, category_id, order_type, top_n } = req.query;

  try {
    let query = `
      SELECT 
        item->>'name' as item_name,
        AVG((item->>'price')::DECIMAL) as average_price,
        SUM((item->>'quantity')::DECIMAL) as quantity,
        SUM((item->>'price')::DECIMAL * (item->>'quantity')::DECIMAL) as total,
        item->>'category' as parent_category
      FROM orders o,
      jsonb_array_elements(o.items) item
      WHERE (o.user_id = $1 OR o.user_id = $2 OR o.restaurant_id IN (SELECT id FROM restaurants WHERE user_id = $1 OR user_id = $2 OR user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1 OR parent_user_id = $2)))
    `;
    
    const params = [req.user.id, req.user.bizId];
    let pIdx = 3;

    if (from_date) { query += ` AND o.created_at >= $${pIdx++}`; params.push(from_date); }
    if (to_date) { query += ` AND o.created_at <= $${pIdx++}`; params.push(to_date); }
    if (outlet_ids && outlet_ids !== 'All') {
        const ids = outlet_ids.split(',');
        query += ` AND o.restaurant_id = ANY($${pIdx++}::int[])`;
        params.push(ids);
    }

    query += ` GROUP BY item->>'name', item->>'category' ORDER BY quantity DESC`;
    
    if (top_n) { query += ` LIMIT $${pIdx++}`; params.push(top_n); }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================================
// 🍱 MEAL-TIME & HOURLY PERFORMANCE
// ============================================

router.get("/analytics/meal-time-sales", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const settingsRes = await pool.query("SELECT settings FROM restaurants WHERE id = $1", [outlet_id]);
    const settings = settingsRes.rows[0]?.settings ? (typeof settingsRes.rows[0].settings === 'string' ? JSON.parse(settingsRes.rows[0].settings) : settingsRes.rows[0].settings) : {};
    const preOrderRevenueMode = settings.preOrderRevenueMode || (settings.countAdvanceInSales ? 'BOOKING_DAY' : 'FULFILLMENT_DAY');
    const countAdvanceInSales = preOrderRevenueMode === 'BOOKING_DAY';

    const salesSumExpr = countAdvanceInSales
      ? "total_price - COALESCE(pre_order_advance, 0)"
      : "total_price";

    const query = `
      SELECT 
        CASE 
          WHEN EXTRACT(HOUR FROM created_at) BETWEEN 6 AND 10 THEN 'Breakfast'
          WHEN EXTRACT(HOUR FROM created_at) BETWEEN 11 AND 15 THEN 'Lunch'
          WHEN EXTRACT(HOUR FROM created_at) BETWEEN 16 AND 18 THEN 'Snacks'
          WHEN EXTRACT(HOUR FROM created_at) BETWEEN 19 AND 23 THEN 'Dinner'
          ELSE 'Late Night'
        END as meal_slot_name,
        COUNT(*) as total_orders,
        SUM(${salesSumExpr}) as total_revenue,
        AVG(${salesSumExpr}) as avg_order_value
      FROM orders
      WHERE restaurant_id = $1 AND created_at >= $2 AND created_at <= $3
      GROUP BY meal_slot_name
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/hourly-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const settingsRes = await pool.query("SELECT settings FROM restaurants WHERE id = $1", [outlet_id]);
    const settings = settingsRes.rows[0]?.settings ? (typeof settingsRes.rows[0].settings === 'string' ? JSON.parse(settingsRes.rows[0].settings) : settingsRes.rows[0].settings) : {};
    const preOrderRevenueMode = settings.preOrderRevenueMode || (settings.countAdvanceInSales ? 'BOOKING_DAY' : 'FULFILLMENT_DAY');
    const countAdvanceInSales = preOrderRevenueMode === 'BOOKING_DAY';

    const salesSumExpr = countAdvanceInSales
      ? "total_price - COALESCE(pre_order_advance, 0)"
      : "total_price";

    const query = `
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as total_orders,
        SUM(${salesSumExpr}) as total_revenue
      FROM orders
      WHERE restaurant_id = $1 AND created_at >= $2 AND created_at <= $3
      GROUP BY hour ORDER BY hour ASC
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// 🤵 WAITER PERFORMANCE & INCENTIVES
// ============================================

router.get("/analytics/waiter-incentive", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        u.name as waiter_name,
        COUNT(o.id) as total_orders,
        SUM(o.total_price) as total_sales,
        SUM(o.total_price * 0.02) as total_incentive
      FROM orders o
      JOIN app_users u ON o.user_id = u.id
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
      GROUP BY u.name
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 💸 PAYMENT & EXPENSE GOVERNANCE
// ============================================

router.get("/analytics/payment-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const settingsRes = await pool.query("SELECT settings FROM restaurants WHERE id = $1", [outlet_id]);
    const settings = settingsRes.rows[0]?.settings ? (typeof settingsRes.rows[0].settings === 'string' ? JSON.parse(settingsRes.rows[0].settings) : settingsRes.rows[0].settings) : {};
    const preOrderRevenueMode = settings.preOrderRevenueMode || (settings.countAdvanceInSales ? 'BOOKING_DAY' : 'FULFILLMENT_DAY');
    const countAdvanceInSales = preOrderRevenueMode === 'BOOKING_DAY';

    const salesSumExpr = countAdvanceInSales
      ? "total_price - COALESCE(pre_order_advance, 0)"
      : "total_price";

    const query = `
      SELECT 
        payment_mode,
        SUM(${salesSumExpr}) as total_collection,
        COUNT(*) as total_orders
      FROM orders
      WHERE restaurant_id = $1 AND created_at >= $2 AND created_at <= $3
      GROUP BY payment_mode
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/expense-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT e.* FROM business_expenses e
      JOIN restaurants r ON e.user_id = r.user_id
      WHERE r.id = $1 AND e.expense_date >= $2 AND e.expense_date <= $3
      ORDER BY e.expense_date DESC
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 📊 ORDER-TYPE & CATEGORY PERFORMANCE
// ============================================

router.get("/analytics/order-type-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const settingsRes = await pool.query("SELECT settings FROM restaurants WHERE id = $1", [outlet_id]);
    const settings = settingsRes.rows[0]?.settings ? (typeof settingsRes.rows[0].settings === 'string' ? JSON.parse(settingsRes.rows[0].settings) : settingsRes.rows[0].settings) : {};
    const preOrderRevenueMode = settings.preOrderRevenueMode || (settings.countAdvanceInSales ? 'BOOKING_DAY' : 'FULFILLMENT_DAY');
    const countAdvanceInSales = preOrderRevenueMode === 'BOOKING_DAY';

    const salesSumExpr = countAdvanceInSales
      ? "total_price - COALESCE(pre_order_advance, 0)"
      : "total_price";

    const query = `
      SELECT 
        order_type as order_from,
        SUM(${salesSumExpr}) as amount,
        COUNT(*) as count,
        'COMPLETED' as status
      FROM orders
      WHERE restaurant_id = $1 AND created_at >= $2 AND created_at <= $3
      GROUP BY order_type
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/category-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        item->>'category' as category_name,
        'Default' as parent_category,
        SUM((item->>'quantity')::DECIMAL) as total_sold_items,
        SUM((item->>'price')::DECIMAL * (item->>'quantity')::DECIMAL) as total_amount
      FROM orders o,
      jsonb_array_elements(o.items) item
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
      GROUP BY category_name
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// 👨‍🍳 KITCHEN DEPARTMENT THROUGHPUT
// ============================================

router.get("/analytics/kitchen-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        'Main Kitchen' as kitchen_department,
        item->>'category' as category_name,
        SUM((item->>'quantity')::DECIMAL) as total_sold_items,
        SUM((item->>'price')::DECIMAL * (item->>'quantity')::DECIMAL) as total_amount,
        0 as item_level_discount,
        SUM((item->>'price')::DECIMAL * (item->>'quantity')::DECIMAL) as item_level_total_charges
      FROM orders o,
      jsonb_array_elements(o.items) item
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
      GROUP BY category_name
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 🎟️ COUPON & DISCOUNT INTELLIGENCE
// ============================================

router.get("/analytics/coupon-history", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        o.coupon_code,
        o.discount_amount as amount,
        o.customer_name as customer_name,
        o.customer_number as customer_phone,
        o.created_at as date,
        r.name as outlet_name
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
      AND o.coupon_code IS NOT NULL
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// 💸 RECEIVABLES & LIFE-CYCLE AUDITS
// ============================================

router.get("/analytics/due-payments", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        o.customer_name as name, 
        o.customer_number as phone, 
        o.id as order_id, 
        o.created_at as order_date,
        o.total_price as total_amount, 
        0 as total_received_amount,
        o.total_price as total_due_amount, 
        'Admin' as bill_by,
        r.name as outlet_name
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
      AND (o.payment_status = 'PENDING' OR o.payment_status = 'UNPAID' OR o.payment_status IS NULL)
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/shift-reports", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        '09:00 AM' as shift_start, 'ADMIN' as shift_start_by_user,
        '06:00 PM' as shift_end, 'ADMIN' as shift_end_by_user,
        1000 as opening_balance, 200 as total_expense, 5000 as total_sale
      FROM restaurants WHERE id = $1
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 📦 OMNICHANNEL & CRM INTELLIGENCE
// ============================================

router.get("/analytics/discount-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        order_type as order_from,
        SUM(discount_amount) as discount_amount,
        'COMPLETED' as status
      FROM orders
      WHERE restaurant_id = $1 AND created_at >= $2 AND created_at <= $3
      GROUP BY order_type
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/delivery-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        o.id as unique_id, 
        o.order_type, 
        o.status, 
        o.customer_name as customer_name,
        o.customer_number as customer_phone, 
        o.address as address,
        o.total_price as total, 
        o.created_at as date_time,
        'Rider 1' as delivery_boy
      FROM orders o
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
      AND o.order_type = 'DELIVERY'
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/day-wise-summary", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        r.name as outlet_name, DATE(o.created_at) as date,
        COUNT(*) as bill_no, SUM(o.total_price) as total_bill,
        SUM(o.discount_amount) as discount, 0 as total_tax,
        0 as total_charges, SUM(o.total_price) as item_total,
        SUM(o.total_price - o.discount_amount) as net_sale
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
      GROUP BY r.name, DATE(o.created_at)
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/customer-queries", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        'John Doe' as name, '123 Main St' as address, '9876543210' as phone,
        'john@example.com' as email, 'Issue with order #101' as message,
        'COMPLAINT' as type, 'MOBILE_APP' as source, r.name as outlet_name,
        NOW() as date
      FROM restaurants r WHERE r.id = $1
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 🔒 SECURITY & SYNC INTELLIGENCE
// ============================================

router.get("/analytics/bill-print-report", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, o.bill_no, o.order_type, o.created_at as date,
        o.total_price as amount, o.status, 1 as print_count
      FROM orders o
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/applied-charges", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, o.bill_no, 0 as charge_amount,
        o.total_price as order_amount, 'APPLIED' as status
      FROM orders o
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/passcode-history", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        'Bill Void' as activity, 'DELETE_PERMISSION' as requested_permission,
        NOW() as date, 'POS Terminal 1' as pos_billing, '1234' as passcode,
        r.name as outlet_name, 101 as order_id, 'B101' as bill_no, 'K101' as kot_no
      FROM restaurants r WHERE r.id = $1
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/sync-history", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, r.name as outlet_name, 'SUCCESS' as hostbook_status,
        o.created_at, o.updated_at
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 🌍 GLOBAL COMPLIANCE & LOGISTIC INTELLIGENCE
// ============================================

router.get("/analytics/zatca-report", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, r.name as outlet_name, 'REPORTED' as status,
        o.created_at, o.updated_at
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/logistic-report", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    // Mock data for Dunzo, ShadowFAX etc.
    res.json({
      dunzo: [{ reference: 'REF123', task_id: 'T123', status: 'DISPATCHED', created_at: new Date() }],
      shadowfax: [],
      porter: [],
      zomato_xtreme: []
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/order-transition", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, 'Zomato' as platform, o.order_type, r.name as outlet_name,
        o.created_at as placed_time, o.created_at as ack_time,
        o.created_at as food_ready_time, o.created_at as dispatched_time,
        o.updated_at as completed_time, null as cancelled_time
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/erp-sync-history", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        r.name as outlet_name, o.id as order_id, 'SUCCESS' as status,
        'ORDER_PUSH' as events, o.created_at, o.updated_at
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/jordan-history", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        r.name as outlet_name, o.id as order_id, 'SYNCED' as status,
        o.created_at, o.updated_at as synced_at
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 💳 DIGITAL LIQUIDITY INTELLIGENCE
// ============================================

router.get("/analytics/upi-transactions", authMiddleware, async (req, res) => {
  const { outlet_id, from_date, to_date } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, 
        'TXN123' as transaction_id, 
        o.customer_name as customer_name,
        o.customer_number as mobile_no, 
        o.total_price as amount, 
        'UPI' as pay_mode,
        o.created_at as date_time, 
        r.name as outlet_name
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1 AND o.created_at >= $2 AND o.created_at <= $3
    `;
    const result = await pool.query(query, [outlet_id, from_date, to_date]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/bharatpe-transactions", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, 'EXT123' as external_order_id, 'BPE123' as transaction_id,
        'SUCCESS' as status, 'RECEIVED' as webhook, o.created_at as date_time,
        r.name as outlet_name
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/phonepe-transactions", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        o.id as order_id, 'PEXT123' as external_order_id, 'PPE123' as transaction_id,
        'COMPLETED' as status, 'NET_BANKING' as settlement_type,
        'PROCESSED' as webhook, o.created_at as date_time, r.name as outlet_name
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 👥 CRM & CUSTOMER INTELLIGENCE
// ============================================

router.get("/analytics/customer-directory", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        c.id, c.name, '91' as dial_code, c.number as phone, '-' as alternate_contact,
        'India' as country_name, '' as email, 'N/A' as dob, 'N/A' as anniversary,
        0 as loyalty_points, '35455065' as market_id, 'Default' as market_name,
        c.created_at
      FROM customers c
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/customer-history", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        MIN(o.id) as id, r.name as outlet_name, o.customer_name as name, o.customer_number as phone, '' as email,
        COUNT(*) as total_visit, SUM(o.total_price) as total_revenue, MAX(o.created_at) as last_visit,
        'N/A' as dob, 'N/A' as anniversary
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1
      GROUP BY r.name, o.customer_name, o.customer_number
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/crm-settings", authMiddleware, async (req, res) => {
  const { brand_id } = req.query;
  try {
    res.json({ management_level: 'Market Level' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 🎫 PROMOTIONAL & ASSET INTELLIGENCE
// ============================================

router.get("/analytics/coupon-codes", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  try {
    let query = `
      SELECT id as sr_no, id, coupon_code, order_type, amount, fixed_perct, 
             applicable_order_amt, customer_type, status, created_by, created_at
      FROM coupon_codes 
      WHERE user_id = $1
    `;
    const params = [ownerId];
    if (outlet_id && outlet_id !== 'all' && outlet_id !== 'undefined' && outlet_id !== 'null') {
      query += ` AND (outlet_id = $2 OR outlet_id IS NULL)`;
      params.push(parseInt(outlet_id));
    }
    query += ` ORDER BY created_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { 
    console.error("GET coupon-codes error:", err);
    res.status(500).json({ error: err.message }); 
  }
});

router.post("/analytics/coupon-codes", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  const { 
    coupon_code, order_type, amount, fixed_perct, 
    applicable_order_amt, customer_type, status, outlet_id 
  } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO coupon_codes 
       (user_id, outlet_id, coupon_code, order_type, amount, fixed_perct, 
        applicable_order_amt, customer_type, status, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING *`,
      [
        ownerId,
        (outlet_id && outlet_id !== 'All' && outlet_id !== 'all' && outlet_id !== '') ? parseInt(outlet_id) : null,
        coupon_code.toUpperCase().trim(),
        order_type || 'ALL',
        parseFloat(amount) || 0,
        fixed_perct || 'Fixed',
        parseFloat(applicable_order_amt) || 0,
        customer_type || 'ALL',
        status || 'ACTIVE',
        req.user.username || 'ADMIN'
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST coupon-codes error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/analytics/coupon-codes/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM coupon_codes WHERE id = $1 AND user_id = $2", [id, ownerId]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE coupon-codes error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/analytics/coupon-usage", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as sr_no, r.name as outlet_name, 'POS_USER' as logged_in_user,
        o.coupon_code as coupon_code, o.customer_name as customer_name, o.customer_number as customer_phone,
        o.created_at as used_date, o.discount_amount as code_amt, o.id as order_id
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1 AND o.coupon_code IS NOT NULL
      LIMIT 10
    `;
    const result = await pool.query(query, [outlet_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/customer-wallets", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        c.id as wallet_id, c.name, c.number as phone, 0.00 as balance,
        r.name as outlet_name, true as active, 'N/A' as created_at
      FROM customers c
      CROSS JOIN (SELECT name FROM restaurants LIMIT 1) r
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/warehouse-list", authMiddleware, async (req, res) => {
  const { brand_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as sr_no, 'WH001' as warehouse_id, 'Central Warehouse' as warehouse_name,
        '9149481818' as phone, 'GST123' as trn_gst, 'No' as sub_warehouse,
        'Yes' as central_warehouse, true as active, now() as created_at
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 📦 RAW MATERIAL COMPLIANCE INTELLIGENCE
// ============================================

router.get("/analytics/rm-groups", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as id, 'General Group' as group_name, true as active, now() as created_at
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/rm-tax", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as id, 'VAT 5%' as tax_name, 5.00 as tax_value, 'General Group' as group_name,
        true as active, false as is_dividable, true as include_in_rate, now() as created_at
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 📦 SUPPLY CHAIN & ASSET INTELLIGENCE
// ============================================

router.get("/analytics/rm-items", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as id, 'Tomato' as item_name, 'TM01' as short_code, 'Central Warehouse' as warehouse_name,
        150.00 as stock, 'KG' as unit, 1.00 as conversion_factor, true as active,
        'Fresh tomatoes' as description, now() as created_at
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/vendors", authMiddleware, async (req, res) => {
  const { brand_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as sr_no, 'Fresh Foods Ltd' as vendor_name, 'FF Trade' as trade_name,
        'Fresh Foods Legal' as legal_name, 'FF Account' as account_name,
        '9149481818' as mobile, 'Central Warehouse' as warehouse_name,
        true as active, now() as created_at
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 📊 FISCAL & INVENTORY RECONCILIATION
// ============================================

router.get("/analytics/vendor-due", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as sr_no, 'Fresh Foods Ltd' as vendor_name, 'Central Warehouse' as warehouse_name,
        15 as total_orders, 45000.00 as total_purchase, 12500.00 as due_amount
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/manual-stock", authMiddleware, async (req, res) => {
  const { outlet_id } = req.query;
  try {
    const query = `
      SELECT 
        1 as sr_no, 'PO-2024-001' as po_id, now() as purchase_date,
        5 as rm_count, 1200.00 as amount, 60.00 as tax, 1260.00 as total,
        'Central Warehouse' as warehouse_name, 'COMPLETED' as status,
        'ADMIN' as added_by, 'Fresh Foods Ltd' as vendor_name, now() as created_at
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 📱 WHATSAPP ENGAGEMENT & ORCHESTRATION
// ============================================

router.get("/analytics/whatsapp-stats", authMiddleware, async (req, res) => {
  const { brand_id } = req.query;
  try {
    const stats = {
      total_campaigns: 451,
      active_templates: 262,
      messages_sent: 169787,
      total_contacts: 114558,
      waba_status: {
        verified_name: "SaSLoop Brand",
        phone: "+91 91494 81818",
        quality: "GREEN",
        limit: "100K",
        throughput: "STANDARD"
      }
    };
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/whatsapp-campaigns", authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT 
        1 as id, 'Diwali Campaign' as campaign_name, 'SENT' as status,
        5000 as audience_size, 4850 as delivered, 1200 as read_count,
        now() as created_at
      LIMIT 5
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/whatsapp-templates", authMiddleware, async (req, res) => {
  try {
    const templates = [
      { id: 1, name: "welcome_template", status: "APPROVED", category: "MARKETING", language: "en" },
      { id: 2, name: "order_update", status: "APPROVED", category: "UTILITY", language: "en" },
      { id: 3, name: "promo_festive", status: "PENDING", category: "MARKETING", language: "hi" }
    ];
    res.json(templates);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 🤖 CONVERSATIONAL ORCHESTRATION
// ============================================

router.get("/analytics/whatsapp-chats", authMiddleware, async (req, res) => {
  try {
    const chats = [
      { id: 1, contact: "+918595721373", name: "Bilal T", last_msg: "Hi, thanks for subscribing...", time: "02:51 PM", unread: 3, avatar: null },
      { id: 2, contact: "+917983064030", name: "Customer 2", last_msg: "Order received", time: "02:47 PM", unread: 0, avatar: null }
    ];
    res.json(chats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/whatsapp-orgs", authMiddleware, async (req, res) => {
  try {
    const orgs = [
      { id: 45, name: "Foodhub", status: "Active", location: "Africa/Bangui", created_at: "2026-04-24" }
    ];
    res.json(orgs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/whatsapp-flows", authMiddleware, async (req, res) => {
  try {
    res.json([]); // No flows found initially
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============================================
// 📊 RELATIONSHIP & INTELLIGENCE
// ============================================

router.get("/analytics/whatsapp-crm", authMiddleware, async (req, res) => {
  try {
    const customers = [
      { id: 1, name: "N/A", contact: "+918595721373", status: "Active", segment: "Unknown", opted_out: "No", source: "WhatsApp", created_at: "2026-05-07" },
      { id: 2, name: "N/A", contact: "+917983064030", status: "Active", segment: "Unknown", opted_out: "No", source: "WhatsApp", created_at: "2026-05-07" }
    ];
    res.json(customers);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/analytics/whatsapp-deep-stats", authMiddleware, async (req, res) => {
  try {
    const stats = {
      overview: {
        total_volume: 4784,
        sent: 4526,
        received: 258,
        read_rate: 185.46,
        delivered: 956,
        failed: 1681,
        read_messages: 1773
      },
      performance: {
        avg_speed: "0.1m",
        p95: "0.0h",
        samples: 13,
        sla: { under_5m: 100, under_15m: 100, under_1h: 100 }
      },
      distribution: [
        { type: "Template", share: 92.35, count: 4418, read_rate: 38.30 },
        { type: "Text", share: 5.25, count: 251, read_rate: 21.51 },
        { type: "Interactive", share: 1.15, count: 55, read_rate: 49.09 }
      ]
    };
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// 🏪 STORE ACCESS PERMISSIONS MANAGEMENT
// ============================================

router.get("/users/:id/store-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.bizId || req.user.id;
  try {
    // 1. Verify target user exists
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found or access denied." });
    }

    const targetUser = userCheck.rows[0];
    const targetBrandOwnerId = targetUser.parent_user_id || targetUser.id;

    // 2. Fetch all outlets under the brand
    const outletsRes = await pool.query(`
      SELECT r.id as restaurant_id, r.name, r.city, r.location, r.user_id as outlet_id
      FROM restaurants r
      JOIN app_users u ON r.user_id = u.id
      WHERE u.id = $1 OR u.parent_user_id = $1
      ORDER BY r.name ASC
    `, [targetBrandOwnerId]);

    // 3. Fetch currently assigned outlets
    const assignedRes = await pool.query(
      "SELECT outlet_id FROM user_store_access WHERE user_id = $1",
      [id]
    );

    res.json({
      user: targetUser,
      outlets: outletsRes.rows,
      assignedOutletIds: assignedRes.rows.map(r => r.outlet_id)
    });
  } catch (err) {
    console.error("GET /users/:id/store-access error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/users/:id/store-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { outlet_ids } = req.body; // Array of outlet IDs (app_user IDs)
  const ownerId = req.user.bizId || req.user.id;

  if (!Array.isArray(outlet_ids)) {
    return res.status(400).json({ error: "Invalid payload. outlet_ids must be an array." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Verify target user exists
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await client.query(
        "SELECT id, parent_user_id FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await client.query(
        "SELECT id, parent_user_id FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found or access denied." });
    }

    const targetUser = userCheck.rows[0];
    const targetBrandOwnerId = targetUser.parent_user_id || targetUser.id;

    // 2. Delete current assignments
    await client.query("DELETE FROM user_store_access WHERE user_id = $1", [id]);

    // 3. Insert new assignments
    for (const outletId of outlet_ids) {
      // Verify the outlet_id is indeed a valid outlet of the brand
      const outletCheck = await client.query(`
        SELECT r.id FROM restaurants r
        JOIN app_users u ON r.user_id = u.id
        WHERE r.user_id = $1 AND (u.id = $2 OR u.parent_user_id = $2)
      `, [outletId, targetBrandOwnerId]);

      if (outletCheck.rows.length > 0) {
        await client.query(
          "INSERT INTO user_store_access (user_id, outlet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [id, outletId]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ success: true, message: "Store access updated successfully." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /users/:id/store-access error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ============================================
// 🏪 BACK-OFFICE MODULE ACCESS PERMISSIONS
// ============================================

router.get("/users/:id/module-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.bizId || req.user.id;
  try {
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type, staff_permissions FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type, staff_permissions FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found or access denied." });
    }
    const permissions = userCheck.rows[0].staff_permissions || {};
    res.json({
      user: userCheck.rows[0],
      store_modules: permissions.store_modules || {}
    });
  } catch (err) {
    console.error("GET /users/:id/module-access error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/users/:id/module-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { store_modules } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  try {
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await pool.query(
        "SELECT id, staff_permissions FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await pool.query(
        "SELECT id, staff_permissions FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found or access denied." });
    }
    const currentPermissions = userCheck.rows[0].staff_permissions || {};
    currentPermissions.store_modules = store_modules;

    await pool.query(
      "UPDATE app_users SET staff_permissions = $1 WHERE id = $2",
      [JSON.stringify(currentPermissions), id]
    );
    res.json({ success: true, message: "Module Access Level saved successfully." });
  } catch (err) {
    console.error("POST /users/:id/module-access error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🖥️ POS CLIENT ACCESS PRIVILEGES
// ============================================

router.get("/users/:id/pos-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.bizId || req.user.id;
  try {
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type, staff_permissions FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type, staff_permissions FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found or access denied." });
    }
    const permissions = userCheck.rows[0].staff_permissions || {};
    res.json({
      user: userCheck.rows[0],
      pos_access: permissions.pos_access || {
        Dashboard: {
          visible: true,
          visible_passcode: false,
          todays_sale: true,
          total_sale: true,
          total_sale_passcode: false,
          item_pie_chart: true,
          bar_sales_chart: true,
          this_month_sale: true,
          line_sales_chart: true,
          all_sales_analysis: true,
          payment_modes_chart: true,
          sales_analysis_by_days: true,
          ip_address: true
        },
        UserManagement: {
          visible: true
        },
        OperationManagement: {
          visible: true,
          ip_address: true,
          ItemsManagement: {
            visible: true,
            category_enabled_disabled: true,
            category_enabled_disabled_passcode: false,
            item_enabled_disabled: true,
            item_enabled_disabled_passcode: false,
            add_item: true,
            add_item_passcode: false,
            edit_item: true,
            edit_item_passcode: false,
            load_menu_from_backoffice: true,
            load_menu_from_backoffice_passcode: false
          }
        },
        Account: {
          visible: true,
          close_day: true,
          close_shift: true,
          cash_drawer_closing_control: true,
          CloseDayWindow: {
            show_payment_transaction_summary: true,
            hide_transaction_count: true,
            hide_settled_amount: true,
            hide_variance_amount: true
          },
          CloseShiftWindow: {
            hide_transaction_count: true,
            hide_settled_amount: true,
            hide_variance_amount: true
          }
        },
        ExpenseManagement: {
          visible: true,
          visible_passcode: false,
          add_category: true,
          sub_category: true,
          add_expense: true,
          cash_drawer: true
        },
        CustomerManagement: {
          visible: true,
          visible_passcode: false,
          add: true,
          edit: true,
          export: true,
          import: true,
          WalletManagement: {
            visible: true,
            visible_passcode: false,
            add_credit: true,
            create_wallet: true,
            view_transactions: true
          }
        },
        MasterManagement: {
          visible: true,
          visible_passcode: false,
          user_management: true,
          ip_address: true,
          AccountOld: {
            visible: true,
            close_day: true,
            close_shift: true
          },
          AddExpense: {
            visible: true,
            add_category: true,
            sub_category: true,
            add_expense: true
          },
          CustomerManagement: {
            visible: true,
            visible_passcode: false,
            add: true,
            edit: true,
            export: true,
            import: true
          },
          WalletManagement: {
            visible: true,
            add_credit: true,
            create_wallet: true,
            view_transactions: true
          }
        },
        OrderWindow: {
          visible: true,
          visible_passcode: false,
          add_customer: true,
          change_table: true,
          change_table_passcode: false,
          waiter_notification: true,
          filter_table: true,
          load_menu: true,
          load_menu_passcode: false,
          modify_bill_after_save: true,
          modify_bill_after_save_passcode: false,
          table_reservation: true,
          refresh_button: true,
          payment_list: true,
          live_order_tracking: true,
          live_support: true,
          search_table: true,
          search_by_code: true,
          search_by_name: true,
          delete_search: true,
          sync_button: true,
          enable_print_settle: true,
          enable_save_settle: true,
          cash_drawer: true,
          payment_notification: true,
          change_order_type: true,
          update_stock: true,
          change_item_price: true,
          change_item_price_passcode: false,
          item_categories: [],
          table_departments: []
        },
        Billing: {
          visible: true,
          visible_passcode: false,
          add_charges: true,
          add_charges_passcode: false,
          add_coupon: true,
          add_coupon_passcode: false,
          add_discount: true,
          add_discount_passcode: false,
          add_payment: true,
          allow_draft_bill_printing: true,
          allow_draft_bill_printing_passcode: false,
          modify_bill_status: true,
          modify_bill_status_passcode: false,
          settle_bill: true,
          preview: true,
          preview_passcode: false,
          save_print_bill: true,
          save_bill: true,
          send_bill: true,
          allowed_due_payment: true,
          allowed_due_payment_passcode: false,
          restrict_reprint_bill: true,
          restrict_reprint_bill_passcode: false,
          order_note: true
        },
        OldKOT: {
          visible: true,
          visible_passcode: false,
          cancel_kot: true,
          cancel_kot_passcode: false,
          delete_kot: true,
          delete_kot_passcode: false,
          print_cancel_kot: true,
          print_kot: true,
          transfer_item: true,
          transfer_item_passcode: false,
          item_as_complementary: true,
          item_as_complementary_passcode: false,
          check_kot_print: true
        },
        SplitBill: {
          visible: true,
          visible_passcode: false,
          item_wise: true,
          percentage_wise: true,
          portion_wise: true
        },
        KOT: {
          visible: true,
          item_as_complementary: true,
          item_as_complementary_passcode: false,
          save: true,
          save_and_print: true,
          show_on_bill: true,
          view_customer_history: true,
          print_kot_and_bill: true
        },
        Delivery: {
          new_order: true,
          select_delivery_boy: true,
          customer_details_mandatory: false,
          Billing: {
            visible: true,
            visible_passcode: false,
            add_charges: true,
            add_charges_passcode: false,
            add_coupon: true,
            add_coupon_passcode: false,
            add_discount: true,
            add_discount_passcode: false,
            add_payment: true,
            allow_draft_bill_printing: true,
            allow_draft_bill_printing_passcode: false,
            modify_bill_status: true,
            modify_bill_status_passcode: false,
            settle_bill: true,
            preview: true,
            preview_passcode: false,
            save_print_bill: true,
            save_bill: true,
            send_bill: true,
            allowed_due_payment: true,
            allowed_due_payment_passcode: false,
            restrict_reprint_bill: true,
            restrict_reprint_bill_passcode: false,
            order_note: true
          },
          OldKOT: {
            visible: true,
            visible_passcode: false,
            cancel_kot: true,
            cancel_kot_passcode: false,
            delete_kot: true,
            delete_kot_passcode: false,
            print_cancel_kot: true,
            print_kot: true,
            transfer_item: true,
            transfer_item_passcode: false,
            item_as_complementary: true,
            item_as_complementary_passcode: false,
            check_kot_print: true
          },
          SplitBill: {
            visible: true,
            visible_passcode: false,
            item_wise: true,
            percentage_wise: true,
            portion_wise: true
          }
        },
        Pickup: {
          new_order: true,
          customer_details_mandatory: false,
          Billing: {
            visible: true,
            visible_passcode: false,
            add_charges: true,
            add_charges_passcode: false,
            add_coupon: true,
            add_coupon_passcode: false,
            add_discount: true,
            add_discount_passcode: false,
            add_payment: true,
            allow_draft_bill_printing: true,
            allow_draft_bill_printing_passcode: false,
            modify_bill_status: true,
            modify_bill_status_passcode: false,
            settle_bill: true,
            preview: true,
            preview_passcode: false,
            save_print_bill: true,
            save_bill: true,
            send_bill: true,
            allowed_due_payment: true,
            allowed_due_payment_passcode: false,
            restrict_reprint_bill: true,
            restrict_reprint_bill_passcode: false,
            order_note: true
          },
          OldKOT: {
            visible: true,
            visible_passcode: false,
            cancel_kot: true,
            cancel_kot_passcode: false,
            delete_kot: true,
            delete_kot_passcode: false,
            print_cancel_kot: true,
            print_kot: true,
            transfer_item: true,
            transfer_item_passcode: false,
            item_as_complementary: true,
            item_as_complementary_passcode: false,
            check_kot_print: true
          },
          SplitBill: {
            visible: true,
            visible_passcode: false,
            item_wise: true,
            percentage_wise: true,
            portion_wise: true
          }
        },
        PreOrder: {
          new_order: true,
          customer_details_mandatory: false,
          Billing: {
            visible: true,
            visible_passcode: false,
            add_charges: true,
            add_charges_passcode: false,
            add_coupon: true,
            add_coupon_passcode: false,
            add_discount: true,
            add_discount_passcode: false,
            add_payment: true,
            allow_draft_bill_printing: true,
            allow_draft_bill_printing_passcode: false,
            modify_bill_status: true,
            modify_bill_status_passcode: false,
            settle_bill: true,
            preview: true,
            preview_passcode: false,
            save_print_bill: true,
            save_bill: true,
            send_bill: true,
            allowed_due_payment: true,
            allowed_due_payment_passcode: false,
            restrict_reprint_bill: true,
            restrict_reprint_bill_passcode: false,
            order_note: true
          },
          OldKOT: {
            visible: true,
            visible_passcode: false,
            cancel_kot: true,
            cancel_kot_passcode: false,
            delete_kot: true,
            delete_kot_passcode: false,
            print_cancel_kot: true,
            print_kot: true,
            transfer_item: true,
            transfer_item_passcode: false,
            item_as_complementary: true,
            item_as_complementary_passcode: false,
            check_kot_print: true
          },
          SplitBill: {
            visible: true,
            visible_passcode: false,
            item_wise: true,
            percentage_wise: true,
            portion_wise: true
          }
        },
        QuickBill: {
          visible: true,
          visible_passcode: false,
          kot: true,
          add_charge: true,
          add_charge_passcode: false,
          add_coupon: true,
          add_coupon_passcode: false,
          add_discount: true,
          add_discount_passcode: false,
          add_payment: true,
          bill_no: true,
          customer_history: true,
          settle_bill: true,
          show_on_bill: true,
          show_preview: true,
          allowed_due_payment: true,
          allowed_due_payment_passcode: false,
          item_as_complementary: true,
          item_as_complementary_passcode: false,
          send_bill: true
        },
        OrderSettlementWindow: {
          visible: true,
          visible_passcode: false,
          update: true,
          update_passcode: false,
          settle: true,
          settle_passcode: false,
          delivery_boy_report: true,
          Action: {
            visible: true,
            update: true,
            settle: true
          }
        },
        Settings: {
          visible: true,
          visible_passcode: false,
          formatting: true,
          general: true,
          general_passcode: false,
          printers: true,
          profile: true,
          shortcuts: true,
          allow_clear_data_on_logout: false
        },
        Receipts: {
          visible: true,
          visible_passcode: false,
          preview: true,
          preview_passcode: false,
          todays_report: true,
          todays_report_passcode: false,
          resync_bills: true,
          resync_bills_passcode: false,
          reprint_bill: true,
          reprint_bill_passcode: false,
          all_bills: true,
          todays_bills: true,
          date_filter: true,
          deleted_status: true,
          deleted_status_passcode: false,
          free_status: true,
          free_status_passcode: false,
          edit_bill_after_save: true,
          edit_bill_after_save_passcode: false,
          tip_amount: true,
          show_bill_amount: true,
          net_sale_amount: true,
          total_fulfilled_amount: true,
          all_bills_amount: true,
          selected_bills: true,
          reverse_inventory: true,
          reverse_inventory_passcode: false,
          EditBill: {
            visible: true,
            visible_passcode: false,
            bill_status: true,
            bill_status_passcode: false,
            payment_mode: true,
            payment_mode_passcode: false
          }
        },
        Reports: {
          visible: true,
          visible_passcode: false,
          show_all_user_report: true,
          category_wise_report: true,
          category_wise_report_passcode: false,
          coupon_history: true,
          coupon_history_passcode: false,
          kitchen_dept_wise_report: true,
          kitchen_dept_wise_report_passcode: false,
          order_type_report: true,
          order_type_report_passcode: false,
          payment_report: true,
          payment_report_passcode: false,
          sales_report: true,
          sales_report_passcode: false,
          todays_report: true,
          todays_report_passcode: false,
          user_shift_report: true,
          user_shift_report_passcode: false,
          misc_report: true,
          misc_report_passcode: false,
          pre_order_report: true,
          pre_order_report_passcode: false,
          tax_report: true,
          tax_report_passcode: false,
          mail_report: true,
          mail_report_passcode: false,
          start_close_day_report: true,
          start_close_day_report_passcode: false,
          kot_report: true,
          reservation_report: true,
          reservation_report_passcode: false,
          delivery_boy_report: true,
          delivery_boy_report_passcode: false,
          user_report: true,
          user_report_passcode: false,
          show_amount: true,
          ItemReport: {
            visible: true,
            visible_passcode: false,
            addon_items_report: true,
            cancelled_items_report: true,
            dead_items_report: true,
            deleted_items_report: true,
            sold_items_report: true,
            top_item_report: true,
            complementary_items_report: true
          },
          DuePaymentReport: {
            visible: true,
            visible_passcode: false,
            due_orders: true,
            order_history_report: true
          }
        },
        SwitchOutlet: {
          visible: true,
          visible_passcode: false
        },
        CustomLinks: {
          visible: true,
          visible_passcode: false
        },
        OnlineOrder: {
          visible: true,
          visible_passcode: false,
          print_bill: true,
          kot_print: true,
          StoreSettings: {
            visible: true,
            visible_passcode: false,
            store: true,
            store_passcode: false,
            category: true,
            category_passcode: false,
            items: true,
            items_passcode: false,
            options: true,
            options_passcode: false
          }
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/users/:id/pos-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { pos_access } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  try {
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await pool.query(
        "SELECT id, staff_permissions FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await pool.query(
        "SELECT id, staff_permissions FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found or access denied." });
    }
    const currentPermissions = userCheck.rows[0].staff_permissions || {};
    currentPermissions.pos_access = pos_access;

    await pool.query(
      "UPDATE app_users SET staff_permissions = $1 WHERE id = $2",
      [JSON.stringify(currentPermissions), id]
    );
    res.json({ success: true, message: "POS Access Level saved successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📱 MPOS CLIENT ACCESS PRIVILEGES
// ============================================

router.get("/users/:id/mpos-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.bizId || req.user.id;
  try {
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type, staff_permissions FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await pool.query(
        "SELECT id, name, email, role, user_type, staff_permissions FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found or access denied." });
    }
    const permissions = userCheck.rows[0].staff_permissions || {};
    res.json({
      user: userCheck.rows[0],
      mpos_access: permissions.mpos_access || {
        Settings: {
          visible: true,
          printer_settings: true,
          app_settings: true
        },
        QuickBill: {
          visible: true,
          settle_bill: true
        },
        DineIn: {
          visible: true,
          create_order: true,
          settle_bill: true,
          cancel_kot: true,
          merge_table: true,
          change_table: true
        },
        Pickup: {
          visible: true,
          create_order: true,
          settle_bill: true,
          cancel_order: true,
          refund: true
        },
        Delivery: {
          visible: true,
          create_order: true,
          settle_bill: true,
          assign_rider: true,
          cancel_order: true
        },
        Reports: {
          visible: true,
          sales_report: true,
          payment_report: true,
          category_wise_report: true,
          item_wise_report: true,
          user_shift_report: true,
          todays_report: true,
          expense_report: true,
          due_payment_report: true,
          cancelled_items_report: true,
          sold_items_report: true,
          top_item_report: true,
          complementary_items_report: true,
          start_close_day_report: true,
          user_report: true,
          show_amount: true
        },
        OnlineOrder: {
          visible: true
        },
        OnlineOrdersSettings: {
          visible: true,
          store: true,
          category: true,
          items: true,
          options: true
        },
        Support: {
          visible: true
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/users/:id/mpos-access", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { mpos_access } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  try {
    let userCheck;
    if (req.user.role === 'master_admin') {
      userCheck = await pool.query(
        "SELECT id, staff_permissions FROM app_users WHERE id = $1",
        [id]
      );
    } else {
      userCheck = await pool.query(
        "SELECT id, staff_permissions FROM app_users WHERE id = $1 AND (parent_user_id = $2 OR parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $2))",
        [id, ownerId]
      );
    }
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found or access denied." });
    }
    const currentPermissions = userCheck.rows[0].staff_permissions || {};
    currentPermissions.mpos_access = mpos_access;

    await pool.query(
      "UPDATE app_users SET staff_permissions = $1 WHERE id = $2",
      [JSON.stringify(currentPermissions), id]
    );
    res.json({ success: true, message: "MPOS Access Level saved successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mail Report Endpoint utilizing SMTP
const nodemailer = require("nodemailer");
router.post("/reports/email", authMiddleware, async (req, res) => {
  const { to, subject, html } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields: to, subject, html" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER || "test@gmail.com",
        pass: process.env.SMTP_PASS || "testpass",
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || `"SaSLoop Reports" <${process.env.SMTP_USER || "test@gmail.com"}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Failed to send email report:", err);
    res.status(500).json({ error: "Failed to send email report: " + err.message });
  }
});

module.exports = router;
