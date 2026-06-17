const XLSX = require('xlsx');
const path = 'C:\\Users\\Sajad\\Downloads\\New folder (3)\\Atlantic Sample Menu Format.xlsx';
try {
    const workbook = XLSX.readFile(path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, {header: 1});
    console.log("HEADERS:", data[0]);
    console.log("SAMPLE ROW 1:", data[1]);
} catch (e) {
    console.error(e.message);
}
process.exit(0);
