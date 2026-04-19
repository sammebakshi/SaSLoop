const pool = require("../db");

const subscriptionGuard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Fetch latest user data to check subscription
    const dbRes = await pool.query(
      "SELECT subscription_plan, subscription_expires_at FROM app_users WHERE id = $1", 
      [userId]
    );

    if (dbRes.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const { subscription_plan, subscription_expires_at } = dbRes.rows[0];

    // If no expiration date is set, assume it's lifetime or not yet started (allow for now)
    if (!subscription_expires_at) {
      return next();
    }

    const now = new Date();
    const expiry = new Date(subscription_expires_at);

    if (now > expiry) {
      // Allow them to still see the dashboard but block 'Marketing' or 'Ordering' features?
      // For simplicity, let's just add a flag they can check on frontend
      req.subscriptionStatus = "EXPIRED";
      
      // OPTIONAL: Hard block certain routes
      // if (req.path.includes('/broadcast') || req.path.includes('/bot-config')) {
      //   return res.status(403).json({ error: "Subscription expired. Please renew to access this feature." });
      // }
    } else {
      req.subscriptionStatus = "ACTIVE";
    }

    next();
  } catch (err) {
    console.error("Subscription Guard Error:", err);
    res.status(500).json({ error: "Internal server error during subscription check" });
  }
};

module.exports = { subscriptionGuard };
