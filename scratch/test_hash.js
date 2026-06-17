const bcrypt = require("bcrypt");

const hash = "$2b$10$WtooL62OcMgmtA7.gP/JGOc/7u/MA/k3vdIbfkFDf9fceGqwZii5i";

const candidates = ["1234", "nasir", "nasirpos", "user123", "nasirpos123", "nasir123", "admin", "admin123", "KFC", "kfcnorth", "kfc123"];

async function check() {
    for (const c of candidates) {
        const isMatch = await bcrypt.compare(c, hash);
        if (isMatch) {
            console.log("FOUND MATCH:", c);
            return;
        }
    }
    console.log("NO MATCH FOUND");
}

check();
