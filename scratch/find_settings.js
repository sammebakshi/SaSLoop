const fs = require('fs');
const content = fs.readFileSync('./pos-app/src/App.jsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('WhatsApp E-Bill') || line.includes('whatsappEbillEnabled') || line.includes('showVirtualKeyboard')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
