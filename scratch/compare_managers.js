const fs = require('fs');
const path = require('path');
// const diff = require('diff'); // if available, else we write simple comparison

const legacyPath = path.join(__dirname, '..', '_legacy_root_files', 'whatsappManager.js');
const currentPath = path.join(__dirname, '..', 'whatsappManager.js');

if (!fs.existsSync(legacyPath) || !fs.existsSync(currentPath)) {
  console.log("One of the manager files does not exist.");
  process.exit(0);
}

const legacyContent = fs.readFileSync(legacyPath, 'utf8');
const currentContent = fs.readFileSync(currentPath, 'utf8');

const legacyLines = legacyContent.split('\n');
const currentLines = currentContent.split('\n');

console.log(`Legacy: ${legacyLines.length} lines`);
console.log(`Current: ${currentLines.length} lines`);

// Simple line-by-line comparison or printing functions added/changed
console.log("=== COMPARING MAIN FUNCTIONS ===");
const findFunctions = (content) => {
  const matches = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const match = line.match(/(const|function)\s+(\w+)\s*=\s*(async\s*)?\(/);
    if (match) {
      matches.push({ name: match[2], line: idx + 1 });
    }
  });
  return matches;
};

const legacyFuncs = findFunctions(legacyContent);
const currentFuncs = findFunctions(currentContent);

console.log("\nFunctions in Legacy:");
legacyFuncs.forEach(f => console.log(`- ${f.name} (Line ${f.line})`));

console.log("\nFunctions in Current:");
currentFuncs.forEach(f => console.log(`- ${f.name} (Line ${f.line})`));
