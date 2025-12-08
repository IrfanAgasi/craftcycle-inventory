import { db } from './config/db';
import crypto from 'crypto';

const users = [
    {
        nama: 'Admin',
        email: 'admin@craftcycle.id',
        password: 'admin123',
        role: 'admin'
    },
    {
        nama: 'Staff Gudang',
        email: 'staff@craftcycle.id',
        password: 'staff123',
        role: 'staff'
    },
    {
        nama: 'Manager Produksi',
        email: 'manager@craftcycle.id',
        password: 'manager123',
        role: 'manager'
    }
];

const seedUsers = async () => {
    try {
        console.log('Updating users...');

        for (const user of users) {
            const hashedPassword = crypto.createHash('md5').update(user.password).digest('hex');

            // Check if user exists by role or old email (approximate match to update)
            // Or simpler: just update where role matches, or insert if not exists.
            // Let's try to update by role to preserve IDs if possible (good for history), 
            // otherwise delete and insert (bad for history).
            // Better: Update where role = X.

            const [rows] = await db.query<any[]>('SELECT * FROM users WHERE role = ?', [user.role]);

            if (rows.length > 0) {
                // Update existing
                await db.query(
                    'UPDATE users SET nama = ?, email = ?, password = ? WHERE role = ?',
                    [user.nama, user.email, hashedPassword, user.role]
                );
                console.log(`Updated ${user.role}`);
            } else {
                // Insert new
                await db.query(
                    'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
                    [user.nama, user.email, hashedPassword, user.role]
                );
                console.log(`Inserted ${user.role}`);
            }
        }

        console.log('Demo users updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
