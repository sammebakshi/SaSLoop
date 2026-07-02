const path = require('path');
const fs = require('fs');

const leveldbPath = path.join(process.env.APPDATA, 'sasloop-master-pos-v1.0.1', 'Local Storage', 'leveldb');

function extractToken() {
  if (!fs.existsSync(leveldbPath)) {
    console.log("LevelDB directory not found.");
    return;
  }

  const files = fs.readdirSync(leveldbPath);

  for (const file of files) {
    if (file.endsWith('.log') || file.endsWith('.ldb')) {
      const filePath = path.join(leveldbPath, file);
      const content = fs.readFileSync(filePath);
      const contentStr = content.toString('utf8');
      
      const tokenIndex = contentStr.indexOf('pos_token');
      if (tokenIndex !== -1) {
        console.log(`\n🔍 Found pos_token in file: ${file}`);
        // Extract string after pos_token. LocalStorage values are usually wrapped in some characters.
        // Let's print the next 500 characters to locate the JWT token.
        const chunk = contentStr.substring(tokenIndex, tokenIndex + 500);
        console.log("Snippet:", chunk);

        // JWT tokens start with eyJ
        const jwtMatch = chunk.match(/eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/);
        if (jwtMatch) {
          console.log("\n🔑 EXTRACTED JWT TOKEN:", jwtMatch[0]);
          fs.writeFileSync(path.join(__dirname, 'extracted_token.txt'), jwtMatch[0]);
          return;
        }
      }
    }
  }
  console.log("Could not extract JWT token automatically.");
}

extractToken();
