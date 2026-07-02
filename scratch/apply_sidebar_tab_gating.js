const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced: ${label}`);
  } else {
    console.error(`[FAILED] Target not found for: ${label}`);
  }
}

// 1. Dashboard
replaceExact(
  `active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Dash" />`,
  `active={activeTab === 'home'} onClick={() => handleTabClick('home', () => setActiveTab('home'))} label="Dash" />`,
  'Dashboard Tab Gating'
);

// 2. Order/Billing
replaceExact(
  `active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setBillingView('tables'); }} label="Order" />`,
  `active={activeTab === 'billing'} onClick={() => handleTabClick('billing', () => { setActiveTab('billing'); setBillingView('tables'); })} label="Order" />`,
  'Order Tab Gating'
);

// 3. Live Order
replaceExact(
  `active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live" />`,
  `active={activeTab === 'live'} onClick={() => handleTabClick('live', () => setActiveTab('live'))} label="Live" />`,
  'Live Tab Gating'
);

// 4. Digital Order
replaceExact(
  `active={activeTab === 'digital'} onClick={() => setActiveTab('digital')} label="Digital" />`,
  `active={activeTab === 'digital'} onClick={() => handleTabClick('digital', () => setActiveTab('digital'))} label="Digital" />`,
  'Digital Tab Gating'
);

// 5. Receipts
replaceExact(
  `active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} label="Receipt" />`,
  `active={activeTab === 'receipts'} onClick={() => handleTabClick('receipts', () => setActiveTab('receipts'))} label="Receipt" />`,
  'Receipts Tab Gating'
);

// 6. Expense
replaceExact(
  `active={activeTab === 'expenses'} onClick={() => { setActiveTab('expenses'); setIsExpenseModalOpen(true); }} label="Expense" />`,
  `active={activeTab === 'expenses'} onClick={() => handleTabClick('expenses', () => { setActiveTab('expenses'); setIsExpenseModalOpen(true); })} label="Expense" />`,
  'Expense Tab Gating'
);

// 7. Reports
replaceExact(
  `active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Reports" />`,
  `active={activeTab === 'analytics'} onClick={() => handleTabClick('analytics', () => setActiveTab('analytics'))} label="Reports" />`,
  'Reports Tab Gating'
);

// 8. Config
replaceExact(
  `active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Config" />`,
  `active={activeTab === 'config'} onClick={() => handleTabClick('config', () => setActiveTab('config'))} label="Config" />`,
  'Config Tab Gating'
);

// 9. Old Config
replaceExact(
  `active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Old Config" />`,
  `active={activeTab === 'settings'} onClick={() => handleTabClick('settings', () => setActiveTab('settings'))} label="Old Config" />`,
  'Old Config Tab Gating'
);

// 10. Sidebar Settings Icon
const findSidebarSettings = `             <SidebarIcon id="sidebarSettingsIcon" isDark={isDark} icon={<Settings size={18} className="text-current" />} active={isSettingsModalOpen} onClick={() => {
                setIsSettingsModalOpen(true);
                const allowedTabs = getFilteredSettingsTabs();
                if (allowedTabs.length > 0) {
                   setSettingsActiveTab(allowedTabs[0].id);
                }
             }} label="Settings" />`;

const replaceSidebarSettings = `             <SidebarIcon id="sidebarSettingsIcon" isDark={isDark} icon={<Settings size={18} className="text-current" />} active={isSettingsModalOpen} onClick={() => {
                handleTabClick('settings', () => {
                   setIsSettingsModalOpen(true);
                   const allowedTabs = getFilteredSettingsTabs();
                   if (allowedTabs.length > 0) {
                      setSettingsActiveTab(allowedTabs[0].id);
                   }
                });
             }} label="Settings" />`;

replaceExact(findSidebarSettings, replaceSidebarSettings, 'Sidebar Settings Icon Gating');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Sidebar tab click gating applied successfully!');
