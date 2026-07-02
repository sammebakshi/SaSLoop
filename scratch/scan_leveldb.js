const path = require('path');
const fs = require('fs');

// We can read the LevelDB files by using a simple text/regex scan or writing a small script.
// Since LevelDB is a binary format, we can read the .log and .ldb files in the directory
// and extract JSON objects or string keys/values.
const leveldbPath = path.join(process.env.APPDATA, 'sasloop-master-pos-v1.0.1', 'Local Storage', 'leveldb');

function scanLevelDB() {
  if (!fs.existsSync(leveldbPath)) {
    console.log("LevelDB directory not found.");
    return;
  }

  const files = fs.readdirSync(leveldbPath);
  console.log("Found files:", files);

  for (const file of files) {
    if (file.endsWith('.log') || file.endsWith('.ldb')) {
      const filePath = path.join(leveldbPath, file);
      const content = fs.readFileSync(filePath);
      
      // Look for strings containing pos_recent_orders, pos_local_orders or transaction details
      const contentStr = content.toString('utf8');
      
      if (contentStr.includes('PLAIN OMELETTE') || contentStr.includes('Plain Omelette')) {
        console.log(`\n🔍 Found Omelette reference in file: ${file}`);
        // Print surrounding context
        const idx = contentStr.indexOf('PLAIN OMELETTE');
        console.log(contentStr.substring(Math.max(0, idx - 200), Math.min(contentStr.length, idx + 1000)));
      }
      
      if (contentStr.includes('pos_recent_orders')) {
        console.log(`\n🔍 Found pos_recent_orders key in file: ${file}`);
      }
    }
  }
}

scanLevelDB();
