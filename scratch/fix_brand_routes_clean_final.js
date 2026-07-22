const fs = require('fs');
const { execSync } = require('child_process');

function fixRoutes(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const oldBlock = `router.get("/outlet-all-items", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;

  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }

  try {
    let query = \`
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
    \`;
    const params = [];
    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') {
      query += " WHERE (m.outlet_id = $1 OR m.user_id = $1) AND m.is_pos_default = true";
      params.push(outlet_id);
    } else {
      query += " WHERE m.user_id = $1 AND m.is_pos_default = true";
      params.push(ownerId);
    }
    query += " ORDER BY omi.id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});`;

    const newBlock = `router.get("/outlet-all-items", authMiddleware, async (req, res) => {
  let { outlet_id, menu_id, include_all } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  const userRole = req.user.role || '';

  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && userRole === "user") {
    outlet_id = req.user.id;
  }

  const targetId = (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') ? parseInt(outlet_id) : ownerId;
  const isMaster = userRole === 'master_admin' || userRole === 'admin' || userRole === 'superadmin';

  try {
    let query = \`
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
             m.is_pos_default,
             m.is_digital,
             m.is_digital_default,
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
    \`;
    const params = [isMaster && (!outlet_id || outlet_id === 'global'), targetId];
    const conditions = [\`(
      $1 = true OR
      m.outlet_id = $2 OR 
      m.user_id = $2 OR 
      m.user_id = (SELECT parent_user_id FROM app_users WHERE id = $2) OR 
      m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $2) OR
      m.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = $2)
    )\`];

    if (menu_id && menu_id !== 'all') {
      if (menu_id === 'digital_only' || menu_id === 'digital') {
        conditions.push(\`(m.is_digital = true OR m.is_digital_default = true OR LOWER(m.menu_name) LIKE '%digi%')\`);
      } else if (menu_id === 'pos_only' || menu_id === 'pos') {
        conditions.push(\`(m.is_pos_default = true OR LOWER(m.menu_name) LIKE '%pos%')\`);
      } else if (!isNaN(parseInt(menu_id))) {
        params.push(parseInt(menu_id));
        conditions.push(\`m.id = $\${params.length}\`);
      }
    } else if (include_all !== 'true' && include_all !== true) {
      conditions.push(\`(m.is_pos_default = true OR m.is_pos_default IS NULL)\`);
    }

    query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY m.is_pos_default DESC, omi.id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { 
    console.error("[GET /outlet-all-items] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});`;

    let normContent = content.replace(/\r\n/g, '\n');
    let normOld = oldBlock.replace(/\r\n/g, '\n');

    if (normContent.includes(normOld)) {
        normContent = normContent.replace(normOld, newBlock);
        fs.writeFileSync(filePath, normContent, 'utf8');
        console.log(`SUCCESS: Replaced GET /outlet-all-items in ${filePath}`);
    } else {
        console.log(`WARNING: Could not find normOld in ${filePath}`);
    }
}

fixRoutes('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
fixRoutes('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');

execSync('node -c routes/brandRoutes.js');
console.log("SYNTAX CHECK: routes/brandRoutes.js PASSED ✅");

execSync('node -c pos-app/server/routes/brandRoutes.js');
console.log("SYNTAX CHECK: pos-app/server/routes/brandRoutes.js PASSED ✅");
