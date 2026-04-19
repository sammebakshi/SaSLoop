const jwt = require("jsonwebtoken");
const pool = require("../db");

// ============================================================
// Role-Based Permission Middleware
// Checks JWT → loads live permissions from DB → attaches to req.user
// ============================================================
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No token, access denied. Please log out and back in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // Load fresh permissions from DB (so changes take effect without re-login)
    const dbRes = await pool.query(
      "SELECT id, email, role, status, admin_permissions, created_by, assigned_admin_id FROM app_users WHERE id = $1",
      [verified.id]
    );

    if (dbRes.rows.length === 0) {
      return res.status(401).json({ error: "Account not found. Please log out and back in." });
    }

    const user = dbRes.rows[0];

    if (user.status === "inactive") {
      return res.status(403).json({ error: "Your account has been deactivated. Please contact your administrator." });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      admin_permissions: user.admin_permissions || {},
      created_by: user.created_by,
      assigned_admin_id: user.assigned_admin_id,
    };

    next();
  } catch (err) {
    console.error("Middleware Verification Error:", err.message);
    res.status(400).json({ error: "Invalid token. Please log out and back in." });
  }
};

// ============================================================
// Permission Helpers — use these on protected routes
// ============================================================

/** Only master_admin can access */
const requireMasterAdmin = (req, res, next) => {
  if (req.user?.role !== "master_admin") {
    return res.status(403).json({ error: "Access denied. Master Admin only." });
  }
  next();
};

/** master_admin OR admin with full_access OR admin with specific permission */
const requireAdminOrMaster = (req, res, next) => {
  const role = req.user?.role;
  if (role === "master_admin") return next();
  if (role && role.startsWith("admin")) return next();
  return res.status(403).json({ error: "Access denied. Admin role required." });
};

/** Admin must have can_create_accounts OR full_access OR be master_admin */
const requireCanCreateAccounts = (req, res, next) => {
  const role = req.user?.role;
  const perms = req.user?.admin_permissions || {};
  if (role === "master_admin") return next();
  if (role && role.startsWith("admin") && (perms.full_access || perms.can_create_accounts)) return next();
  return res.status(403).json({ error: "Access denied. You do not have permission to create accounts." });
};

/** Admin must have can_manage_subscriptions OR full_access OR be master_admin */
const requireCanManageSubscriptions = (req, res, next) => {
  const role = req.user?.role;
  const perms = req.user?.admin_permissions || {};
  if (role === "master_admin") return next();
  if (role && role.startsWith("admin") && (perms.full_access || perms.can_manage_subscriptions)) return next();
  return res.status(403).json({ error: "Access denied. You do not have permission to manage subscriptions." });
};

/** WhatsApp Connect — only master_admin or admin */
const requireWhatsAppAccess = (req, res, next) => {
  const role = req.user?.role;
  if (role === "master_admin" || (role && role.startsWith("admin"))) return next();
  return res.status(403).json({ error: "Access denied. Infrastructure managed by your administrator." });
};

module.exports = authMiddleware;
module.exports.requireMasterAdmin = requireMasterAdmin;
module.exports.requireAdminOrMaster = requireAdminOrMaster;
module.exports.requireCanCreateAccounts = requireCanCreateAccounts;
module.exports.requireCanManageSubscriptions = requireCanManageSubscriptions;
module.exports.requireWhatsAppAccess = requireWhatsAppAccess;