import { Request, Response } from 'express';
import { db } from '../config/db';
import crypto from 'crypto';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const isDeleted = status === 'deleted' ? 1 : 0;

        const [rows] = await db.query<any[]>(
            'SELECT user_id, nama, email, role, created_at FROM users WHERE is_deleted = ?',
            [isDeleted]
        );
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
        const [users] = await db.query<any[]>('SELECT user_id FROM users WHERE user_id = ? AND is_deleted = 0', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [existing] = await db.query<any[]>('SELECT user_id FROM users WHERE email = ? AND user_id != ? AND is_deleted = 0', [email, id]);
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
        await db.query('UPDATE users SET is_deleted = 1 WHERE user_id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

export const restoreUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.query('UPDATE users SET is_deleted = 0 WHERE user_id = ?', [id]);
        res.json({ message: 'User restored successfully' });
    } catch (error: any) {
        console.error('Error restoring user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
