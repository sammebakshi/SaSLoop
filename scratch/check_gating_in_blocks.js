const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const text = fs.readFileSync(filePath, 'utf8');

// We will look at:
// 1. fetchOrdersForMode (lines 2816-2889)
// 2. filteredOrders React.useMemo (lines 3137-3160)
// 3. handleLogoutFlow keysToRemove / state resetting (lines 4313-4415)
// 4. calculateStats (lines 6800-6898)
// 5. fetchDashboardStatsFromServer (lines 6899-6930)
// 6. handleLogin (lines 6930-6980)

function checkSubString(name, startLine, endLine) {
  const lines = text.split('\n').slice(startLine - 1, endLine);
  const blockText = lines.join('\n');
  const hasGating = blockText.includes('check') || blockText.includes('Permission') || blockText.includes('getStaff');
  console.log(`Block ${name} (${startLine}-${endLine}): hasGating=${hasGating}`);
  if (hasGating) {
    // Print lines containing gating
    lines.forEach((line, idx) => {
      if (line.includes('check') || line.includes('Permission') || line.includes('getStaff')) {
        console.log(`  Line ${startLine + idx}: ${line.trim()}`);
      }
    });
  }
}

// Find lines dynamically in the current App.jsx
const lines = text.split('\n');
let fetchOrdersStart = -1, fetchOrdersEnd = -1;
let filteredOrdersStart = -1, filteredOrdersEnd = -1;
let logoutFlowStart = -1, logoutFlowEnd = -1;
let calculateStatsStart = -1, calculateStatsEnd = -1;
let fetchDashboardStart = -1, fetchDashboardEnd = -1;
let loginStart = -1, loginEnd = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const fetchOrdersForMode = async')) {
    fetchOrdersStart = i + 1;
  }
  if (fetchOrdersStart !== -1 && fetchOrdersEnd === -1 && line.includes('const filteredOrders = React.useMemo')) {
    fetchOrdersEnd = i;
  }
  if (line.includes('const filteredOrders = React.useMemo')) {
    filteredOrdersStart = i + 1;
  }
  if (filteredOrdersStart !== -1 && filteredOrdersEnd === -1 && line.includes('const handleOldKOTPrint')) {
    filteredOrdersEnd = i;
  }
  if (line.includes('// 2. Collect all keys to remove first to avoid index shifting')) {
    logoutFlowStart = i + 1;
  }
  if (logoutFlowStart !== -1 && logoutFlowEnd === -1 && line.includes('toast.info("Local sales and shift data successfully cleared.")')) {
    logoutFlowEnd = i + 2;
  }
  if (line.includes('const calculateStats = (orders) =>')) {
    calculateStatsStart = i + 1;
  }
  if (calculateStatsStart !== -1 && calculateStatsEnd === -1 && line.includes('const fetchDashboardStatsFromServer = async')) {
    calculateStatsEnd = i;
  }
  if (line.includes('const fetchDashboardStatsFromServer = async')) {
    fetchDashboardStart = i + 1;
  }
  if (fetchDashboardStart !== -1 && fetchDashboardEnd === -1 && line.includes('const handleLogin = async')) {
    fetchDashboardEnd = i;
  }
  if (line.includes('const handleLogin = async')) {
    loginStart = i + 1;
  }
  if (loginStart !== -1 && loginEnd === -1 && line.includes('const handleAdminAction =')) {
    loginEnd = i;
  }
}

console.log("Detected positions:");
console.log(`fetchOrdersForMode: ${fetchOrdersStart}-${fetchOrdersEnd}`);
console.log(`filteredOrders: ${filteredOrdersStart}-${filteredOrdersEnd}`);
console.log(`logoutFlow: ${logoutFlowStart}-${logoutFlowEnd}`);
console.log(`calculateStats: ${calculateStatsStart}-${calculateStatsEnd}`);
console.log(`fetchDashboardStatsFromServer: ${fetchDashboardStart}-${fetchDashboardEnd}`);
console.log(`handleLogin: ${loginStart}-${loginEnd}`);

checkSubString('fetchOrdersForMode', fetchOrdersStart, fetchOrdersEnd);
checkSubString('filteredOrders', filteredOrdersStart, filteredOrdersEnd);
checkSubString('logoutFlow', logoutFlowStart, logoutFlowEnd);
checkSubString('calculateStats', calculateStatsStart, calculateStatsEnd);
checkSubString('fetchDashboardStatsFromServer', fetchDashboardStart, fetchDashboardEnd);
checkSubString('handleLogin', loginStart, loginEnd);
