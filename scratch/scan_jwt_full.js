const path = require('path');
const fs = require('fs');

const leveldbPath = path.join(process.env.APPDATA, 'sasloop-master-pos-v1.0.1', 'Local Storage', 'leveldb');

function findJWT() {
  if (!fs.existsSync(leveldbPath)) {
    console.log("LevelDB directory not found.");
    return;
  }

  const files = fs.readdirSync(leveldbPath);

  // JWT regex matching header, payload and signature
  const jwtRegex = /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_+/=]+/g;

  for (const file of files) {
    if (file.endsWith('.log') || file.endsWith('.ldb')) {
      const filePath = path.join(leveldbPath, file);
      const content = fs.readFileSync(filePath);
      const contentStr = content.toString('utf8');
      
      const matches = contentStr.match(jwtRegex);
      if (matches) {
        for (const token of matches) {
          // Token must be reasonably long (JWT tokens are usually > 100 chars)
          if (token.length > 100) {
            console.log(`\n🔑 FOUND FULL JWT TOKEN in file: ${file} (length: ${token.length})`);
            console.log(token);
            fs.writeFileSync(path.join(__dirname, 'extracted_token.txt'), token);
            return;
          }
        }
      }
    }
  }
  console.log("No full JWT token found.");
}

findJWT();
