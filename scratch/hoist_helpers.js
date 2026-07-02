const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

// List of target replacements:
const replacements = [
  {
    target: `  const getStaffPermissions = () => {`,
    replacement: `  function getStaffPermissions() {`
  },
  {
    target: `  const checkBillingPermission = (perm) => {`,
    replacement: `  function checkBillingPermission(perm) {`
  },
  {
    target: `  const checkOldKOTPermission = (perm) => {`,
    replacement: `  function checkOldKOTPermission(perm) {`
  },
  {
    target: `    const checkKOTPermission = (perm) => {`,
    replacement: `    function checkKOTPermission(perm) {`
  },
  {
    target: `    const checkDashboardPermission = (card) => {`,
    replacement: `    function checkDashboardPermission(card) {`
  },
  {
    target: `    const checkSplitBillPermission = (perm) => {`,
    replacement: `    function checkSplitBillPermission(perm) {`
  },
  {
    target: `    const checkCustomerPermission = (perm) => {`,
    replacement: `    function checkCustomerPermission(perm) {`
  },
  {
    target: `    const checkAccountPermission = (perm) => {`,
    replacement: `    function checkAccountPermission(perm) {`
  },
  {
    target: `    const checkOnlineOrderPermission = (perm) => {`,
    replacement: `    function checkOnlineOrderPermission(perm) {`
  },
  {
    target: `    const checkReceiptsPermission = (perm) => {`,
    replacement: `    function checkReceiptsPermission(perm) {`
  },
  {
    target: `  const handleSelectReport = (reportName) => {`,
    replacement: `  function handleSelectReport(reportName) {`
  },
  {
    target: `  const getFilteredReportsList = () => {`,
    replacement: `  function getFilteredReportsList() {`
  },
  {
    target: `  const verifyManagerPin = (pin) => {`,
    replacement: `  function verifyManagerPin(pin) {`
  },
  {
    target: `  const verifyPasscodeAction = (moduleName, permissionName, promptText = "Enter Manager PIN to authorize:") => {`,
    replacement: `  function verifyPasscodeAction(moduleName, permissionName, promptText = "Enter Manager PIN to authorize:") {`
  },
  {
    target: `  const checkBillingPasscode = (perm, promptText) => {`,
    replacement: `  function checkBillingPasscode(perm, promptText) {`
  },
  {
    target: `  const checkOldKOTPasscode = (perm, promptText) => {`,
    replacement: `  function checkOldKOTPasscode(perm, promptText) {`
  },
  {
    target: `  const checkSplitBillPasscode = (perm, promptText) => {`,
    replacement: `  function checkSplitBillPasscode(perm, promptText) {`
  },
  {
    target: `  const checkReceiptsPasscode = (perm, promptText) => {`,
    replacement: `  function checkReceiptsPasscode(perm, promptText) {`
  },
  {
    target: `  const checkMasterPermission = (section, key) => {`,
    replacement: `  function checkMasterPermission(section, key) {`
  }
];

let successCount = 0;
replacements.forEach(r => {
  if (content.includes(r.target)) {
    content = content.replace(r.target, r.replacement);
    successCount++;
  } else {
    console.warn("Warning: Could not find target:", r.target);
  }
});

console.log(`Successfully replaced ${successCount}/${replacements.length} functions.`);
fs.writeFileSync(filePath, content, 'utf8');
