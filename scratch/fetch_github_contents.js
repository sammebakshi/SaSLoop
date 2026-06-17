const https = require('https');

const options = {
    hostname: 'api.github.com',
    path: '/repos/sammebakshi/SaSLoop/contents/',
    headers: {
        'User-Agent': 'NodeJS'
    }
};

https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const list = JSON.parse(data);
            if (Array.isArray(list)) {
                console.log("Root files/folders in remote github repository:");
                list.forEach(item => {
                    console.log(`  - ${item.name} (${item.type})`);
                });
            } else {
                console.log("Unexpected API response:", data);
            }
        } catch (e) {
            console.error("Parse error:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Request error:", err.message);
});
