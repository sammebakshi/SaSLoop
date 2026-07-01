const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'apply_remaining_permissions.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Replace the long handlePrintKOT parameter list in both target and replacement
scriptContent = scriptContent.replace(
  /handlePrintKOT\(cart, selectedTable\.table_name, bNo, 'NEW', selectedTable\?\.original_order_type \|\| 'DINE_IN', tableCustomers\[selectedTable\.id\]\);/g,
  `handlePrintKOT(cart, selectedTable.table_name, bNo);`
);

const lines = scriptContent.split('\n');

// Set precise line contents with correct indentation and escaping matching App.jsx
lines[588] = '                        }}';
lines[589] = '                        className={\\`flex-1 py-2.5 rounded text-[11px] font-bold transition-all active:scale-95 border \\${isDark ? \'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white\' : \'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white\'}\\`}';
lines[590] = '                      >';
lines[591] = '                        Print & Save';
lines[592] = '                      </button>';
lines[593] = '                    </div>\`,';

fs.writeFileSync(scriptPath, lines.join('\n'), 'utf8');
console.log("Helper script successfully updated using precise double-escaped line strings!");
