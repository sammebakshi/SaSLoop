const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
console.log('Reading from:', filePath);

if (!fs.existsSync(filePath)) {
  console.error('File does not exist!');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// 1. Define helper functions
const helpers = `
  const checkPosAccess = (moduleName, permissionName) => {
    if (!business) return true;
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return true;

    const posAccess = business?.staff_permissions?.pos_access;
    if (!posAccess) return true;

    const modulePermissions = posAccess[moduleName];
    if (!modulePermissions) return true;

    return modulePermissions[permissionName] !== false;
  };

  const getAllowedCategories = () => {
    if (!business) return categories;
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return categories;

    const posAccess = business?.staff_permissions?.pos_access;
    if (!posAccess) return categories;

    const allowed = posAccess.OrderWindow?.item_categories;
    if (allowed === true || !allowed) return categories;

    return categories.filter(c => c === 'All' || allowed.includes(c));
  };

  const isItemCategoryAllowed = (categoryName) => {
    if (!business) return true;
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return true;

    const posAccess = business?.staff_permissions?.pos_access;
    if (!posAccess) return true;

    const allowed = posAccess.OrderWindow?.item_categories;
    if (allowed === true || !allowed) return true;

    return allowed.includes(categoryName);
  };

  const getAllowedDepartments = () => {
    if (!business) return departments;
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return departments;

    const posAccess = business?.staff_permissions?.pos_access;
    if (!posAccess) return departments;

    const allowed = posAccess.OrderWindow?.table_departments;
    if (allowed === true || !allowed) return departments;

    return departments.filter(d => d === 'All' || allowed.includes(d));
  };

  const isTableDepartmentAllowed = (departmentName) => {
    if (!business) return true;
    const userRole = String(business?.role || '').toLowerCase();
    const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
    if (isSupervisor) return true;

    const posAccess = business?.staff_permissions?.pos_access;
    if (!posAccess) return true;

    const allowed = posAccess.OrderWindow?.table_departments;
    if (allowed === true || !allowed) return true;

    return allowed.includes(departmentName);
  };
`;

const posComponentStart = 'const UniversalPOS = () => {';
if (content.includes(posComponentStart)) {
  console.log('[SUCCESS] Found UniversalPOS definition start');
  // Inject helpers right after component declaration
  content = content.replace(posComponentStart, posComponentStart + helpers);
} else {
  console.error('[ERROR] Could not find UniversalPOS definition start');
  process.exit(1);
}

// 2. Gate Order sidebar tab
const orderIconTarget = `<SidebarIcon id="orderIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11 9H9V2H7V9H5V2H3V9c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7zM21 2h-2c-1.1 0-2 .9-2 2v9h2v9h2V2z"/></svg>} active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setBillingView('tables'); }} label="Order" />`;
const orderIconReplacement = `{checkPosAccess('OrderWindow', 'visible') && (\r\n            <SidebarIcon id="orderIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11 9H9V2H7V9H5V2H3V9c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7zM21 2h-2c-1.1 0-2 .9-2 2v9h2v9h2V2z"/></svg>} active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setBillingView('tables'); }} label="Order" />\r\n          )}`;
const orderIconFallback = orderIconReplacement.replace(/\r\n/g, '\n');

if (content.includes(orderIconTarget)) {
  console.log('[SUCCESS] Gated orderIcon tab');
  content = content.replace(orderIconTarget, orderIconReplacement);
} else {
  // Try with \n instead of \r\n
  const orderIconTargetLF = orderIconTarget.replace(/\r\n/g, '\n');
  if (content.includes(orderIconTargetLF)) {
    console.log('[SUCCESS] Gated orderIcon tab (LF)');
    content = content.replace(orderIconTargetLF, orderIconFallback);
  } else {
    console.error('[WARNING] Could not find orderIcon tab target!');
  }
}

// 3. Gate Live sidebar tab
const liveTrackingIconTarget = `<SidebarIcon id="liveTrackingIcon" isDark={isDark} icon={<Activity size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live" />`;
const liveTrackingIconReplacement = `{checkPosAccess('OrderWindow', 'live_order_tracking') && (\r\n            <SidebarIcon id="liveTrackingIcon" isDark={isDark} icon={<Activity size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live" />\r\n          )}`;
const liveTrackingIconFallback = liveTrackingIconReplacement.replace(/\r\n/g, '\n');

if (content.includes(liveTrackingIconTarget)) {
  console.log('[SUCCESS] Gated liveTrackingIcon tab');
  content = content.replace(liveTrackingIconTarget, liveTrackingIconReplacement);
} else {
  const liveTrackingIconTargetLF = liveTrackingIconTarget.replace(/\r\n/g, '\n');
  if (content.includes(liveTrackingIconTargetLF)) {
    console.log('[SUCCESS] Gated liveTrackingIcon tab (LF)');
    content = content.replace(liveTrackingIconTargetLF, liveTrackingIconFallback);
  } else {
    console.error('[WARNING] Could not find liveTrackingIcon tab target!');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Helpers integrated successfully!');
