const fs = require('fs');
const path = require('path');

const backupsDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) {
  console.log("No backups dir found.");
  process.exit(0);
}

const files = fs.readdirSync(backupsDir);
files.forEach(file => {
  if (file.endsWith('.sql')) {
    const filePath = path.join(backupsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n=== CHECKING BACKUP FILE: ${file} ===`);
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('COPY public.app_users') || line.includes('INSERT INTO app_users') || line.includes('INSERT INTO public.app_users')) {
        console.log(`Line ${idx + 1}: ${line.substring(0, 200)}`);
        // print next 10 lines
        for (let i = 1; i <= 10; i++) {
          if (lines[idx + i]) console.log(`  +${i}: ${lines[idx + i].substring(0, 300)}`);
        }
      }
    });
  }
});
