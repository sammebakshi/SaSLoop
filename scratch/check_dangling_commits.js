const { execSync } = require('child_process');

const commits = [
    '4ae56a5c6156d4ef6a4473761c79f7bc2bbae3a0',
    '488a1fbb6d20695c606600465e5ab282e55a5a05',
    '50cc67dd0310121309cd6e2da7afcba9d548fc34',
    '9f0c3eab7903f96fce3d12be7da27e2518eb4524',
    'd5aeb461138dd674a3f1d8b484bd9ebf7d97255c',
    '2df6c1a6320361006e81990db9694e6c94e8a452'
];

commits.forEach(c => {
    try {
        console.log(`\nCommit: ${c}`);
        const show = execSync(`git show --name-status ${c}`, { encoding: 'utf8' });
        console.log(show.split('\n').slice(0, 10).join('\n'));
        
        // Check if App.jsx is in the commit
        try {
            const lines = execSync(`git show ${c}:pos-app/src/App.jsx | wc -l`, { encoding: 'utf8' }).trim();
            console.log(`  -> pos-app/src/App.jsx exists! Lines: ${lines}`);
        } catch (e) {
            console.log(`  -> pos-app/src/App.jsx does not exist in this commit.`);
        }
    } catch (e) {
        console.error("Error showing commit:", e.message);
    }
});
