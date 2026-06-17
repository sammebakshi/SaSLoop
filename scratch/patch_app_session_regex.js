const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF to simplify matching
const normalized = content.replace(/\r\n/g, '\n');
let updated = normalized;

// 1. Combined View Grid status override
// We search for:
//   let status = tableStatuses[table.id] || 'AVAILABLE';
//   const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;
//   if (activeBillCount > 0 && status === 'AVAILABLE') {
//     status = 'SAVED';
//   }
const combinedRegex = /(\s*)let status = tableStatuses\[table\.id\] \|\| 'AVAILABLE';\s*\n(\s*)const activeBillCount = \(tableBills\[table\.id\] \|\| \[\]\)\.filter\(item => !item\.isCancelled\)\.length;\s*\n(\s*)if \(activeBillCount > 0 && status === 'AVAILABLE'\) \{\s*\n(\s*)status = 'SAVED';\s*\n(\s*)\}/;

if (combinedRegex.test(updated)) {
  updated = updated.replace(combinedRegex, (match, s1, s2, s3, s4, s5) => {
    console.log("Found Combined View Grid pattern!");
    return `${s1}let status = tableStatuses[table.id] || 'AVAILABLE';\n${s2}const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;\n${s3}if (activeBillCount > 0 && status === 'AVAILABLE') {\n${s4}  status = 'SAVED';\n${s3}}\n${s3}if (activeBillCount === 0 && status !== 'ORDERING') {\n${s4}  status = 'AVAILABLE';\n${s3}}`;
  });
} else {
  console.log("WARNING: Combined View Grid pattern not matched by regex!");
}

// 2. Separate View Grid status override (contains empty lines)
const separateRegex = /(\s*)let status = tableStatuses\[table\.id\] \|\| 'AVAILABLE';\s*\n(\s*)const activeBillCount = \(tableBills\[table\.id\] \|\| \[\]\)\.filter\(item => !item\.isCancelled\)\.length;\s*\n\s*\n(\s*)if \(activeBillCount > 0 && status === 'AVAILABLE'\) \{\s*\n\s*\n(\s*)status = 'SAVED';\s*\n\s*\n(\s*)\}/;

if (separateRegex.test(updated)) {
  updated = updated.replace(separateRegex, (match, s1, s2, s3, s4, s5) => {
    console.log("Found Separate View Grid pattern!");
    // Clean up empty lines and return consistent spacing
    return `${s1}let status = tableStatuses[table.id] || 'AVAILABLE';\n${s2}const activeBillCount = (tableBills[table.id] || []).filter(item => !item.isCancelled).length;\n\n${s3}if (activeBillCount > 0 && status === 'AVAILABLE') {\n\n${s4}  status = 'SAVED';\n\n${s3}}\n${s3}if (activeBillCount === 0 && status !== 'ORDERING') {\n${s4}  status = 'AVAILABLE';\n${s3}}`;
  });
} else {
  console.log("WARNING: Separate View Grid pattern not matched by regex!");
}

// Write the file back
if (updated !== normalized) {
  const finalContent = content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log("SUCCESS: Replaced remaining grid overrides successfully!");
} else {
  console.log("ERROR: No modifications made to App.jsx!");
}
