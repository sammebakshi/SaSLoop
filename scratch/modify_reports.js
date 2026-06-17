const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../pos-app/src/components/reports');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace API_BASE import
    content = content.replace(/import API_BASE from ["']\.\.\/config["'];?/g, 'import { API_BASE } from "../../services/api";');
    
    // Replace localStorage token
    content = content.replace(/localStorage\.getItem\(["']token["']\)/g, 'localStorage.getItem("pos_token")');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
