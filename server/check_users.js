const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'craftcycle_inventory'
        });

        const [rows] = await connection.execute('SELECT * FROM users');
        fs.writeFileSync('users_dump.json', JSON.stringify(rows, null, 2));
        await connection.end();
    } catch (error) {
        fs.writeFileSync('users_dump.json', JSON.stringify({ error: error.message }));
    }
}

check();
