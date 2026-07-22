const fs = require('fs');

// 1. Update MasterMenuManager.jsx
const masterMenuPath = 'c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/MasterMenuManager.jsx';
let masterContent = fs.readFileSync(masterMenuPath, 'utf8');

const oldGetOutletId = `    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id");
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return freshId;
    };`;

const newGetOutletId = `    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id") || sessionStorage.getItem("selected_outlet_id") || localStorage.getItem("selected_outlet_id") || user.outlet_id || user.bizId || user.id;
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return (freshId && freshId !== 'global') ? freshId : (user.bizId || user.id);
    };`;

if (masterContent.includes(oldGetOutletId)) {
    masterContent = masterContent.replace(oldGetOutletId, newGetOutletId);
    fs.writeFileSync(masterMenuPath, masterContent, 'utf8');
    console.log("SUCCESS 1: Updated getOutletId in MasterMenuManager.jsx!");
} else {
    console.log("WARNING 1: Could not find old getOutletId in MasterMenuManager.jsx");
}

// 2. Helper to update brandRoutes.js
function updateBrandRoutes(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Update /outlet-menus
    const oldMenusBlockRegex = /router\.get\("\/outlet-menus"[\s\S]*?WHERE om\.user_id = \$1[\s\S]*?res\.json\(result\.rows\);[\s\S]*?\}\);/;
    const newMenusBlock = `router.get("/outlet-menus", authMiddleware, async (req, res) => {
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

    if (oldMenusBlockRegex.test(content)) {
        content = content.replace(oldMenusBlockRegex, newMenusBlock);
        console.log(`SUCCESS 2: Updated /outlet-menus in ${filePath}`);
    } else {
        console.log(`WARNING 2: /outlet-menus regex did not match in ${filePath}`);
    }

    // Update /outlet-all-items query filter
    const oldAllItemsRegex = /if \(outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined'\) \{[\r\n\s]+conditions\.push\(`\(m\.outlet_id = \${params\.length \+ 1} OR m\.user_id = \${params\.length \+ 1}\)`\);[\r\n\s]+params\.push\(outlet_id\);[\r\n\s]+\} else \{[\r\n\s]+conditions\.push\(`m\.user_id = \${params\.length \+ 1}`\);[\r\n\s]+params\.push\(ownerId\);[\r\n\s]+\}/;

    const newAllItemsBlock = `const targetId = (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') ? parseInt(outlet_id) : ownerId;
    conditions.push(\`(
      m.outlet_id = \${params.length + 1} OR 
      m.user_id = \${params.length + 1} OR 
      m.user_id = (SELECT parent_user_id FROM app_users WHERE id = \${params.length + 1}) OR 
      m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = \${params.length + 1}) OR
      m.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = \${params.length + 1})
    )\`);
    params.push(targetId);`;

    if (oldAllItemsRegex.test(content)) {
        content = content.replace(oldAllItemsRegex, newAllItemsBlock);
        console.log(`SUCCESS 3: Updated /outlet-all-items in ${filePath}`);
    } else {
        console.log(`WARNING 3: /outlet-all-items regex did not match in ${filePath}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

updateBrandRoutes('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
updateBrandRoutes('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');
