const fs = require('fs');
const { execSync } = require('child_process');

function updateClean(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace GET /outlet-menus
    const targetMenusOld = `router.get("/outlet-menus", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  
  const parsedOutletId = (outlet_id && outlet_id !== "global" && outlet_id !== "null" && outlet_id !== "undefined") ? parseInt(outlet_id) : null;
  
  try {
    console.log(\`[GET /outlet-menus] User: \${req.user.id}, Biz: \${req.user.bizId}, Target Outlet: \${parsedOutletId}\`);
    let query = \`
      SELECT om.*, COALESCE(u.business_name, u.name, 'Global Catalog') as outlet_name
      FROM outlet_menus om
      LEFT JOIN app_users u ON om.outlet_id = u.id
      WHERE om.user_id = $1
    \`;
    const params = [ownerId];
    if (parsedOutletId) {
      query += " AND (om.outlet_id = $2 OR om.outlet_id IS NULL)";
      params.push(parsedOutletId);
    }
    query += " ORDER BY om.menu_name ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { 
    console.error("[GET /outlet-menus] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});`;

    const targetMenusNew = `router.get("/outlet-menus", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  
  const targetId = (outlet_id && outlet_id !== "global" && outlet_id !== "null" && outlet_id !== "undefined") ? parseInt(outlet_id) : ownerId;
  
  try {
    console.log(\`[GET /outlet-menus] User: \${req.user.id}, Biz: \${req.user.bizId}, Target: \${targetId}\`);
    let query = \`
      SELECT om.*, COALESCE(u.business_name, u.name, 'Global Catalog') as outlet_name
      FROM outlet_menus om
      LEFT JOIN app_users u ON om.outlet_id = u.id
      WHERE (
        om.outlet_id = $1 OR 
        om.user_id = $1 OR 
        om.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR 
        om.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1) OR
        om.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
      )
      ORDER BY om.menu_name ASC
    \`;
    const result = await pool.query(query, [targetId]);
    res.json(result.rows);
  } catch (err) { 
    console.error("[GET /outlet-menus] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});`;

    // 2. Replace GET /outlet-all-items
    const targetAllItemsOld = `router.get("/outlet-all-items", authMiddleware, async (req, res) => {
  let { outlet_id, menu_id, include_all } = req.query;
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
    const params = [];
    const conditions = [];

    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') {
      conditions.push(\`(m.outlet_id = \${params.length + 1} OR m.user_id = \${params.length + 1})\`);
      params.push(outlet_id);
    } else {
      conditions.push(\`m.user_id = \${params.length + 1}\`);
      params.push(ownerId);
    }

    if (menu_id && menu_id !== 'all') {
      conditions.push(\`m.id = \${params.length + 1}\`);
      params.push(parseInt(menu_id));
    } else if (include_all !== 'true') {
      // By default if include_all is not explicitly true and no menu_id provided, default to include all or POS default
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY m.is_pos_default DESC, omi.id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});`;

    const targetAllItemsNew = `router.get("/outlet-all-items", authMiddleware, async (req, res) => {
  let { outlet_id, menu_id, include_all } = req.query;
  const ownerId = req.user.bizId || req.user.id;

  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }

  const targetId = (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') ? parseInt(outlet_id) : ownerId;

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
    const params = [targetId];
    const conditions = [\`(
      m.outlet_id = $1 OR 
      m.user_id = $1 OR 
      m.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR 
      m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1) OR
      m.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
    )\`];

    if (menu_id && menu_id !== 'all') {
      params.push(parseInt(menu_id));
      conditions.push(\`m.id = $\${params.length}\`);
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

    // Normalize CRLF to LF for reliable string comparison
    let normContent = content.replace(/\r\n/g, '\n');
    let normMenusOld = targetMenusOld.replace(/\r\n/g, '\n');
    let normAllItemsOld = targetAllItemsOld.replace(/\r\n/g, '\n');

    if (normContent.includes(normMenusOld)) {
        normContent = normContent.replace(normMenusOld, targetMenusNew);
        console.log(`SUCCESS: Replaced GET /outlet-menus in ${filePath}`);
    } else {
        console.log(`WARNING: Could not match GET /outlet-menus in ${filePath}`);
    }

    if (normContent.includes(normAllItemsOld)) {
        normContent = normContent.replace(normAllItemsOld, targetAllItemsNew);
        console.log(`SUCCESS: Replaced GET /outlet-all-items in ${filePath}`);
    } else {
        console.log(`WARNING: Could not match GET /outlet-all-items in ${filePath}`);
    }

    fs.writeFileSync(filePath, normContent, 'utf8');
}

updateClean('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
updateClean('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');

try {
    execSync('node -c routes/brandRoutes.js');
    console.log("SYNTAX CHECK: routes/brandRoutes.js PASSED ✅");
} catch (e) {
    console.error("SYNTAX CHECK FAILED for routes/brandRoutes.js!", e.message);
}

try {
    execSync('node -c pos-app/server/routes/brandRoutes.js');
    console.log("SYNTAX CHECK: pos-app/server/routes/brandRoutes.js PASSED ✅");
} catch (e) {
    console.error("SYNTAX CHECK FAILED for pos-app/server/routes/brandRoutes.js!", e.message);
}
