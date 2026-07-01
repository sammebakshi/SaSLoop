const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'apply_remaining_permissions.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

const lines = scriptContent.split('\n');

// Direct index replacement with correct escaping of backticks for target 20
lines[827] = '    if (!window.confirm(\\`Are you sure you want to delete "\\${itemName}"?\\`)) return;\`,';
lines[833] = '    if (!window.confirm(\\`Are you sure you want to delete "\\${itemName}"?\\`)) return;\`,';

// Direct index replacement with correct escaping of backticks and spacing for target 24
lines[878] = '`                    {/* Tab Headers */}';
lines[879] = '                    <div className={\\`flex border-b shrink-0 \\${isDark ? \'border-[#30363d] bg-[#161b22]\' : \'bg-slate-50 border-slate-200\'} overflow-x-auto no-scrollbar\\`}>';
lines[880] = '                       {[';
lines[881] = '                          { id: \'general\', label: \'General\', icon: <Settings size={12} /> },';
lines[882] = '                          { id: \'outlet\', label: \'Outlet Settings\', icon: <Store size={12} /> },';
lines[883] = '                          { id: \'printer\', label: \'Printers\', icon: <Printer size={12} /> },';
lines[884] = '                          { id: \'shortcuts\', label: \'Shortcuts\', icon: <Key size={12} /> },';
lines[885] = '                          { id: \'formatting\', label: \'Formatting\', icon: <Sliders size={12} /> },';
lines[886] = '                          { id: \'profile\', label: \'Profile\', icon: <User size={12} /> }';
lines[887] = '                       ].map((tab) => (\`,';
lines[888] = '`                    {/* Tab Headers */}';
lines[889] = '                    <div className={\\`flex border-b shrink-0 \\${isDark ? \'border-[#30363d] bg-[#161b22]\' : \'bg-slate-50 border-slate-200\'} overflow-x-auto no-scrollbar\\`}>';
lines[890] = '                       {getFilteredSettingsTabs().map((tab) => (\`,';

fs.writeFileSync(scriptPath, lines.join('\n'), 'utf8');
console.log("Helper script targets 20 and 24 successfully updated!");
