const fs = require('fs');
const readline = require('readline');

const logPath = 'C:/Users/Sajad/.gemini/antigravity-ide/brain/f6290d96-6827-4397-8034-a378a3d29f80/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error("Log file not found at " + logPath);
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

let lineCount = 0;
rl.on('line', (line) => {
  lineCount++;
  if (line.includes('dial-spin-sequence') && line.includes('TransitionSplashScreen') && line.includes('svg')) {
    console.log(`Found match on line ${lineCount}`);
    
    // Let's parse this JSON line
    try {
      const data = JSON.parse(line);
      // The code could be in content, tool_calls, or tool outputs
      // Let's recursively search for any string that starts with "const TransitionSplashScreen" and has "dial-spin-sequence"
      const foundStrings = [];
      
      function searchObj(obj) {
        if (typeof obj === 'string') {
          if (obj.includes('const TransitionSplashScreen =') && obj.includes('dial-spin-sequence')) {
            foundStrings.push(obj);
          }
        } else if (typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            searchObj(obj[key]);
          }
        }
      }
      
      searchObj(data);
      
      console.log(`Found ${foundStrings.length} matching strings in JSON line.`);
      foundStrings.forEach((str, idx) => {
        // If it contains escaped quotes, clean them up or parse if it was double-escaped
        let cleaned = str;
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          try {
            cleaned = JSON.parse(cleaned);
          } catch (e) {}
        }
        
        // Unescape typical escapes if it is still escaped
        if (cleaned.includes('\\n')) {
          cleaned = cleaned.replace(/\\n/g, '\n')
                           .replace(/\\"/g, '"')
                           .replace(/\\'/g, "'")
                           .replace(/\\\\/g, '\\')
                           .replace(/\\t/g, '\t');
        }
        
        fs.writeFileSync(`c:/Users/Sajad/Desktop/SaSLoop/scratch/dial_from_log_${lineCount}_${idx}.jsx`, cleaned, 'utf8');
        console.log(`Wrote extracted code to scratch/dial_from_log_${lineCount}_${idx}.jsx`);
      });
    } catch (err) {
      console.error(`Error parsing JSON line ${lineCount}:`, err.message);
    }
  }
});

rl.on('close', () => {
  console.log("Finished scanning log file.");
});
