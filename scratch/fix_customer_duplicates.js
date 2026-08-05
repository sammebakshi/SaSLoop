const fs = require('fs');

// 1. Update routes/crmRoutes.js to prevent duplicate rows from LEFT JOIN marketing_contacts
function fixCrmRoutes(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const oldJoin = 'LEFT JOIN marketing_contacts mc ON mc.user_id = c.user_id AND mc.phone_number = c.number';
    const newJoin = 'LEFT JOIN (SELECT user_id, phone_number, bool_or(is_blocked) as is_blocked FROM marketing_contacts GROUP BY user_id, phone_number) mc ON mc.user_id = c.user_id AND mc.phone_number = c.number';

    if (content.includes(oldJoin)) {
        content = content.replace(oldJoin, newJoin);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated SQL join in ${filePath}`);
    } else {
        console.log(`oldJoin not found in ${filePath}`);
    }
}

fixCrmRoutes('routes/crmRoutes.js');
fixCrmRoutes('pos-app/server/routes/crmRoutes.js');

// 2. Update App.jsx to deduplicate customerDb values by phone number
function fixAppJsx(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Helper definition for unique customers
    const oldFetchMap = `            if (clean10) {
              customersMap[clean10] = custObj;
              customersMap[\`+91\${clean10}\`] = custObj;
            }
            if (cleanDigits) {
              customersMap[\`+\${cleanDigits}\`] = custObj;
            }`;

    // Helper function to get unique customers array
    const helperCode = `const getUniqueCustomers = (db) => Array.from(new Map(Object.values(db || {}).map(c => [c.phone || c.customer_number || c.number, c])).values());`;
    
    if (!content.includes('getUniqueCustomers =')) {
        content = content.replace('const App = () => {', 'const App = () => {\n  ' + helperCode);
    }

    content = content.replaceAll('Object.values(customerDb)', 'getUniqueCustomers(customerDb)');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated customerDb deduplication in ${filePath}`);
}

fixAppJsx('pos-app/src/App.jsx');
