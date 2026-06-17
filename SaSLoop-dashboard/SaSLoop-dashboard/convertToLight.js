const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Sajad/Desktop/SaSLoop-new/backend/SaSLoop-dashboard/src/components';
const dir2 = 'c:/Users/Sajad/Desktop/SaSLoop-new/backend/SaSLoop-dashboard/src/pages';

const replacements = [
  // Backgrounds
  { from: /bg-\[\#0B0F19\]/g, to: "bg-white" },
  { from: /bg-\[\#0F1423\]/g, to: "bg-slate-50/50" },
  { from: /bg-\[\#131A2B\]/g, to: "bg-white" },
  { from: /bg-slate-900\/40/g, to: "bg-slate-50" },
  { from: /bg-slate-900\/30/g, to: "bg-slate-50" },
  { from: /bg-slate-900/g, to: "bg-white" },
  { from: /hover:bg-slate-800(?!\/)/g, to: "hover:bg-slate-100" },
  { from: /hover:bg-slate-700/g, to: "hover:bg-slate-100" },
  { from: /bg-slate-800\/20/g, to: "bg-slate-50" },
  { from: /bg-slate-800\/30/g, to: "bg-slate-100" },
  { from: /bg-slate-800(?!\/)/g, to: "bg-white" },
  { from: /bg-slate-800\/50/g, to: "bg-slate-100/50" },
  { from: /bg-\[\#0F172A\]/g, to: "bg-slate-50" },
  
  // Borders
  { from: /border-slate-800\/80/g, to: "border-slate-200" },
  { from: /border-slate-800/g, to: "border-slate-200" },
  { from: /border-slate-700\/50/g, to: "border-slate-300" },
  { from: /border-slate-700/g, to: "border-slate-200" },
  
  // Text
  { from: /text-slate-100/g, to: "text-slate-800" },
  { from: /text-slate-200/g, to: "text-slate-700" },
  { from: /text-slate-300/g, to: "text-slate-600" },
  
  // Custom button styling fixes (we don't want to turn text-white into black on green buttons)
  // Instead of replacing all text-white, we target specific ones.
  { from: /text-white(?! font-bold)/g, to: "text-slate-900" },
  { from: /hover:text-white/g, to: "hover:text-slate-900" },
  
  // Modals & specifics
  { from: /bg-slate-950\/90/g, to: "bg-slate-900/60" },
  { from: /bg-slate-950\/80/g, to: "bg-slate-900/60" },
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      if (file === 'Login.jsx') continue; // Don't tamper with login screen colors
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const prevContent = content;
      replacements.forEach(r => {
        content = content.replace(r.from, r.to);
      });
      
      // Specifically fix buttons that might have had text-slate-900 changed accidentally
      content = content.replace(/bg-emerald-500 hover:bg-emerald-600 text-slate-900/g, "bg-emerald-500 hover:bg-emerald-600 text-white");
      content = content.replace(/bg-slate-100 hover:bg-slate-200 text-slate-700/g, "bg-slate-100 hover:bg-slate-200 text-slate-700");
      content = content.replace(/px-6 py-2 bg-white hover:bg-slate-100 text-slate-900/g, "px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800");

      if (content !== prevContent) {
        fs.writeFileSync(fullPath, content);
        console.log("Updated", fullPath);
      }
    }
  }
}

processDir(dir);
processDir(dir2);
