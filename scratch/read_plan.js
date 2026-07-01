const fs = require('fs');
const path = require('path');

const planPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\869abdd3-0e6d-4369-aae8-a14c86e78045\\implementation_plan.md';

if (fs.existsSync(planPath)) {
    console.log(fs.readFileSync(planPath, 'utf8'));
} else {
    console.log(`Plan not found at: ${planPath}`);
}
