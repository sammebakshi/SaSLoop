const fs = require('fs');
const path = require('path');

const brainPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';
if (!fs.existsSync(brainPath)) {
  console.log('Brain directory does not exist at:', brainPath);
  process.exit(1);
}

const dirs = fs.readdirSync(brainPath);
console.log(`Found ${dirs.length} items in brain path.`);

const conversationDirs = [];
dirs.forEach(name => {
  const fullPath = path.join(brainPath, name);
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    // Check if there is a transcript log
    const logPath = path.join(fullPath, '.system_generated', 'logs', 'transcript.jsonl');
    const hasLog = fs.existsSync(logPath);
    let logSize = 0;
    let logMtime = null;
    if (hasLog) {
      const logStat = fs.statSync(logPath);
      logSize = logStat.size;
      logMtime = logStat.mtime;
    }
    conversationDirs.push({
      name,
      mtime: stat.mtime,
      hasLog,
      logSize,
      logMtime
    });
  }
});

// Sort by modification time of the log (if exists) or the folder, descending
conversationDirs.sort((a, b) => {
  const timeA = a.logMtime || a.mtime;
  const timeB = b.logMtime || b.mtime;
  return timeB - timeA;
});

console.log('\nRecent Conversation Folders (sorted by modification time):');
conversationDirs.slice(0, 15).forEach((d, idx) => {
  const timeStr = (d.logMtime || d.mtime).toISOString();
  console.log(`${idx + 1}. Folder: ${d.name}`);
  console.log(`   Modified: ${timeStr}`);
  console.log(`   Has log: ${d.hasLog ? 'YES' : 'NO'} (${d.logSize} bytes)`);
});
