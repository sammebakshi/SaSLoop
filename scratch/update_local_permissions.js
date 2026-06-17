const pool = require("../db");

async function updatePermissions() {
  try {
    const permissions = {
      store_modules: {
        Reports: { visible: false },
        Settings: { visible: false },
        "Digital Order": { visible: false },
        "POS Configuration": { visible: false },
        "Revenue Dashboard": { visible: false },
        "WhatsApp Marketing": { visible: false },
        "Live Order Tracking": { visible: false },
        "Inventory Management": { visible: false }
      },
      pos_access: {
        Dashboard: {
          visible: true,
          visible_passcode: false,
          todays_sale: false,
          total_sale: false,
          total_sale_passcode: false,
          item_pie_chart: false,
          bar_sales_chart: true,
          this_month_sale: true,
          line_sales_chart: true,
          all_sales_analysis: true,
          payment_modes_chart: true,
          sales_analysis_by_days: true,
          ip_address: true
        }
      }
    };

    const res = await pool.query(
      "UPDATE app_users SET staff_permissions = $1 WHERE username = 'shahetehzeebpos' RETURNING username, staff_permissions",
      [JSON.stringify(permissions)]
    );
    console.log("Updated permissions for:", res.rows[0].username);
    console.log("New staff permissions:", JSON.stringify(res.rows[0].staff_permissions, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}
updatePermissions();
