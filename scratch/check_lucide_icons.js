const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'components', 'WhatsAppMarketing.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// Find all imports from lucide-react
const importRegex = /import\s+{[^}]+}\s+from\s+["']lucide-react["']/g;
const importMatch = content.match(importRegex);

const importedIcons = new Set();
if (importMatch) {
  importMatch.forEach(imp => {
    const iconsPart = imp.slice(imp.indexOf('{') + 1, imp.indexOf('}'));
    iconsPart.split(',').forEach(icon => {
      const name = icon.trim();
      if (name) importedIcons.add(name);
    });
  });
}

console.log("Imported icons:", Array.from(importedIcons));

// Find all JSX components starting with uppercase letters
const jsxRegex = /<([A-Z][a-zA-Z0-9]*)/g;
const jsxTags = new Set();
let match;
while ((match = jsxRegex.exec(content)) !== null) {
  jsxTags.add(match[1]);
}

// Exclude built-in React / non-lucide things we know
const exclude = new Set([
  'React', 'AnimatePresence', 'DashboardView', 'CampaignsView', 'ChatsView', 'Fragment'
]);

const missing = [];
jsxTags.forEach(tag => {
  if (!importedIcons.has(tag) && !exclude.has(tag)) {
    // Check if it's used in statusConfig (as an identifier/variable, not JSX tag)
    missing.push(tag);
  }
});

// Also search content for icon names used as variables (e.g. icon: Activity)
// We check if the word is in the code
const possibleIcons = [
  'Activity', 'XCircle', 'AlertCircle', 'Clock', 'CheckCircle2', 'CheckCheck', 'MessageSquare',
  'Search', 'RefreshCw', 'Filter', 'Plus', 'Target', 'Layers', 'Database', 'Globe', 'Share2',
  'BarChart3', 'UserCheck', 'Edit3', 'Trash2', 'TrendingUp', 'Download', 'ChevronRight', 'X',
  'Calendar', 'Check', 'Eye', 'Sliders', 'Play', 'Pause', 'Bot', 'ShieldAlert', 'Sparkles',
  'FileText', 'Send', 'User', 'Wifi', 'WifiOff', 'LayoutDashboard', 'Megaphone', 'Users'
];

possibleIcons.forEach(icon => {
  const wordRegex = new RegExp(`\\b${icon}\\b`);
  if (wordRegex.test(content) && !importedIcons.has(icon)) {
    if (!missing.includes(icon)) missing.push(icon);
  }
});

console.log("Missing/unimported icons used:", missing);
