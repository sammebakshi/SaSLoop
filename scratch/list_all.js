const pool = require("../db");

async function search() {
    try {
        const res = await pool.query("SELECT * FROM app_users");
        console.log("TOTAL USERS:", res.rows.length);
        res.rows.forEach(u => {
            console.log(`User ID: ${u.id}, Name: ${u.name}, BizName: ${u.business_name}, Email: ${u.email}`);
        });

        const res2 = await pool.query("SELECT * FROM restaurants");
        console.log("TOTAL RESTAURANTS:", res2.rows.length);
        res2.rows.forEach(r => {
            console.log(`Rest ID: ${r.id}, Name: ${r.name}, BizType: ${r.business_type}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

search();
