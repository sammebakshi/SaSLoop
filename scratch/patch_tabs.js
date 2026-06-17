const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
let content = fs.readFileSync(filepath, 'utf8');

// Target string is:
//                      {/* Tab Headers */}
//                      <div className={`flex border-b shrink-0 ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar`}>
//                         {[
//                         ].map((tab) => (

const target = '                     {/* Tab Headers */}\n' +
'                     <div className={`flex border-b shrink-0 ${isDark ? \'border-[#30363d] bg-[#161b22]\' : \'bg-slate-50 border-slate-200\'} overflow-x-auto no-scrollbar`}>\r\n' +
'                        {[\r\n' +
'                        ].map((tab) => (';

// Let's print out if we can find a substring in a less strict way using regex:
const regex = /\{\/\*\s*Tab\s+Headers\s*\*\/\}[\s\S]*?<div\s+className=\{\`flex\s+border-b\s+shrink-0\s+\$\{isDark\s*\?\s*'border-\[\#30363d\]\s+bg-\[\#161b22\]'\s*:\s*'bg-slate-50\s+border-slate-200'\}\s+overflow-x-auto\s+no-scrollbar\`\}>[\s\S]*?\[[\s\r\n]*\]\.map\(\(tab\)\s*=>\s*\(/;

if (regex.test(content)) {
  console.log("Found match using regex!");
  
  const replacement = `{/* Tab Headers */}
                     <div className={\`flex border-b shrink-0 \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                        {[
                           { id: 'general', label: 'General', icon: <Settings size={12} />, key: 'general' },
                           { id: 'outlet', label: 'Outlet Settings', icon: <Store size={12} />, key: 'general' },
                           { id: 'printer', label: 'Printers', icon: <Printer size={12} />, key: 'printers' },
                           { id: 'shortcuts', label: 'Shortcuts', icon: <Key size={12} />, key: 'shortcuts' },
                           { id: 'formatting', label: 'Formatting', icon: <Sliders size={12} />, key: 'formatting' },
                           { id: 'profile', label: 'Profile', icon: <User size={12} />, key: 'profile' }
                        ].filter((tab) => {
                           const posAccess = business?.staff_permissions?.pos_access;
                           if (!posAccess) return true;
                           const userRole = String(business?.role || '').toLowerCase();
                           const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
                           if (isSupervisor) return true;
                           return posAccess?.Settings?.[tab.key] !== false;
                        }).map((tab) => (`;
  
  content = content.replace(regex, replacement);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log("Successfully replaced the settings tabs list!");
} else {
  console.log("Regex match not found. Let's do simple search.");
  // Let's print out what is actually there around line 16880:
  const lines = content.split('\n');
  for (let i = 16870; i < 16890; i++) {
    console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
  }
}
