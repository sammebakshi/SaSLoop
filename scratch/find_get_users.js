const fs = require('fs');
const content = fs.readFileSync('routes/brandRoutes.js', 'utf8');

const lines = content.split('\n');
let found = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('router.get("/users"') || lines[i].includes("router.get('/users'") || lines[i].includes('router.get("/"') || lines[i].includes("router.get('/')")) {
        // Double check if it's the main get users route
        if (lines[i].includes('users')) {
            found = i;
            break;
        }
    }
}

if (found !== -1) {
    console.log(`Found route on line ${found+1}`);
    for (let j = Math.max(0, found - 5); j <= Math.min(lines.length - 1, found + 60); j++) {
        console.log(`${j+1}: ${lines[j]}`);
    }
} else {
    console.log("Could not find exact router.get('/users')");
}
