import { Request, Response } from 'express';
import { db } from '../config/db';
import crypto from 'crypto';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<any[]>('SELECT user_id, nama, email, role, created_at FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if email exists
        const [existing] = await db.query<any[]>('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        await db.query(
            'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
            [nama, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !role) {
        return res.status(400).json({ message: 'Nama, Email, and Role are required' });
    }

    try {
        // Check if user exists
        const [users] = await db.query<any[]>('SELECT user_id FROM users WHERE user_id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check duplicate email
        const [existing] = await db.query<any[]>('SELECT user_id FROM users WHERE email = ? AND user_id != ?', [email, id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already used by another user' });
        }

        let query = 'UPDATE users SET nama = ?, email = ?, role = ?';
        let params = [nama, email, role];

        if (password) {
            const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE user_id = ?';
        params.push(id);

        await db.query(query, params);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Check if user has related data (transactions/history)
        // Actually, foreign keys might restrict delete.
        // Ideally we should soft delete or block delete if related data exists. 
        // For now, try delete and catch error.

        await db.query('DELETE FROM users WHERE user_id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete user with existing history/transactions' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
