const pool = require('../db');
pool.query("SELECT * FROM conversation_sessions WHERE customer_number = '917006089744'")
    .then(res => {
        console.log("SESSION_ROW:", JSON.stringify(res.rows[0], null, 2));
        process.exit();
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
