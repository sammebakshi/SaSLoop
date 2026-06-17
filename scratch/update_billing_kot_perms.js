const pool = require("../db");

async function update() {
  try {
    const res = await pool.query(`
      UPDATE app_users 
      SET staff_permissions = jsonb_set(
        jsonb_set(
          staff_permissions,
          '{pos_access,Billing}',
          '{"visible": true, "add_discount": false, "add_charges": false, "allow_draft_bill_printing": false, "settle_bill": true, "save_bill": true, "save_print_bill": true, "add_payment": true, "preview": true, "add_coupon": false}'::jsonb
        ),
        '{pos_access,KOT}',
        '{"visible": true, "cancel_kot": false, "delete_kot": false, "print_kot": true, "item_as_complementary": false, "transfer_item": true}'::jsonb
      )
      WHERE username = 'shahetehzeebpos'
      RETURNING username, staff_permissions->'pos_access' as pos_access
    `);
    console.log("Updated permissions for:", res.rows[0].username);
    console.log("pos_access:", JSON.stringify(res.rows[0].pos_access, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}
update();
