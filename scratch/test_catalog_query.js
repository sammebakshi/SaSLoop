const pool = require('../db');
pool.query(`SELECT omi.id 
             FROM outlet_menu_items omi
             JOIN outlet_menus m ON omi.menu_id = m.id
             LEFT JOIN categories c ON omi.category_id = c.id
             WHERE m.outlet_id = '12' AND omi.item_type = '0' AND m.is_pos_default = true
               AND omi.is_active = true AND (c.id IS NULL OR c.is_active = true)
             ORDER BY omi.id ASC`)
  .then(res => { console.log('OK', res.rows); process.exit(0); })
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); });
