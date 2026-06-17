const db = require('./db');

db.query("SELECT * FROM customers WHERE number = '+917006784791' OR number = '7006784791'", (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Customers Table Rows:", res.rows);
    }
    process.exit(0);
});
