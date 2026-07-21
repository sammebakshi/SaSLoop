const os = require('os');

function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

console.log("Local Network IP:", getLocalNetworkIp());
console.log("All IPv4 Interfaces:", JSON.stringify(os.networkInterfaces(), null, 2));
