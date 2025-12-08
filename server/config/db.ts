import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'craftcycle',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const db = pool.promise();

export const checkConnection = async () => {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('Database connected successfully');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};
