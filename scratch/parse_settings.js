const fs = require('fs');

try {
    const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/profile_response_dump.txt', 'utf8');
    const match = content.match(/{"id":3,"name":"Wasim",.*?-- END HTTP/s);
    if (match) {
        const jsonStr = match[0].replace(/-- END HTTP.*/, '').trim();
        const data = JSON.parse(jsonStr);
        const settings = data.business_details.settings;
        console.log('--- SETTINGS KEYS ---');
        console.log(Object.keys(settings).sort());
        console.log('---------------------');
        console.log('print_upi_qr:', settings.print_upi_qr);
        console.log('printUpiQr:', settings.printUpiQr);
    } else {
        console.log('Could not find profile JSON in dump');
    }
} catch (e) {
    console.error(e);
}
