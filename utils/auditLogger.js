const pool = require("../db");

/**
 * Logs a system action for audit purposes.
 * @param {number} userId - The ID of the user performing the action.
 * @param {string} action - Descriptive action name (e.g., 'TOPUP_CREDITS', 'LOGIN').
 * @param {object} details - JSON object containing context about the action.
 */
const logAudit = async (userId, action, details = {}) => {
  try {
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)",
      [userId, action, JSON.stringify(details)]
    );
  } catch (err) {
    console.error("FAILED TO LOG AUDIT:", err);
  }
};

module.exports = { logAudit };
