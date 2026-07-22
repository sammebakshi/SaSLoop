const fs = require('fs');
const { execSync } = require('child_process');

console.log("=== 1. FIXING brandRoutes.js PARAMETER SYNTAX ===");

function fixBrandRoutes(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace literal `m.id = ${params.length}` with `m.id = $` + params.length
    if (content.includes('m.id = ${params.length}')) {
        content = content.replace('m.id = ${params.length}', 'm.id = $' + '{params.length}');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`FIXED parameter syntax in ${filePath}`);
    } else {
        console.log(`Already fixed or missing target string in ${filePath}`);
    }
}

fixBrandRoutes('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
fixBrandRoutes('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');

execSync('node -c routes/brandRoutes.js');
console.log("SYNTAX CHECK: routes/brandRoutes.js PASSED ✅");

execSync('node -c pos-app/server/routes/brandRoutes.js');
console.log("SYNTAX CHECK: pos-app/server/routes/brandRoutes.js PASSED ✅");

console.log("=== 2. UPDATING MasterMenuManager.jsx DROPDOWN TO CLEAN DYNAMIC MENUS ===");
const mmmPath = 'c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/MasterMenuManager.jsx';
let mmmContent = fs.readFileSync(mmmPath, 'utf8');

const oldSelectRegex = /<select[\s\S]*?value=\{selectedMenuFilter\}[\s\S]*?<\/select>/;

const newSelectCode = `<select
                                value={selectedMenuFilter}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedMenuFilter(val);
                                    fetchData(val);
                                }}
                                className="bg-transparent text-[10px] font-bold text-indigo-600 uppercase outline-none min-w-[170px]"
                            >
                                <option value="all">All Menus (POS + Digital)</option>
                                {menus.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.menu_name} ({m.is_pos_default ? 'POS Default' : m.is_digital_default || m.is_digital ? 'Digital Default' : 'Custom Menu'})
                                    </option>
                                ))}
                            </select>`;

if (oldSelectRegex.test(mmmContent)) {
    mmmContent = mmmContent.replace(oldSelectRegex, newSelectCode);
    fs.writeFileSync(mmmPath, mmmContent, 'utf8');
    console.log("MasterMenuManager.jsx dropdown updated to clean dynamic menus! ✅");
} else {
    console.log("WARNING: Could not match select block in MasterMenuManager.jsx");
}
