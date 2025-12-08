import { Request, Response } from 'express';
import { db } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const stokMasuk = async (req: Request, res: Response) => {
    const { bahan_id, jumlah, keterangan, user_id } = req.body;

    if (!bahan_id || !jumlah || !user_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert ke tabel stok_masuk
        await connection.query(
            'INSERT INTO stok_masuk (bahan_id, jumlah, user_id, tanggal_masuk) VALUES (?, ?, ?, NOW())',
            [bahan_id, jumlah, user_id]
        );

        // 2. Update stok di tabel bahan_sisa
        await connection.query(
            'UPDATE bahan_sisa SET stok_total = stok_total + ? WHERE bahan_id = ?',
            [jumlah, bahan_id]
        );

        // 3. Catat di riwayat_stok
        await connection.query(
            'INSERT INTO riwayat_stok (bahan_id, tipe, jumlah, user_id, keterangan, tanggal) VALUES (?, ?, ?, ?, ?, NOW())',
            [bahan_id, 'masuk', jumlah, user_id, keterangan || 'Stok Masuk']
        );

        await connection.commit();
        res.status(201).json({ message: 'Stok masuk berhasil dicatat' });
    } catch (error) {
        await connection.rollback();
        console.error('Error stok masuk:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

export const stokKeluar = async (req: Request, res: Response) => {
    const { bahan_id, jumlah, keterangan, user_id } = req.body;

    if (!bahan_id || !jumlah || !user_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Cek stok dulu
        const [rows] = await connection.query<any[]>(
            'SELECT stok_total, nama_bahan FROM bahan_sisa WHERE bahan_id = ?',
            [bahan_id]
        );

        if (rows.length === 0) {
            throw new Error('Bahan tidak ditemukan');
        }

        const stokSisa = rows[0].stok_total;
        if (stokSisa < jumlah) {
            return res.status(400).json({ message: `Stok tidak cukup. Sisa: ${stokSisa}` });
        }

        // 1. Insert ke tabel stok_keluar
        await connection.query(
            'INSERT INTO stok_keluar (bahan_id, jumlah, user_id, tanggal_keluar) VALUES (?, ?, ?, NOW())',
            [bahan_id, jumlah, user_id]
        );

        // 2. Update stok di tabel bahan_sisa
        await connection.query(
            'UPDATE bahan_sisa SET stok_total = stok_total - ? WHERE bahan_id = ?',
            [jumlah, bahan_id]
        );

        // 3. Catat di riwayat_stok
        await connection.query(
            'INSERT INTO riwayat_stok (bahan_id, tipe, jumlah, user_id, keterangan, tanggal) VALUES (?, ?, ?, ?, ?, NOW())',
            [bahan_id, 'keluar', jumlah, user_id, keterangan || 'Stok Keluar']
        );

        await connection.commit();
        res.status(201).json({ message: 'Stok keluar berhasil dicatat' });
    } catch (error: any) {
        await connection.rollback();
        console.error('Error stok keluar:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    } finally {
        connection.release();
    }
};
