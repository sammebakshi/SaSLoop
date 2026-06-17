const fs = require('fs');
const path = require('path');

function convertPngToIco(pngPath, icoPath) {
    console.log(`Reading PNG from: ${pngPath}`);
    const pngBuffer = fs.readFileSync(pngPath);
    console.log(`PNG Size: ${pngBuffer.length} bytes`);

    // Create header (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type (1 for ICO)
    header.writeUInt16LE(1, 4); // Count (1 image)

    // Create directory entry (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(0, 0);      // Width (0 = 256px)
    entry.writeUInt8(0, 1);      // Height (0 = 256px)
    entry.writeUInt8(0, 2);      // Color Palette
    entry.writeUInt8(0, 3);      // Reserved
    entry.writeUInt16LE(1, 4);   // Color Planes
    entry.writeUInt16LE(32, 6);  // Bits per Pixel
    entry.writeUInt32LE(pngBuffer.length, 8); // Size of PNG
    entry.writeUInt32LE(22, 12); // Offset (6 header + 16 entry = 22)

    // Combine
    const icoBuffer = Buffer.concat([header, entry, pngBuffer]);
    
    console.log(`Writing ICO to: ${icoPath}`);
    fs.writeFileSync(icoPath, icoBuffer);
    console.log('Done!');
}

const buildDir = path.join(__dirname, 'build');
convertPngToIco(path.join(buildDir, 'icon.png'), path.join(buildDir, 'icon.ico'));
