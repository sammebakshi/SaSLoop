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

const findSettingsActiveTabClick = `                       {getFilteredSettingsTabs().map((tab) => (
                          <button
                             key={tab.id}
                             onClick={() => {
                                setSettingsActiveTab(tab.id);
                             }}`;

const replaceSettingsActiveTabClick = `                       {getFilteredSettingsTabs().map((tab) => (
                          <button
                             key={tab.id}
                             onClick={() => {
                                if (tab.id === 'general') {
                                   const access = getStaffPermissions()?.pos_access?.Settings;
                                   if (access?.general_passcode === true) {
                                      const pin = prompt("Enter Manager PIN to access General Settings:");
                                      if (pin === null) return;
                                      if (!verifyManagerPin(pin)) {
                                         toast.error("Invalid Manager PIN/Passcode!");
                                         return;
                                      }
                                   }
                                }
                                setSettingsActiveTab(tab.id);
                             }}`;

replaceExact(findSettingsActiveTabClick, replaceSettingsActiveTabClick, 'Settings Tab General Gating');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Settings General tab gating script completed!');
