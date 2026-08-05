const fs = require('fs');

function fix(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  c = c.replaceAll("const symbol = biz?.currency_code === 'USD' ? '\n\n\n\n : '₹';", "const symbol = biz?.currency_code === 'USD' ? '$' : '₹';");
  c = c.replace(/const symbol = biz\?\.currency_code === 'USD' \? '[\s\S]*?: '₹';/g, "const symbol = biz?.currency_code === 'USD' ? '$' : '₹';");
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed', file);
}

fix('routes/orderRoutes.js');
fix('pos-app/server/routes/orderRoutes.js');
