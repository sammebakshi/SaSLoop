const pool = require('../db');
pool.query(`SELECT t.id, t.name as table_name, t.department_id, d.department_name, d.is_active as dept_active 
             FROM tables_list t 
             LEFT JOIN table_departments d ON t.department_id = d.id 
             WHERE t.outlet_id = '12' AND t.is_active = true AND (d.id IS NULL OR d.is_active = true) 
             ORDER BY t.name ASC`)
  .then(res => { console.log('OK', res.rows); process.exit(0); })
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); });
