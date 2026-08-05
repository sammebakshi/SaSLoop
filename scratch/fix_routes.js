const fs = require('fs');

function clean(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/const symbol = biz\?\.currency_code === 'USD' \? '[\s\S]*?await whatsappManager/g, "const symbol = biz?.currency_code === 'USD' ? '$' : '₹';\n              await whatsappManager");
    fs.writeFileSync(file, content, 'utf8');
    console.log("Cleaned", file);
}

clean('routes/orderRoutes.js');
clean('pos-app/server/routes/orderRoutes.js');
