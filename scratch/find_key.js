const fs = require('fs');
try {
    const fileContent = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/production_settings.txt', 'utf8');
    const lines = fileContent.split('\n');
    const lastLine = lines[lines.length - 2] || lines[lines.length - 1];
    const data = JSON.parse(lastLine.trim());
    console.log('print_upi_qr in DB settings:', data.settings.hasOwnProperty('print_upi_qr'));
    console.log('print_upi_qr value:', data.settings.print_upi_qr);
    console.log('printUpiQr in DB settings:', data.settings.hasOwnProperty('printUpiQr'));
    console.log('printUpiQr value:', data.settings.printUpiQr);
} catch (e) {
    console.error(e);
}
