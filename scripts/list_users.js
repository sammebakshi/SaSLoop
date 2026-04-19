const pool = require('./db');

async function getUsers() {
    try {
        const res = await pool.query('SELECT id, email, password, role FROM app_users LIMIT 5');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

getUsers();
