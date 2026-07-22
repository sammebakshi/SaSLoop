const fs = require('fs');
const { execSync } = require('child_process');

console.log("=== 1. UPDATING MasterMenuManager.jsx DROPDOWN ===");
const mmmPath = 'c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/MasterMenuManager.jsx';
let mmmContent = fs.readFileSync(mmmPath, 'utf8');

// Clean dropdown options without duplicates
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
                                <option value="pos_only">POS Menu Only</option>
                                <option value="digital_only">Digital Menu Only</option>
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
                            </select>`;

if (mmmContent.includes(oldSelectBlock)) {
    mmmContent = mmmContent.replace(oldSelectBlock, newSelectBlock);
    fs.writeFileSync(mmmPath, mmmContent, 'utf8');
    console.log("MasterMenuManager.jsx dropdown cleaned up! ✅");
} else {
    console.log("MasterMenuManager.jsx dropdown already clean or custom format.");
}

console.log("=== 2. UPDATING brandRoutes.js MENU_ID FILTERING ===");
function updateBrandRoutesFilter(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const oldConditionBlock = `    if (menu_id && menu_id !== 'all') {
      params.push(parseInt(menu_id));
      conditions.push(\`m.id = $\${params.length}\`);
    } else if (include_all !== 'true' && include_all !== true) {
      conditions.push(\`(m.is_pos_default = true OR m.is_pos_default IS NULL)\`);
    }`;

    const newConditionBlock = `    if (menu_id && menu_id !== 'all') {
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
    }`;

    let normContent = content.replace(/\r\n/g, '\n');
    let normOld = oldConditionBlock.replace(/\r\n/g, '\n');

    if (normContent.includes(normOld)) {
        normContent = normContent.replace(normOld, newConditionBlock);
        fs.writeFileSync(filePath, normContent, 'utf8');
        console.log(`SUCCESS: Updated menu_id filtering in ${filePath}`);
    } else {
        console.log(`WARNING: Could not find oldConditionBlock in ${filePath}`);
    }
}

updateBrandRoutesFilter('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
updateBrandRoutesFilter('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');

execSync('node -c routes/brandRoutes.js');
console.log("SYNTAX CHECK: routes/brandRoutes.js PASSED ✅");

execSync('node -c pos-app/server/routes/brandRoutes.js');
console.log("SYNTAX CHECK: pos-app/server/routes/brandRoutes.js PASSED ✅");
