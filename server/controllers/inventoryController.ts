import { Request, Response } from 'express';
import { db } from '../config/db';
import { BahanSisa } from '../types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const getAllInventory = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM bahan_sisa');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getInventoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM bahan_sisa WHERE bahan_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createInventory = async (req: Request, res: Response) => {
    const { nama_bahan, kategori_id, berat_ukuran, warna, kondisi, stok_total } = req.body;

    if (!nama_bahan || !kategori_id || !berat_ukuran || !warna || !kondisi) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO bahan_sisa (nama_bahan, kategori_id, berat_ukuran, warna, kondisi, stok_total) VALUES (?, ?, ?, ?, ?, ?)',
            [nama_bahan, kategori_id, berat_ukuran, warna, kondisi, stok_total || 0]
        );
        res.status(201).json({
            message: 'Item created',
            id: result.insertId,
            data: { ...req.body, bahan_id: result.insertId }
        });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateInventory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama_bahan, kategori_id, berat_ukuran, warna, kondisi, stok_total } = req.body;

    try {
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE bahan_sisa SET nama_bahan = ?, kategori_id = ?, berat_ukuran = ?, warna = ?, kondisi = ?, stok_total = ? WHERE bahan_id = ?',
            [nama_bahan, kategori_id, berat_ukuran, warna, kondisi, stok_total, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteInventory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM bahan_sisa WHERE bahan_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
