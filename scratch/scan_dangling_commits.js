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
    const list = execSync(`git ls-tree -r ${c}`, { encoding: 'utf8' });
    if (list.includes('App.jsx')) {
      console.log(`Commit ${c} contains App.jsx!`);
      // Let's get size of App.jsx in this commit
      const show = execSync(`git show ${c}:pos-app/src/App.jsx`, { encoding: 'utf8' });
      console.log(`  Lines: ${show.split('\n').length}`);
    } else {
      console.log(`Commit ${c} does NOT contain App.jsx.`);
    }
  } catch (err) {
    console.error(`Error checking commit ${c}:`, err.message);
  }
});
