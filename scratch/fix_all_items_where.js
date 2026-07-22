const fs = require('fs');
const { execSync } = require('child_process');

function fixAllItemsWhere(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const targetOld = `    const params = [];
    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') {
      query += " WHERE (m.outlet_id = $1 OR m.user_id = $1) AND m.is_pos_default = true";
      params.push(outlet_id);
    } else {
      query += " WHERE m.user_id = $1 AND m.is_pos_default = true";
      params.push(ownerId);
    }
    query += " ORDER BY omi.id ASC";`;

    const targetNew = `    const targetId = (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') ? parseInt(outlet_id) : ownerId;
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
    query += " ORDER BY m.is_pos_default DESC, omi.id ASC";`;

    let normContent = content.replace(/\r\n/g, '\n');
    let normOld = targetOld.replace(/\r\n/g, '\n');

    if (normContent.includes(normOld)) {
        normContent = normContent.replace(normOld, targetNew);
        fs.writeFileSync(filePath, normContent, 'utf8');
        console.log(`SUCCESS: Fixed /outlet-all-items in ${filePath}`);
    } else {
        console.log(`WARNING: Could not find targetOld in ${filePath}`);
    }
}

fixAllItemsWhere('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
fixAllItemsWhere('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');

execSync('node -c routes/brandRoutes.js');
console.log("SYNTAX CHECK: routes/brandRoutes.js PASSED ✅");

execSync('node -c pos-app/server/routes/brandRoutes.js');
console.log("SYNTAX CHECK: pos-app/server/routes/brandRoutes.js PASSED ✅");
