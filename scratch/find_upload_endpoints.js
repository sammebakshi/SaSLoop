const fs = require('fs');

function searchUploadEndpoints(filePath) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, i) => {
        if (l.includes('image_url') || l.includes('upload') || l.includes('image') || l.includes('multer')) {
            console.log(`[${filePath}:${i+1}] ${l.trim()}`);
        }
    });
}

searchUploadEndpoints('routes/brandRoutes.js');
searchUploadEndpoints('routes/posRoutes.js');
searchUploadEndpoints('server.js');
