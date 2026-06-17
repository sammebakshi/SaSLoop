const pool = require('./SaSLoop/db');
(async () => {
  try {
    const userRes = await pool.query('SELECT id, name, email, role, phone, whatsapp_number, address, username, business_name, business_type, created_at, parent_user_id FROM app_users WHERE id = 3');
    const user = userRes.rows[0];
    const parentRes = await pool.query('SELECT phone, whatsapp_number, address, business_name FROM app_users WHERE id = 2');
    const parent = parentRes.rows[0];
    console.log("DATABASE ROWS:", {
      staff_id: user.id,
      staff_phone: user.phone,
      parent_phone: parent.phone,
      parent_whatsapp: parent.whatsapp_number,
      parent_id: user.parent_user_id
    });
    
    // Also query what the profile endpoint returns by mocking req.user
    const bizResult = await pool.query(
        "SELECT * FROM restaurants WHERE user_id = $1",
        [user.parent_user_id || user.id]
    );
    let businessDetails = bizResult.rows[0] || null;
    let businessName = user.business_name || parent?.business_name || businessDetails?.name || null;
    let address = user.address || parent?.address || businessDetails?.address || null;
    let phone = user.phone;
    let whatsappNumber = user.whatsapp_number;
    if (user.parent_user_id && parent) {
        if (parent.phone) phone = parent.phone;
        if (parent.whatsapp_number) whatsappNumber = parent.whatsapp_number;
    }
    console.log("MOCKED PROFILE ENDPOINT RESPONSE:", {
        id: user.id,
        phone,
        whatsapp_number: whatsappNumber,
        address,
        business_name: businessName
    });
  } catch (err) {
    console.error("DIAGNOSTIC ERROR:", err);
  } finally {
    process.exit();
  }
})();
