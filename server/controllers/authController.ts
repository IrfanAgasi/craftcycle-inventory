import { Request, Response } from 'express';
import { db } from '../config/db';
import crypto from 'crypto';
import { User } from '../types';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [users] = await db.query<any[]>('SELECT * FROM users WHERE email = ? AND is_deleted = 0', [email]);

        console.log('--- Login Attempt ---');
        console.log('Email:', email);

        if (users.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        console.log('User found:', user.email);

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        console.log('Input Password:', password);
        console.log('Calculated Hash:', hashedPassword);
        console.log('Stored Hash:    ', user.password);

        if (hashedPassword !== user.password) {
            console.log('Hash Mismatch!');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
