const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

// 1. Remove config and business state declarations from their original place
const originalStateBlock = `  const [config, setConfig] = useState({ currency: 'Rs', tax_rate: 0, business_type: 'RESTAURANT' });
  const [business, setBusiness] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });`;

if (content.includes(originalStateBlock)) {
  content = content.replace(originalStateBlock, '');
  console.log("Removed config and business states from original location.");
} else {
  console.error("Error: Could not find original state block!");
  process.exit(1);
}

// 2. Insert them at the top of UniversalPOS
const insertionTarget = `  const [billingView, setBillingView] = useState('tables');`;
const insertionReplacement = `  const [config, setConfig] = useState({ currency: 'Rs', tax_rate: 0, business_type: 'RESTAURANT' });
  const [business, setBusiness] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [billingView, setBillingView] = useState('tables');`;

if (content.includes(insertionTarget)) {
  content = content.replace(insertionTarget, insertionReplacement);
  console.log("Successfully inserted config and business states at the top of the component.");
} else {
  console.error("Error: Could not find insertion target!");
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
