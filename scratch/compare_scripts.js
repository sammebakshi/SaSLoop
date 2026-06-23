const fs = require('fs');

const f1 = fs.readFileSync('scratch/apply_permissions_final.js', 'utf8');
const f2 = fs.readFileSync('scratch/apply_remaining_permissions.js', 'utf8');

const regex = /replaceExactlyOnce\([\s\S]*?,\s*['"`](.*?)['"`]\s*\)/g;
let m;
console.log('apply_permissions_final:');
while ((m = regex.exec(f1)) !== null) {
  console.log('  -', m[1]);
}

console.log('\napply_remaining_permissions:');
regex.lastIndex = 0;
while ((m = regex.exec(f2)) !== null) {
  console.log('  -', m[1]);
}
