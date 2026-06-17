const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");
const { logAudit } = require("../utils/auditLogger");
const { 
  requireMasterAdmin, 
  requireAdminOrMaster, 
  requireCanCreateAccounts 
} = require("../middleware/authMiddleware");

// ✅ TEST ROUTE (VERY IMPORTANT)
router.get("/test", (req, res) => {
  res.send("MASTER ROUTE WORKING ✅");
});

// ✅ GET ALL USERS + ADMINS (with permissions)
router.get("/users", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, first_name, last_name, email, role, status, 
              phone, address, business_type, security_question, security_answer, password, gst_number, business_name,
              brand_name, whatsapp_api_number, country_code, owner_id,
              meta_access_token, meta_phone_id, meta_account_id,
              admin_permissions, created_by, assigned_admin_id, subscription_plan, subscription_expires_at
       FROM app_users 
       ORDER BY id DESC`
    );
    res.json(result.rows);
    console.log(`[API] Returning ${result.rows.length} users to Master Dashboard.`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET STATS (BUSINESSES COUNT)
router.get("/stats", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const businessQuery = await pool.query("SELECT COUNT(*) AS total FROM restaurants");
    res.json({ totalBusinesses: parseInt(businessQuery.rows[0].total) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CREATE USER / ADMIN
router.post("/create-user", authMiddleware, requireCanCreateAccounts, async (req, res) => {
  console.log("Create user request body:", req.body);
  try {
    const {
      first_name, last_name, username, email, password, phone, address,
      role, security_question, security_answer, business_type, gst_number, business_name, brand_name,
      whatsapp_api_number, country_code, owner_id,
      // Admin permissions (only used when role starts with 'admin')
      admin_permissions,
      // Who is creating this account (passed from frontend)
      created_by,
      subscription_plan,
      subscription_expires_at
    } = req.body;

    if (role === "master_admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (username) {
       const userCheck = await pool.query("SELECT id FROM app_users WHERE username = $1", [username]);
       if (userCheck.rows.length > 0) {
          return res.status(400).json({ error: "Username is already taken" });
       }
    }

    if (email) {
       const emailCheck = await pool.query("SELECT id FROM app_users WHERE email = $1", [email]);
       if (emailCheck.rows.length > 0) {
          return res.status(400).json({ error: "Email address is already mapped to an account" });
       }
    }

    if (phone) {
       const phoneCheck = await pool.query("SELECT id FROM app_users WHERE phone = $1", [phone]);
       if (phoneCheck.rows.length > 0) {
          return res.status(400).json({ error: "This phone number is already registered to another account" });
       }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // Build admin_permissions object for admin roles
    const permissionsJson = (role && role.startsWith('admin') && admin_permissions)
      ? JSON.stringify(admin_permissions)
      : JSON.stringify({ can_create_accounts: false, can_view_only: false, can_manage_subscriptions: false, full_access: role === 'admin_full' });

    const newUser = await pool.query(
      `INSERT INTO app_users 
      (first_name, last_name, username, email, password, phone, address, role, 
       security_question, security_answer, business_type, gst_number, business_name, 
       admin_permissions, created_by, status, subscription_plan, subscription_expires_at, 
       brand_name, whatsapp_api_number, country_code, owner_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'active',$16,$17,$18,$19,$20,$21)
      RETURNING id`,
      [
        first_name, last_name, username || null,
        email, hashedPassword, phone, address, role,
        security_question, security_answer,
        business_type || null, gst_number || null, business_name || null,
        permissionsJson,
        created_by || null,
        subscription_plan || 'free',
        subscription_expires_at || null,
        brand_name || null,
        whatsapp_api_number || null,
        country_code || '+91',
        owner_id || null
      ]
    );

    await logAudit(req.user.id, 'CREATE_USER', { targetUserId: newUser.rows[0].id, role });
    res.json({ message: "User/Admin created successfully" });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ TOGGLE STATUS
router.put("/users/:id/toggle", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    const currentRole = req.user.role;

    // Fetch target user role
    const targetUser = await pool.query(
      "SELECT role, status FROM app_users WHERE id = $1",
      [id]
    );

    if (targetUser.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const targetRole = targetUser.rows[0].role;

    // Security Checks
    if (targetRole === 'master_admin') {
       return res.status(403).json({ error: "Cannot deactivate a master admin" });
    }

    if (currentRole.startsWith('admin') && currentRole !== 'master_admin') {
       if (targetRole !== 'user') {
          return res.status(403).json({ error: "Admins can only manage regular business users" });
       }
    }

    const newStatus = targetUser.rows[0].status === "active" ? "inactive" : "active";

    await pool.query(
      "UPDATE app_users SET status = $1 WHERE id = $2",
      [newStatus, id]
    );

    await logAudit(req.user.id, 'TOGGLE_STATUS', { targetUserId: id, newStatus });
    res.json({ message: "Status updated successfully", newStatus });
  } catch (err) {
    console.error("Toggle Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE USER
router.delete("/users/:id", authMiddleware, requireAdminOrMaster, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    // Safety check to ensure we don't delete the only master_admin or current user
    const userRoleQuery = await client.query("SELECT role FROM app_users WHERE id = $1", [id]);
    if (userRoleQuery.rows.length > 0 && userRoleQuery.rows[0].role === 'master_admin') {
       return res.status(403).json({ error: "Cannot delete a master admin" });
    }

    await client.query("BEGIN");

    // Fetch all user IDs associated with this business/user
    const usersRes = await client.query(
      "SELECT id FROM app_users WHERE id = $1 OR parent_user_id = $1 OR owner_id = $1",
      [id]
    );
    let userIds = usersRes.rows.map(r => r.id);
    if (!userIds.includes(parseInt(id))) {
      userIds.push(parseInt(id));
    }

    // Nullify designation references beforehand to prevent foreign key violations on app_users
    await client.query("UPDATE app_users SET designation_id = NULL WHERE id = ANY($1) OR parent_user_id = ANY($1) OR owner_id = ANY($1)", [userIds]);

    // Helper to safely execute query only if the table exists
    // Using SAVEPOINT to prevent any single query error from aborting the transaction block
    const safeDelete = async (table, queryStr, params) => {
      try {
        const existsRes = await client.query(
          "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1 AND table_schema = 'public')",
          [table]
        );
        if (existsRes.rows[0].exists) {
          await client.query("SAVEPOINT safe_del_savepoint");
          try {
            await client.query(queryStr, params);
            await client.query("RELEASE SAVEPOINT safe_del_savepoint");
          } catch (err) {
            await client.query("ROLLBACK TO SAVEPOINT safe_del_savepoint");
            console.warn(`[DELETE USER PRE-CLEAN] Table ${table} cleanup failed:`, err.message);
          }
        }
      } catch (err) {
        console.warn(`[DELETE USER PRE-CLEAN] Table ${table} existence check failed:`, err.message);
      }
    };

    // 1. Delete level 3 dependencies
    await safeDelete("rider_locations", "DELETE FROM rider_locations WHERE order_id IN (SELECT id FROM orders WHERE user_id = ANY($1))", [userIds]);
    await safeDelete("recipes", "DELETE FROM recipes WHERE menu_item_id IN (SELECT id FROM business_items WHERE user_id = ANY($1))", [userIds]);
    await safeDelete("outlet_menu_items", "DELETE FROM outlet_menu_items WHERE menu_id IN (SELECT id FROM outlet_menus WHERE user_id = ANY($1))", [userIds]);

    // 2. Delete level 2 dependencies
    await safeDelete("orders", "DELETE FROM orders WHERE user_id = ANY($1) OR restaurant_id = ANY($1)", [userIds]);
    await safeDelete("outlet_menus", "DELETE FROM outlet_menus WHERE user_id = ANY($1)", [userIds]);
    await safeDelete("delivery_partners", "DELETE FROM delivery_partners WHERE user_id = ANY($1)", [userIds]);

    // 3. Delete level 1 dependencies
    const directTables = [
      "restaurants", "conversation_sessions", "customer_loyalty", 
      "chat_messages", "marketing_contacts", "system_notifications", 
      "recharge_requests", "audit_logs", "reservations", "pending_redemptions", 
      "pending_auths", "support_tickets", "kitchen_departments", "categories",
      "outlet_designations", "business_items", "outlet_payment_modes",
      "master_payment_modes", "tax_product_groups", "kots", "waiters",
      "discounts", "additional_charges", "customers", "pre_orders",
      "whatsapp_templates", "whatsapp_campaigns", "whatsapp_chatflows",
      "scheduled_messages", "waiter_requests", "business_expenses", 
      "pos_tables", "customer_feedback"
    ];

    for (const table of directTables) {
      await safeDelete(table, `DELETE FROM ${table} WHERE user_id = ANY($1)`, [userIds]);
    }

    // Finally delete the user
    await client.query("DELETE FROM app_users WHERE id = $1", [id]);

    await client.query("COMMIT");
    await logAudit(req.user.id, 'DELETE_USER', { deletedUserId: id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete User Error:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  } finally {
    client.release();
  }
});

// ✅ EDIT USER / ADMIN
router.put("/users/:id/edit", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name, last_name, username, email, role, business_type, gst_number, business_name, brand_name, phone, address,
      whatsapp_api_number, country_code, owner_id,
      meta_access_token, meta_phone_id, meta_account_id,
      subscription_plan, subscription_expires_at,
      admin_permissions
    } = req.body;

    const userRoleQuery = await pool.query("SELECT role FROM app_users WHERE id = $1", [id]);
    if (userRoleQuery.rows.length > 0 && userRoleQuery.rows[0].role === 'master_admin') {
       return res.status(403).json({ error: "Cannot edit a master admin" });
    }

    if (username) {
       const userCheck = await pool.query("SELECT id FROM app_users WHERE username = $1 AND id != $2", [username, id]);
       if (userCheck.rows.length > 0) {
          return res.status(400).json({ error: "Username is already taken by another account" });
       }
    }

    if (email) {
       const emailCheck = await pool.query("SELECT id FROM app_users WHERE email = $1 AND id != $2", [email, id]);
       if (emailCheck.rows.length > 0) {
          return res.status(400).json({ error: "Email address is already mapped to another account" });
       }
    }

    if (phone) {
       const phoneCheck = await pool.query("SELECT id FROM app_users WHERE phone = $1 AND id != $2", [phone, id]);
       if (phoneCheck.rows.length > 0) {
          return res.status(400).json({ error: "This phone number is already registered to another account" });
       }
    }

    await pool.query(
      `UPDATE app_users SET 
        first_name=$1, last_name=$2, username=$3, email=$4, role=$5, 
        business_type=$6, gst_number=$7, business_name=$8, phone=$9, address=$10,
        meta_access_token=$11, meta_phone_id=$12, meta_account_id=$13, 
        subscription_plan=$14, subscription_expires_at=$15, admin_permissions=$16, 
        brand_name=$17, whatsapp_api_number=$18, country_code=$19, owner_id=$20
      WHERE id=$21`,
      [
        first_name, last_name, username, email, role, business_type, gst_number, business_name, phone, address,
        meta_access_token, meta_phone_id, meta_account_id, 
        subscription_plan, subscription_expires_at || null, admin_permissions, 
        brand_name || null, whatsapp_api_number || null, country_code || '+91', owner_id || null, id
      ]
    );

    await logAudit(req.user.id, 'EDIT_USER', { targetUserId: id });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ TRANSFER / UNLINK OWNERSHIP
router.put("/users/:id/ownership", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id } = req.body; // can be null
    
    await pool.query("UPDATE app_users SET owner_id = $1 WHERE id = $2", [owner_id, id]);
    
    await logAudit(req.user.id, 'OWNERSHIP_UPDATE', { targetUserId: id, newOwnerId: owner_id });
    res.json({ message: "Ownership updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ RESET PASSWORD
router.put("/users/:id/reset-password", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Safety check
    const userRoleQuery = await pool.query("SELECT role FROM app_users WHERE id = $1", [id]);
    if (userRoleQuery.rows.length > 0 && userRoleQuery.rows[0].role === 'master_admin') {
       return res.status(403).json({ error: "Cannot reset password of a master admin" });
    }

    // Generate random 8 char password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 8; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE app_users SET password = $1 WHERE id = $2", [hashed, id]);

    await logAudit(req.user.id, 'RESET_PASSWORD', { targetUserId: id });
    res.json({ message: "Password reset successful", newPassword });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// ✅ ADMIN-SCOPED ROUTES
// Admins only see users they created (created_by = admin's ID)
// ============================================================

// ✅ TOP-UP CREDITS
router.post("/users/:id/credits", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    await pool.query("UPDATE app_users SET broadcast_credits = COALESCE(broadcast_credits, 0) + $1 WHERE id = $2", [amount, id]);
    
    await logAudit(req.user.id, 'CREDIT_TOPUP', { targetUserId: id, amount });
    res.json({ success: true, message: `Topped up ${amount} credits for user ${id}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ FETCH AUDIT LOGS
router.get("/audit-logs", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const dbRes = await pool.query(`
      SELECT al.*, u.username, u.email 
      FROM audit_logs al
      JOIN app_users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 1000
    `);
    res.json(dbRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/master/admin/my-users — used by AdminPanel
router.get("/admin/my-users", authMiddleware, async (req, res) => {
  try {
    const { id: adminId, role } = req.user;
    let query = "";
    let params = [];

    if (role === 'master_admin') {
      query = `SELECT id, username, first_name, last_name, email, role, status, 
                      phone, business_type, business_name, brand_name, gst_number, created_at,
                      whatsapp_api_number, country_code, owner_id,
                      meta_phone_id, admin_permissions
               FROM app_users 
               WHERE role = 'user'
               ORDER BY id DESC`;
    } else if (role === 'brand_owner') {
      query = `SELECT id, username, first_name, last_name, email, role, status, 
                      phone, business_type, business_name, brand_name, gst_number, created_at,
                      whatsapp_api_number, country_code, owner_id,
                      meta_phone_id, admin_permissions
               FROM app_users 
               WHERE role = 'user' AND owner_id = $1
               ORDER BY id DESC`;
      params = [adminId];
    } else {
      query = `SELECT id, username, first_name, last_name, email, role, status, 
                      phone, business_type, business_name, brand_name, gst_number, created_at,
                      whatsapp_api_number, country_code, owner_id,
                      meta_phone_id, admin_permissions
               FROM app_users 
               WHERE role = 'user' AND created_by = $1
               ORDER BY id DESC`;
      params = [adminId];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ SYSTEM HEALTH DATA
router.get("/system-health", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM app_users) as total_users,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM business_items) as total_items,
        (SELECT COUNT(*) FROM conversation_sessions) as active_sessions,
        (SELECT COUNT(*) FROM support_tickets WHERE status='open') as open_tickets,
        (SELECT COUNT(*) FROM audit_logs) as total_logs
    `);
    
    const recentErrors = await pool.query(`
       SELECT * FROM audit_logs WHERE action LIKE '%ERROR%' ORDER BY created_at DESC LIMIT 5
    `);

    const statusRes = await pool.query("SELECT restart_count, last_restart_at FROM system_status WHERE id = 1");
    const mem = process.memoryUsage();

    res.json({
       stats: stats.rows[0],
       recentErrors: recentErrors.rows,
       serverUptime: process.uptime(),
       dbStatus: 'CONNECTED',
       restart_count: statusRes.rows[0]?.restart_count || 0,
       last_restart_at: statusRes.rows[0]?.last_restart_at,
       memory_usage: {
         rss: (mem.rss / 1024 / 1024).toFixed(2),
         heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(2),
       }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FLUSH ALL SESSIONS (Emergency Maintenance)
router.post("/system/flush-sessions", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
     await pool.query("DELETE FROM conversation_sessions");
     await logAudit(req.user.id, 'SYSTEM_MAINTENANCE', { type: 'FLUSH_SESSIONS' });
     res.json({ message: "All AI sessions have been purged. Bots will restart on next message." });
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// ✅ SYSTEM PAYMENT CONFIG
router.post("/config/payment", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const { upi, bank, ifsc, qr_code_url, razorpay_link } = req.body;
    const check = await pool.query("SELECT id FROM payment_settings LIMIT 1");
    if (check.rows.length === 0) {
       await pool.query(
         "INSERT INTO payment_settings (upi_id, bank_account, ifsc_code, qr_code_url, razorpay_link) VALUES ($1, $2, $3, $4, $5)",
         [upi, bank, ifsc, qr_code_url, razorpay_link]
       );
    } else {
       await pool.query(
         "UPDATE payment_settings SET upi_id = $1, bank_account = $2, ifsc_code = $3, qr_code_url = $4, razorpay_link = $5, updated_at = CURRENT_TIMESTAMP",
         [upi, bank, ifsc, qr_code_url, razorpay_link]
       );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/config/payment", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT upi_id as upi, bank_account as bank, ifsc_code as ifsc, qr_code_url, razorpay_link FROM payment_settings LIMIT 1");
    if (result.rows.length > 0) {
       res.json(result.rows[0]);
    } else {
       res.json({ upi: "", bank: "", ifsc: "", qr_code_url: "", razorpay_link: "" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET RECHARGE REQUESTS (Master Admin & Admin)
router.get("/recharge-requests", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    let query = `
      SELECT rr.*, u.username, u.email, u.name 
      FROM recharge_requests rr
      JOIN app_users u ON rr.user_id = u.id
      ORDER BY rr.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ APPROVE RECHARGE REQUEST
router.post("/recharge-requests/:id/approve", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the request details
    const requestRes = await pool.query("SELECT * FROM recharge_requests WHERE id = $1 AND status = 'PENDING'", [id]);
    if (requestRes.rows.length === 0) {
       return res.status(404).json({ error: "Recharge request not found or already processed" });
    }
    const request = requestRes.rows[0];

    // Add credits to user
    await pool.query(
      "UPDATE app_users SET broadcast_credits = COALESCE(broadcast_credits, 0) + $1 WHERE id = $2",
      [request.credits_requested, request.user_id]
    );

    // Mark as approved
    await pool.query("UPDATE recharge_requests SET status = 'APPROVED', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);

    await logAudit(req.user.id, 'RECHARGE_APPROVED', { requestId: id, targetUserId: request.user_id, amount: request.credits_requested });
    
    res.json({ success: true, message: `Recharge approved. ${request.credits_requested} credits added.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ REJECT RECHARGE REQUEST
router.post("/recharge-requests/:id/reject", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the request details
    const requestRes = await pool.query("SELECT * FROM recharge_requests WHERE id = $1 AND status = 'PENDING'", [id]);
    if (requestRes.rows.length === 0) {
       return res.status(404).json({ error: "Recharge request not found or already processed" });
    }
    const request = requestRes.rows[0];

    // Mark as rejected
    await pool.query("UPDATE recharge_requests SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);

    await logAudit(req.user.id, 'RECHARGE_REJECTED', { requestId: id, targetUserId: request.user_id });
    
    res.json({ success: true, message: "Recharge request rejected." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET BRAND OWNERS (For Dropdown)
router.get("/brand-owners", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, brand_name, first_name FROM app_users WHERE role = 'brand_owner' ORDER BY first_name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE OWNERSHIP (Link/Unlink/Sold)
router.put("/users/:id/ownership", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_id } = req.body; // Can be null to unlink (Sold/Standalone)

    await pool.query(
      "UPDATE app_users SET owner_id = $1 WHERE id = $2",
      [owner_id, id]
    );

    await logAudit(req.user.id, 'UPDATE_OWNERSHIP', { targetUserId: id, newOwnerId: owner_id });
    res.json({ success: true, message: "Ownership architecture updated." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;