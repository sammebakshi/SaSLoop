const https = require('https');

const options = {
    hostname: 'api.github.com',
    path: '/users/sammebakshi/repos',
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
                console.log("Repositories of user sammebakshi:");
                list.forEach(item => {
                    console.log(`  - ${item.name} (Clone URL: ${item.clone_url})`);
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
