const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
let content = fs.readFileSync(filepath, 'utf8');

console.log("Starting dashboard permissions patch...");

// 1. Insert helper functions
const accessLevelsClose = `        ipAddress: true\r\n      };\r\n    }\r\n  });`;
const accessLevelsCloseLF = `        ipAddress: true\n      };\n    }\n  });`;

const helpers = `

  const isModuleAllowed = (moduleName) => {
    if (!business) return true;
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return true;
    
    const storeModules = business?.staff_permissions?.store_modules;
    if (!storeModules) return true;
    
    const mod = storeModules[moduleName];
    return mod?.visible !== false;
  };

  const isTabAllowed = (tabId) => {
    if (!business) return true;
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return true;
    
    const posAccess = business?.staff_permissions?.pos_access;
    
    if (tabId === 'home') {
      return posAccess?.Dashboard?.visible !== false;
    }
    if (tabId === 'sidebarSettings' || tabId === 'settings' || tabId === 'config') {
      return isModuleAllowed("Settings");
    }
    if (tabId === 'analytics') {
      return isModuleAllowed("Reports");
    }
    if (tabId === 'expenses') {
      return !posAccess || posAccess?.ExpenseManagement?.visible !== false;
    }
    if (tabId === 'reservations') {
      return !posAccess || posAccess?.TableReservation?.visible !== false;
    }
    if (tabId === 'crm') {
      return !posAccess || posAccess?.CustomerManagement?.visible !== false;
    }
    if (tabId === 'digital') {
      return isModuleAllowed("Digital Order");
    }
    
    return true;
  };

  const getDashboardAccess = (key) => {
    if (!business) return true;
    
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return true;
    
    const posAccess = business?.staff_permissions?.pos_access;
    if (!posAccess) return true;
    
    const mapping = {
      todaysSale: 'todays_sale',
      totalSale: 'total_sale',
      itemPieChart: 'item_pie_chart',
      barSalesChart: 'bar_sales_chart',
      thisMonthSale: 'this_month_sale',
      lineSalesChart: 'line_sales_chart',
      allSalesAnalysis: 'all_sales_analysis',
      paymentModesChart: 'payment_modes_chart',
      salesAnalysisByDays: 'sales_analysis_by_days',
      ipAddress: 'ip_address'
    };
    
    const dbKey = mapping[key] || key;
    
    if (posAccess?.Dashboard?.visible === false) return false;
    
    const perm = posAccess?.Dashboard?.[dbKey];
    return perm !== false;
  };`;

// Check if helpers already present
if (!content.includes('const getDashboardAccess =')) {
  if (content.includes(accessLevelsClose)) {
    content = content.replace(accessLevelsClose, accessLevelsClose + helpers);
    console.log("Helpers added successfully (CRLF)!");
  } else if (content.includes(accessLevelsCloseLF)) {
    content = content.replace(accessLevelsCloseLF, accessLevelsCloseLF + helpers);
    console.log("Helpers added successfully (LF)!");
  } else {
    // Let's find index of ipAddress: true inside setAccessLevels
    const ipIndex = content.indexOf('ipAddress: true');
    if (ipIndex !== -1) {
      const closeBracketIndex = content.indexOf('});', ipIndex);
      if (closeBracketIndex !== -1) {
        const insertPos = closeBracketIndex + 3;
        content = content.substring(0, insertPos) + helpers + content.substring(insertPos);
        console.log("Helpers added successfully using fallback index!");
      } else {
        console.error("ERROR: Failed to find close bracket after ipAddress!");
      }
    } else {
      console.error("ERROR: Failed to locate accessLevels state end!");
    }
  }
} else {
  console.log("Helpers are already defined.");
}

// 2. Replace dashboard accessLevel checks with getDashboardAccess
content = content.replace(/accessLevels\.todaysSale/g, "getDashboardAccess('todaysSale')");
content = content.replace(/accessLevels\.totalSale/g, "getDashboardAccess('totalSale')");
content = content.replace(/accessLevels\.thisMonthSale/g, "getDashboardAccess('thisMonthSale')");
content = content.replace(/accessLevels\.ipAddress/g, "getDashboardAccess('ipAddress')");
content = content.replace(/accessLevels\.salesAnalysisByDays/g, "getDashboardAccess('salesAnalysisByDays')");
content = content.replace(/accessLevels\.paymentModesChart/g, "getDashboardAccess('paymentModesChart')");
content = content.replace(/accessLevels\.itemPieChart/g, "getDashboardAccess('itemPieChart')");
content = content.replace(/accessLevels\.lineSalesChart/g, "getDashboardAccess('lineSalesChart')");
content = content.replace(/accessLevels\.barSalesChart/g, "getDashboardAccess('barSalesChart')");

console.log("Dashboard widget gating replaced with getDashboardAccess!");

// 3. Gate Sidebar tabs
// We will search for sidebar icons and wrap them in isTabAllowed
const sidebarReplacements = [
  {
    target: `<SidebarIcon id="dashboardIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Dash" />`,
    replacement: `{isTabAllowed('home') && <SidebarIcon id="dashboardIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Dash" />}`
  },
  {
    target: `<SidebarIcon id="liveTrackingIcon" isDark={isDark} icon={<Activity size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live" />`,
    replacement: `{isTabAllowed('live') && <SidebarIcon id="liveTrackingIcon" isDark={isDark} icon={<Activity size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live" />}`
  },
  {
    target: `<SidebarIcon id="digitalOrdersIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7.06-3.6-7.55-7.55H7c.55 0 1 .45 1 1v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.34c2.93.95 5.17 3.53 5.76 6.69l-1.86.65z"/></svg>} active={activeTab === 'digital'} onClick={() => setActiveTab('digital')} label="Digital" />`,
    replacement: `{isTabAllowed('digital') && <SidebarIcon id="digitalOrdersIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7.06-3.6-7.55-7.55H7c.55 0 1 .45 1 1v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.34c2.93.95 5.17 3.53 5.76 6.69l-1.86.65z"/></svg>} active={activeTab === 'digital'} onClick={() => setActiveTab('digital')} label="Digital" />}`
  },
  {
    target: `<SidebarIcon id="receiptIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>} active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} label="Receipt" />`,
    replacement: `{isTabAllowed('receipts') && <SidebarIcon id="receiptIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>} active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} label="Receipt" />}`
  },
  {
    target: `<SidebarIcon id="whatsappIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5"><path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.462 3.42 1.272 4.872L2 22l5.286-1.392c1.398.762 2.994 1.194 4.722 1.194 5.532 0 10.014-4.482 10.014-10.014C22.022 6.48 17.544 2 12.012 2zm6.072 14.238c-.246.696-1.428 1.368-1.956 1.422-.486.054-1.026.078-3.084-.774-2.634-1.086-4.326-3.762-4.458-3.936-.132-.18-1.062-1.41-1.062-2.694 0-1.284.666-1.914.906-2.172.24-.258.528-.324.708-.324.18 0 .36 0 .522.006.168.006.396-.066.618.474.228.558.78 1.902.846 2.04.066.138.108.3.018.48-.09.18-.198.312-.294.426-.096.114-.204.24-.294.342-.09.108-.186.222-.078.402.108.18.48.792 1.026 1.278.702.624 1.296.816 1.482.906.18.09.288.078.396-.048.108-.126.462-.54.588-.726.12-.186.246-.156.414-.096.168.06 1.068.504 1.248.594.18.09.3.138.342.216.042.078.042.444-.204 1.14z"/></svg>} active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} label="WhatsApp" />`,
    replacement: `{isTabAllowed('whatsapp') && <SidebarIcon id="whatsappIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5"><path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.462 3.42 1.272 4.872L2 22l5.286-1.392c1.398.762 2.994 1.194 4.722 1.194 5.532 0 10.014-4.482 10.014-10.014C22.022 6.48 17.544 2 12.012 2zm6.072 14.238c-.246.696-1.428 1.368-1.956 1.422-.486.054-1.026.078-3.084-.774-2.634-1.086-4.326-3.762-4.458-3.936-.132-.18-1.062-1.41-1.062-2.694 0-1.284.666-1.914.906-2.172.24-.258.528-.324.708-.324.18 0 .36 0 .522.006.168.006.396-.066.618.474.228.558.78 1.902.846 2.04.066.138.108.3.018.48-.09.18-.198.312-.294.426-.096.114-.204.24-.294.342-.09.108-.186.222-.078.402.108.18.48.792 1.026 1.278.702.624 1.296.816 1.482.906.18.09.288.078.396-.048.108-.126.462-.54.588-.726.12-.186.246-.156.414-.096.168.06 1.068.504 1.248.594.18.09.3.138.342.216.042.078.042.444-.204 1.14z"/></svg>} active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} label="WhatsApp" />}`
  },
  {
    target: `<SidebarIcon id="expensesIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M5 20h14v-2H5V5H3v15c0 1.1.9 2 2 2zM7 9h10v2H7V9zm0 4h10v2H7v-2z"/></svg>} active={activeTab === 'expenses'} onClick={() => { setActiveTab('expenses'); setIsExpenseModalOpen(true); }} label="Expense" />`,
    replacement: `{isTabAllowed('expenses') && <SidebarIcon id="expensesIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M5 20h14v-2H5V5H3v15c0 1.1.9 2 2 2zM7 9h10v2H7V9zm0 4h10v2H7v-2z"/></svg>} active={activeTab === 'expenses'} onClick={() => { setActiveTab('expenses'); setIsExpenseModalOpen(true); }} label="Expense" />}`
  },
  {
    target: `<SidebarIcon id="allreportsIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M4 6h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8z"/></svg>} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Reports" />`,
    replacement: `{isTabAllowed('analytics') && <SidebarIcon id="allreportsIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M4 6h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8z"/></svg>} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Reports" />}`
  },
  {
    target: `active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Config" />`,
    replacement: `active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Config" />`
  },
  {
    target: `<SidebarIcon id="settingsButton" isDark={isDark} icon={<Sliders size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Old Config" />`,
    replacement: `{isTabAllowed('settings') && <SidebarIcon id="settingsButton" isDark={isDark} icon={<Sliders size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Old Config" />}`
  },
  {
    target: `<SidebarIcon id="sidebarSettingsIcon" isDark={isDark} icon={<Settings size={18} className="text-current" />} active={isSettingsModalOpen} onClick={() => setIsSettingsModalOpen(true)} label="Settings" />`,
    replacement: `{isTabAllowed('sidebarSettings') && <SidebarIcon id="sidebarSettingsIcon" isDark={isDark} icon={<Settings size={18} className="text-current" />} active={isSettingsModalOpen} onClick={() => setIsSettingsModalOpen(true)} label="Settings" />}`
  }
];

sidebarReplacements.forEach(item => {
  if (content.includes(item.target)) {
    content = content.replace(item.target, item.replacement);
    console.log(`Sidebar tab gated: ${item.target.substring(0, 40)}...`);
  } else {
    // Try without spaces or normalize newlines
    console.warn(`WARNING: Sidebar target not found: ${item.target.substring(0, 40)}`);
  }
});

// Specially handle Config button wrap
const configTarget = `<SidebarIcon id="newConfigButton" isDark={isDark} icon={\n            <div className="relative w-7 h-7 text-current">\n              <Settings size={18} className="absolute top-0 left-0" fill="none" stroke="currentColor" strokeWidth={3}/>\n              <Settings size={14} className="absolute bottom-0 right-0" fill="none" stroke="currentColor" strokeWidth={3}/>\n            </div>\n          } active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Config" />`;

const configReplacement = `{isTabAllowed('config') && <SidebarIcon id="newConfigButton" isDark={isDark} icon={\n            <div className="relative w-7 h-7 text-current">\n              <Settings size={18} className="absolute top-0 left-0" fill="none" stroke="currentColor" strokeWidth={3}/>\n              <Settings size={14} className="absolute bottom-0 right-0" fill="none" stroke="currentColor" strokeWidth={3}/>\n            </div>\n          } active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Config" />}`;

const contentLF = content.replace(/\r\n/g, '\n');
const configTargetLF = configTarget.replace(/\r\n/g, '\n');
const configReplacementLF = configReplacement.replace(/\r\n/g, '\n');

if (contentLF.includes(configTargetLF)) {
  content = contentLF.replace(configTargetLF, configReplacementLF);
  console.log("Config button gated successfully!");
} else {
  console.warn("WARNING: Config button target not found!");
}

// 4. Update handleLogin to fetch profile immediately
const loginTarget = `      const res = await authService.posLogin(username, password);
      localStorage.setItem('pos_token', res.data.token);
      setIsAuthenticated(true);`;

const loginReplacement = `      const res = await authService.posLogin(username, password);
      localStorage.setItem('pos_token', res.data.token);
      // Fetch profile immediately
      try {
        const profile = await authService.getProfile();
        if (profile && profile.data) {
          localStorage.setItem('pos_profile', JSON.stringify(profile.data));
          setBusiness(profile.data);
          
          // Switch default active tab to billing if home dashboard is disabled
          const posAccess = profile.data?.staff_permissions?.pos_access;
          const userRole = String(profile.data?.role || '').toLowerCase();
          const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
          if (!isSupervisor && posAccess?.Dashboard?.visible === false) {
            setActiveTab('billing');
          }
        }
      } catch (e) {
        console.error("Failed to load profile immediately after login:", e);
      }
      setIsAuthenticated(true);`;

const contentLF2 = content.replace(/\r\n/g, '\n');
const loginTargetLF = loginTarget.replace(/\r\n/g, '\n');
const loginReplacementLF = loginReplacement.replace(/\r\n/g, '\n');

if (contentLF2.includes(loginTargetLF)) {
  content = contentLF2.replace(loginTargetLF, loginReplacementLF);
  console.log("handleLogin profile fetch added!");
} else {
  console.error("ERROR: loginTarget not found!");
}

// Write back with CRLF
const finalCRLF = content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
fs.writeFileSync(filepath, finalCRLF, 'utf8');
console.log("Dashboard permissions patch completed!");
