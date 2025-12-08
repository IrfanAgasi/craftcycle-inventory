import { Request, Response } from 'express';
import { db } from '../config/db';

export const getHistory = async (req: Request, res: Response) => {
    try {
        const query = `
      SELECT 
        r.*, 
        b.nama_bahan, 
        b.warna, 
        u.nama as user_name 
      FROM riwayat_stok r
      LEFT JOIN bahan_sisa b ON r.bahan_id = b.bahan_id
      LEFT JOIN users u ON r.user_id = u.user_id
      ORDER BY r.tanggal DESC
    `;

        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
