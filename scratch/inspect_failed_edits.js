const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
files.forEach(f => {
  if (f.endsWith('.json') && f !== 'package.json') {
    try {
      const content = fs.readFileSync(path.join('scratch', f), 'utf8');
      if (content.toLowerCase().includes('coupon') || content.toLowerCase().includes('iscouponmodalopen')) {
        console.log(`JSON file: ${f} (${content.length} bytes) matches`);
      }
    } catch (e) {
      // ignore
    }
  }
});
