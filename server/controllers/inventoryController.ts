import { Request, Response } from 'express';
import { db } from '../config/db';
import { BahanSisa } from '../types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const getAllInventory = async (req: Request, res: Response) => {
    try {
        // Get all bahan with their latest activity timestamp
        // Order by latest riwayat_stok activity first, then by bahan_id for new items
        const [rows] = await db.query(`
            SELECT bs.*, 
                   MAX(rs.tanggal) as last_activity
            FROM bahan_sisa bs
            LEFT JOIN riwayat_stok rs ON bs.bahan_id = rs.bahan_id
            GROUP BY bs.bahan_id
            ORDER BY COALESCE(MAX(rs.tanggal), '1970-01-01') DESC, bs.bahan_id DESC
        `);
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
    const { nama_bahan, kategori_id, berat_ukuran, warna, stok_total } = req.body;

    if (!nama_bahan || !kategori_id || !berat_ukuran || !warna || stok_total === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if bahan with same nama_bahan + warna + berat_ukuran already exists
        const [existingRows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM bahan_sisa WHERE nama_bahan = ? AND warna = ? AND berat_ukuran = ?',
            [nama_bahan, warna, berat_ukuran]
        );

        if (existingRows.length > 0) {
            return res.status(400).json({
                message: 'Bahan ini sudah ada di inventory. Tambahkan stok pada halaman stok masuk',
                error: 'DUPLICATE_BAHAN'
            });
        }

        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO bahan_sisa (nama_bahan, kategori_id, berat_ukuran, warna, stok_total) VALUES (?, ?, ?, ?, ?)',
            [nama_bahan, kategori_id, berat_ukuran, warna, stok_total || 0]
        );

        // If there's initial stock, record it in riwayat_stok
        if (stok_total > 0) {
            const user_id = req.body.user_id || 1; // Get user_id from request or default to 1
            const namaBahanCache = `${nama_bahan} - ${warna} (${berat_ukuran})`;
            await db.query(
                'INSERT INTO riwayat_stok (bahan_id, tipe, jumlah, user_id, keterangan, tanggal, nama_bahan_cache) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
                [result.insertId, 'masuk', stok_total, user_id, 'Stok awal saat menambah bahan baru', namaBahanCache]
            );
        }

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
    const { nama_bahan, kategori_id, berat_ukuran, warna, stok_total } = req.body;

    try {
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE bahan_sisa SET nama_bahan = ?, kategori_id = ?, berat_ukuran = ?, warna = ?, stok_total = ? WHERE bahan_id = ?',
            [nama_bahan, kategori_id, berat_ukuran, warna, stok_total, id]
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
    const { user_id } = req.body;

    try {
        // Get bahan data before deleting  
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM bahan_sisa WHERE bahan_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const bahan = rows[0];

        // Step 1: Try to delete the bahan first (resep_produk CASCADE, others SET NULL)
        const [result] = await db.query<ResultSetHeader>(
            'DELETE FROM bahan_sisa WHERE bahan_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Step 2: Record deletion to riwayat_stok ONLY if delete was successful
        if (bahan.stok_total > 0 && user_id) {
            // Format: "Nama - warna (ukuran)" for complete info
            const cacheValue = `${bahan.nama_bahan} - ${bahan.warna} (${bahan.berat_ukuran})`;
            await db.query(
                'INSERT INTO riwayat_stok (bahan_id, nama_bahan_cache, tipe, jumlah, user_id, keterangan, tanggal) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [null, cacheValue, 'keluar', bahan.stok_total, user_id, 'Bahan dihapus dari inventory']
            );
        }

        res.json({
            message: 'Item deleted successfully',
            deletedStock: bahan.stok_total,
            bahanName: `${bahan.nama_bahan} (${bahan.warna}${bahan.berat_ukuran ? ' - ' + bahan.berat_ukuran : ''})`
        });
    } catch (error: any) {
        console.error('Error deleting item:', error);

        // Check if error is foreign key constraint from resep_produk
        if (error.code === 'ER_ROW_IS_REFERENCED_2' && error.sqlMessage?.includes('resep_produk')) {
            return res.status(400).json({
                message: 'Bahan tidak bisa dihapus karena masih dibutuhkan untuk produksi',
                error: 'FK_CONSTRAINT_RESEP'
            });
        }

        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
