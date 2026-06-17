const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'components', 'WhatsAppMarketing.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace dark:text-slate-500 with dark:text-slate-400
content = content.replace(/dark:text-slate-500/g, 'dark:text-slate-400');

// Replace dark:text-slate-550 with dark:text-slate-400
content = content.replace(/dark:text-slate-550/g, 'dark:text-slate-400');

// Add dark:text-slate-400 to the line 192 text-slate-450 (which was missing dark state)
content = content.replace('text-slate-450 uppercase font-black', 'text-slate-450 dark:text-slate-400 uppercase font-black');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Color fixes applied successfully to WhatsAppMarketing.jsx");
