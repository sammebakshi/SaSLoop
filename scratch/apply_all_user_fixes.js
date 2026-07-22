const fs = require('fs');
const { execSync } = require('child_process');

console.log("=== 1. FIXING orderRoutes.js DATE SANITIZATION ===");
const orderRoutesPath = 'c:/Users/Sajad/Desktop/SaSLoop/routes/orderRoutes.js';
let orderRoutesContent = fs.readFileSync(orderRoutesPath, 'utf8');

// Replace in POST /
orderRoutesContent = orderRoutesContent.replace(
    /pre_order_scheduled_date \|\| null,/g,
    `(pre_order_scheduled_date && pre_order_scheduled_date !== '') ? pre_order_scheduled_date : null,`
);
orderRoutesContent = orderRoutesContent.replace(
    /pre_order_scheduled_time \|\| null,/g,
    `(pre_order_scheduled_time && pre_order_scheduled_time !== '') ? pre_order_scheduled_time : null,`
);
orderRoutesContent = orderRoutesContent.replace(
    /created_at \|\| null/g,
    `(created_at && created_at !== '') ? created_at : null`
);

fs.writeFileSync(orderRoutesPath, orderRoutesContent, 'utf8');
execSync('node -c routes/orderRoutes.js');
console.log("orderRoutes.js syntax check: PASSED ✅");

console.log("=== 2. FIXING MasterMenuManager.jsx MENU FILTER & BADGES ===");
const mmmPath = 'c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/MasterMenuManager.jsx';
let mmmContent = fs.readFileSync(mmmPath, 'utf8');

// Replace menu filter dropdown
const oldDropdown = `<option value="all">All Menus (POS + Digital)</option>`;
const newDropdown = `<option value="all">All Menus (POS + Digital)</option>
                                <option value="pos_only">POS Menu Only</option>
                                <option value="digital_only">Digital Menu Only</option>`;

if (!mmmContent.includes(`value="pos_only"`)) {
    mmmContent = mmmContent.replace(oldDropdown, newDropdown);
}

// Replace Menu Source badge
const oldBadge = `<td className="px-4 py-4 text-[11px] font-bold text-indigo-600 uppercase">
       <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[9px]">
           {item.menu_name || 'Standard Menu'}
       </span>
    </td>`;

const newBadge = `<td className="px-4 py-4 text-[11px] font-bold uppercase">
       {item.is_digital || item.is_digital_default || (item.menu_name && item.menu_name.toLowerCase().includes('digi')) ? (
           <span className="px-2.5 py-1 rounded bg-purple-50 border border-purple-200 text-purple-700 text-[9.5px] font-black tracking-wider shadow-sm flex items-center gap-1 w-max">
               📱 DIGITAL MENU ({item.menu_name || 'Digital'})
           </span>
       ) : (
           <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9.5px] font-black tracking-wider shadow-sm flex items-center gap-1 w-max">
               🖥️ POS MENU ({item.menu_name || 'POS Default'})
           </span>
       )}
    </td>`;

if (mmmContent.includes(oldBadge)) {
    mmmContent = mmmContent.replace(oldBadge, newBadge);
}

fs.writeFileSync(mmmPath, mmmContent, 'utf8');
console.log("MasterMenuManager.jsx updated ✅");

console.log("=== 3. FIXING pos-app/src/App.jsx WHATSAPP CLICK & UNREAD BADGE ===");
const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// Update SidebarIcon to support badge
const oldSidebarIcon = `const SidebarIcon = ({ icon, active, onClick, label, id, isDark }) => (
  <button id={id} onClick={onClick} className={\`w-full h-[58px] flex flex-col items-center justify-center transition-all relative border-b group \${isDark ? 'border-[#30363d]' : 'border-slate-100'} \${active ? (isDark ? 'bg-[#21262d] text-white' : 'bg-[#ccebe1] text-[#2f3542]') : (isDark ? 'text-[#c9d1d9] hover:bg-white/5 hover:text-white' : 'text-[#2f3542] hover:bg-slate-100')}\`}>
    <div className={\`\${active ? 'scale-105 text-current' : 'scale-100 text-current'} transition-all flex items-center justify-center [&>svg]:w-[28px] [&>svg]:h-[28px] [&>div.relative]:w-7 [&>div.relative]:h-7\`}>{icon}</div>
    {/* Tooltip on Hover */}
    <div className={\`absolute left-full ml-2 px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 \${isDark ? 'bg-[#21262d] text-white border border-[#30363d]' : 'bg-white text-slate-700 border border-slate-200 shadow-md'}\`}>
      {label}
    </div>
  </button>
);`;

const newSidebarIcon = `const SidebarIcon = ({ icon, active, onClick, label, id, isDark, badge }) => (
  <button id={id} onClick={onClick} className={\`w-full h-[58px] flex flex-col items-center justify-center transition-all relative border-b group \${isDark ? 'border-[#30363d]' : 'border-slate-100'} \${active ? (isDark ? 'bg-[#21262d] text-white' : 'bg-[#ccebe1] text-[#2f3542]') : (isDark ? 'text-[#c9d1d9] hover:bg-white/5 hover:text-white' : 'text-[#2f3542] hover:bg-slate-100')}\`}>
    <div className={\`\${active ? 'scale-105 text-current' : 'scale-100 text-current'} transition-all flex items-center justify-center [&>svg]:w-[28px] [&>svg]:h-[28px] [&>div.relative]:w-7 [&>div.relative]:h-7\`}>{icon}</div>
    {badge > 0 && (
      <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-lg border border-white animate-pulse">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
    {/* Tooltip on Hover */}
    <div className={\`absolute left-full ml-2 px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 \${isDark ? 'bg-[#21262d] text-white border border-[#30363d]' : 'bg-white text-slate-700 border border-slate-200 shadow-md'}\`}>
      {label}
    </div>
  </button>
);`;

if (appContent.includes(oldSidebarIcon)) {
    appContent = appContent.replace(oldSidebarIcon, newSidebarIcon);
}

// Update whatsappIcon sidebar item onClick to use handleTabClick
const oldWaIcon = `<SidebarIcon id="whatsappIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5"><path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.462 3.42 1.272 4.872L2 22l5.286-1.392c1.398.762 2.994 1.194 4.722 1.194 5.532 0 10.014-4.482 10.014-10.014C22.022 6.48 17.544 2 12.012 2zm6.072 14.238c-.246.696-1.428 1.368-1.956 1.422-.486.054-1.026.078-3.084-.774-2.634-1.086-4.326-3.762-4.458-3.936-.132-.18-1.062-1.41-1.062-2.694 0-1.284.666-1.914.906-2.172.24-.258.528-.324.708-.324.18 0 .36 0 .522.006.168.006.396-.066.618.474.228.558.78 1.902.846 2.04.066.138.108.3.018.48-.09.18-.198.312-.294.426-.096.114-.204.24-.294.342-.09.108-.186.222-.078.402.108.18.48.792 1.026 1.278.702.624 1.296.816 1.482.906.18.09.288.078.396-.048.108-.126.462-.54.588-.726.12-.186.246-.156.414-.096.168.06 1.068.504 1.248.594.18.09.3.138.342.216.042.078.042.444-.204 1.14z"/></svg>} active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} label="WhatsApp" />`;

const newWaIcon = `<SidebarIcon id="whatsappIcon" isDark={isDark} badge={waUnreadCount} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5"><path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.462 3.42 1.272 4.872L2 22l5.286-1.392c1.398.762 2.994 1.194 4.722 1.194 5.532 0 10.014-4.482 10.014-10.014C22.022 6.48 17.544 2 12.012 2zm6.072 14.238c-.246.696-1.428 1.368-1.956 1.422-.486.054-1.026.078-3.084-.774-2.634-1.086-4.326-3.762-4.458-3.936-.132-.18-1.062-1.41-1.062-2.694 0-1.284.666-1.914.906-2.172.24-.258.528-.324.708-.324.18 0 .36 0 .522.006.168.006.396-.066.618.474.228.558.78 1.902.846 2.04.066.138.108.3.018.48-.09.18-.198.312-.294.426-.096.114-.204.24-.294.342-.09.108-.186.222-.078.402.108.18.48.792 1.026 1.278.702.624 1.296.816 1.482.906.18.09.288.078.396-.048.108-.126.462-.54.588-.726.12-.186.246-.156.414-.096.168.06 1.068.504 1.248.594.18.09.3.138.342.216.042.078.042.444-.204 1.14z"/></svg>} active={activeTab === 'whatsapp'} onClick={() => handleTabClick('whatsapp', () => setActiveTab('whatsapp'))} label="WhatsApp" />`;

if (appContent.includes(oldWaIcon)) {
    appContent = appContent.replace(oldWaIcon, newWaIcon);
}

// Add waUnreadCount state if missing
if (!appContent.includes('const [waUnreadCount, setWaUnreadCount]')) {
    appContent = appContent.replace(
        'const [activeTab, setActiveTab] = useState',
        'const [waUnreadCount, setWaUnreadCount] = useState(0);\n  const [activeTab, setActiveTab] = useState'
    );
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log("App.jsx updated ✅");
