const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/services/api.js');
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/\r\n/g, '\n');

const targetStr = `export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : 'https://backend.sasloop.in';`;

const replacementStr = `export const API_BASE = (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.protocol === "file:" || 
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes("Electron"))
)
    ? "http://localhost:5000"
    : 'https://backend.sasloop.in';`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Success: Updated API_BASE to resolve to http://localhost:5000 when running in Electron/file: protocol.");
} else {
  console.error("Error: Could not find target API_BASE string!");
}
