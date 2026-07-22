const fs = require('fs');

const path = 'c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Update /outlet-menus
const oldOutletMenus = `router.get("/outlet-menus", authMiddleware, async (req, res) => {
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

const newOutletMenus = `router.get("/outlet-menus", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  
  const parsedOutletId = (outlet_id && outlet_id !== "global" && outlet_id !== "null" && outlet_id !== "undefined") ? parseInt(outlet_id) : ownerId;
  
  try {
    console.log(\`[GET /outlet-menus] User: \${req.user.id}, Biz: \${req.user.bizId}, Target Outlet: \${parsedOutletId}\`);
    let query = \`
      SELECT om.*, COALESCE(u.business_name, u.name, 'Global Catalog') as outlet_name
      FROM outlet_menus om
      LEFT JOIN app_users u ON om.outlet_id = u.id
      WHERE (
        om.user_id = $1 OR 
        om.outlet_id = $1 OR 
        om.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR 
        om.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1) OR
        om.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
      )
      ORDER BY om.menu_name ASC
    \`;
    const result = await pool.query(query, [parsedOutletId]);
    res.json(result.rows);
  } catch (err) { 
    console.error("[GET /outlet-menus] Error:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});`;

if (content.includes(oldOutletMenus)) {
    content = content.replace(oldOutletMenus, newOutletMenus);
    console.log("SUCCESS 1: Updated /outlet-menus query");
} else {
    console.log("WARNING 1: /outlet-menus pattern not found");
}

// 2. Update /outlet-all-items query
const oldOutletAllItemsQuery = `    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') {
      conditions.push(\`(m.outlet_id = \${params.length + 1} OR m.user_id = \${params.length + 1})\`);
      params.push(outlet_id);
    } else {
      conditions.push(\`m.user_id = \${params.length + 1}\`);
      params.push(ownerId);
    }`;

const newOutletAllItemsQuery = `    const targetId = (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') ? parseInt(outlet_id) : ownerId;
    conditions.push(\`(
      m.outlet_id = \${params.length + 1} OR 
      m.user_id = \${params.length + 1} OR 
      m.user_id = (SELECT parent_user_id FROM app_users WHERE id = \${params.length + 1}) OR 
      m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = \${params.length + 1}) OR
      m.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = \${params.length + 1})
    )\`);
    params.push(targetId);`;

if (content.includes(oldOutletAllItemsQuery)) {
    content = content.replace(oldOutletAllItemsQuery, newOutletAllItemsQuery);
    console.log("SUCCESS 2: Updated /outlet-all-items query");
} else {
    console.log("WARNING 2: /outlet-all-items query pattern not found");
}

fs.writeFileSync(path, content, 'utf8');
