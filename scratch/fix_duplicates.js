
const fs = require('fs');
const path = 'c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx';
let content = fs.readFileSync(path, 'utf8');

// Use regex to find and remove the second declaration of scanning
const lines = content.split('\n');
let count = 0;
const filteredLines = lines.filter((line) => {
    if (line.includes('const [scanning, setScanning] = useState(false);')) {
        count++;
        return count === 1; // Keep only the first one
    }
    return true;
});

// Also remove the old handleAiScan
const finalContent = filteredLines.join('\n');
fs.writeFileSync(path, finalContent);
console.log("Removed duplicate scanning state!");
