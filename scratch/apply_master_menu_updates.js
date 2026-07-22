const fs = require('fs');

// 1. Update MasterMenuManager.jsx getOutletId
const mmmPath = 'c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/MasterMenuManager.jsx';
let mmmContent = fs.readFileSync(mmmPath, 'utf8');

const mmmOld = `    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id");
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return freshId;
    };`;

const mmmNew = `    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id") || sessionStorage.getItem("selected_outlet_id") || localStorage.getItem("selected_outlet_id") || user.outlet_id || user.bizId || user.id;
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return (freshId && freshId !== 'global') ? freshId : (user.bizId || user.id);
    };`;

if (mmmContent.includes(mmmOld)) {
    mmmContent = mmmContent.replace(mmmOld, mmmNew);
    fs.writeFileSync(mmmPath, mmmContent, 'utf8');
    console.log("SUCCESS 1: Updated getOutletId in MasterMenuManager.jsx!");
} else {
    console.log("WARNING 1: Could not find getOutletId block in MasterMenuManager.jsx");
}

// 2. Update brandRoutes.js in both locations
function updateBrandRoutes(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replacement for GET /outlet-all-items
    const oldAllItemsRegex = /router\.get\("\/outlet-all-items"[\s\S]*?res\.json\(result\.rows\);[\s\S]*?\}\);/;

    const newAllItemsCode = `router.get("/outlet-all-items", authMiddleware, async (req, res) => {
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

    if (oldAllItemsRegex.test(content)) {
        content = content.replace(oldAllItemsRegex, newAllItemsCode);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`SUCCESS 2: Updated /outlet-all-items in ${filePath}`);
    } else {
        console.log(`WARNING 2: /outlet-all-items regex match failed in ${filePath}`);
    }
}

updateBrandRoutes('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
updateBrandRoutes('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');
