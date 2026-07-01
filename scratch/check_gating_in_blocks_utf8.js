const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const text = fs.readFileSync(filePath, 'utf8');

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

let out = '';
out += "Detected positions:\n";
out += `fetchOrdersForMode: ${fetchOrdersStart}-${fetchOrdersEnd}\n`;
out += `filteredOrders: ${filteredOrdersStart}-${filteredOrdersEnd}\n`;
out += `logoutFlow: ${logoutFlowStart}-${logoutFlowEnd}\n`;
out += `calculateStats: ${calculateStatsStart}-${calculateStatsEnd}\n`;
out += `fetchDashboardStatsFromServer: ${fetchDashboardStart}-${fetchDashboardEnd}\n`;
out += `handleLogin: ${loginStart}-${loginEnd}\n\n`;

function checkSubString(name, startLine, endLine) {
  const subLines = lines.slice(startLine - 1, endLine);
  const blockText = subLines.join('\n');
  const hasGating = blockText.includes('check') || blockText.includes('Permission') || blockText.includes('getStaff');
  out += `Block ${name} (${startLine}-${endLine}): hasGating=${hasGating}\n`;
  if (hasGating) {
    subLines.forEach((line, idx) => {
      if (line.includes('check') || line.includes('Permission') || line.includes('getStaff')) {
        out += `  Line ${startLine + idx}: ${line.trim()}\n`;
      }
    });
  }
}

checkSubString('fetchOrdersForMode', fetchOrdersStart, fetchOrdersEnd);
checkSubString('filteredOrders', filteredOrdersStart, filteredOrdersEnd);
checkSubString('logoutFlow', logoutFlowStart, logoutFlowEnd);
checkSubString('calculateStats', calculateStatsStart, calculateStatsEnd);
checkSubString('fetchDashboardStatsFromServer', fetchDashboardStart, fetchDashboardEnd);
checkSubString('handleLogin', loginStart, loginEnd);

fs.writeFileSync(path.join(__dirname, 'check_results_utf8.txt'), out, 'utf8');
console.log("Wrote results to check_results_utf8.txt");
