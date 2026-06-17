const fs = require("fs");
const path = require("path");

const files = [
  path.join(__dirname, "../SaSLoop-dashboard/build/index.html"),
  path.join(__dirname, "../dist/index.html")
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const stat = fs.statSync(f);
    console.log(`${f}: modified at ${stat.mtime}`);
  } else {
    console.log(`${f}: does not exist`);
  }
});
