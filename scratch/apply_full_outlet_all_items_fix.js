const fs = require('fs');
const { execSync } = require('child_process');

// 1. Update MasterMenuManager.jsx dropdown options
const mmmPath = 'c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/MasterMenuManager.jsx';
let mmmContent = fs.readFileSync(mmmPath, 'utf8');

const oldSelectBlock = `<select
                                value={selectedMenuFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedMenuFilter(val);
                                    fetchData(val);
                                }}
                                className="bg-transparent text-[10px] font-bold text-indigo-600 uppercase outline-none min-w-[130px]"
                            >
                                <option value="all">All Menus (POS + Digital)</option>
                                {menus.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.menu_name} {m.is_pos_default ? '[POS]' : m.is_digital_default || m.is_digital ? '[Digital]' : ''}
                                    </option>
                                ))}
                            </select>`;

const newSelectBlock = `<select
                                value={selectedMenuFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedMenuFilter(val);
                                    fetchData(val);
                                }}
                                className="bg-transparent text-[10px] font-bold text-indigo-600 uppercase outline-none min-w-[160px]"
                            >
                                <option value="all">All Menus (POS + Digital)</option>
                                <option value="pos_only">POS Menu Only</option>
                                <option value="digital_only">Digital Menu Only</option>
                                {menus.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.menu_name} {m.is_pos_default ? '[POS]' : m.is_digital_default || m.is_digital ? '[Digital]' : ''}
                                    </option>
                                ))}
                            </select>`;

if (mmmContent.includes(oldSelectBlock)) {
    mmmContent = mmmContent.replace(oldSelectBlock, newSelectBlock);
    fs.writeFileSync(mmmPath, mmmContent, 'utf8');
    console.log("MasterMenuManager.jsx dropdown updated! ✅");
}

// 2. Update brandRoutes.js in both places
function replaceOutletAllItems(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const oldRouteRegex = /router\.get\("\/outlet-all-items"[\s\S]*?res\.json\(result\.rows\);[\s\S]*?\}\);/;

    const newRouteCode = `router.get("/outlet-all-items", authMiddleware, async (req, res) => {
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

    if (oldRouteRegex.test(content)) {
        content = content.replace(oldRouteRegex, newRouteCode);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`SUCCESS: Updated GET /outlet-all-items in ${filePath}`);
    } else {
        console.log(`WARNING: Regex did not match GET /outlet-all-items in ${filePath}`);
    }
}

replaceOutletAllItems('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
replaceOutletAllItems('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');

execSync('node -c routes/brandRoutes.js');
console.log("SYNTAX CHECK: routes/brandRoutes.js PASSED ✅");

execSync('node -c pos-app/server/routes/brandRoutes.js');
console.log("SYNTAX CHECK: pos-app/server/routes/brandRoutes.js PASSED ✅");
