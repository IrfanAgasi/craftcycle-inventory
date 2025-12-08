import { Request, Response } from 'express';
import { db } from '../config/db';

export const getAllKategori = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM kategori_bahan');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
