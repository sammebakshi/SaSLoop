const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const data = [
    { 'Sr No.': 1, 'Table Name': 'T1', 'Max Person': 2, 'Is Active': 'Yes' },
    { 'Sr No.': 2, 'Table Name': 'T2', 'Max Person': 4, 'Is Active': 'Yes' },
    { 'Sr No.': 3, 'Table Name': 'VIP-1', 'Max Person': 6, 'Is Active': 'Yes' }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, "Tables");

const dir = path.join(__dirname, '../SaSLoop-dashboard/public/samples');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

XLSX.writeFile(wb, path.join(dir, 'table_upload_sample.xlsx'));
console.log("Sample file created successfully!");
