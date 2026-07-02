const path = require('path');
const fs = require('fs');

const leveldbPath = path.join(process.env.APPDATA, 'sasloop-master-pos-v1.0.1', 'Local Storage', 'leveldb');

function findJWT() {
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
      
      const jwtMatch = contentStr.match(/eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/);
      if (jwtMatch) {
        console.log(`\n🔑 FOUND JWT TOKEN in file: ${file}`);
        console.log("Token:", jwtMatch[0]);
        fs.writeFileSync(path.join(__dirname, 'extracted_token.txt'), jwtMatch[0]);
        return;
      }
    }
  }
  console.log("No JWT token found in LevelDB.");
}

findJWT();
