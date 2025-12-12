import { Request, Response } from 'express';
import { db } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const getAllKategori = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM kategori_bahan ORDER BY kategori_id');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createKategori = async (req: Request, res: Response) => {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
        return res.status(400).json({ message: 'Nama kategori is required' });
    }

    try {
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO kategori_bahan (nama_kategori) VALUES (?)',
            [nama_kategori]
        );
        
        res.status(201).json({
            message: 'Kategori created',
            kategori_id: result.insertId,
            nama_kategori
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateKategori = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
        return res.status(400).json({ message: 'Nama kategori is required' });
    }

    try {
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE kategori_bahan SET nama_kategori = ? WHERE kategori_id = ?',
            [nama_kategori, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Kategori not found' });
        }

        res.json({ message: 'Kategori updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteKategori = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [bahanRows] = await db.query<any[]>(
            'SELECT COUNT(*) as count FROM bahan_sisa WHERE kategori_id = ?',
            [id]
        );

        if (bahanRows[0].count > 0) {
            return res.status(400).json({ 
                message: 'Kategori tidak dapat dihapus karena masih digunakan oleh bahan' 
            });
        }

        const [result] = await db.query<ResultSetHeader>(
            'DELETE FROM kategori_bahan WHERE kategori_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Kategori not found' });
        }

        res.json({ message: 'Kategori deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};