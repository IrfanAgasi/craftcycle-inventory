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

        await connection.query(
            'INSERT INTO stok_masuk (bahan_id, jumlah, user_id, tanggal_masuk) VALUES (?, ?, ?, NOW())',
            [bahan_id, jumlah, user_id]
        );
        await connection.query(
            'UPDATE bahan_sisa SET stok_total = stok_total + ? WHERE bahan_id = ?',
            [jumlah, bahan_id]
        );
        const [bahanRows] = await connection.query<any[]>(
            'SELECT nama_bahan, warna, berat_ukuran FROM bahan_sisa WHERE bahan_id = ?',
            [bahan_id]
        );
        const bahan = bahanRows[0];
        const namaBahanCache = bahan ? `${bahan.nama_bahan} - ${bahan.warna} (${bahan.berat_ukuran})` : null;

        await connection.query(
            'INSERT INTO riwayat_stok (bahan_id, tipe, jumlah, user_id, keterangan, tanggal, nama_bahan_cache) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
            [bahan_id, 'masuk', jumlah, user_id, keterangan || 'Stok Masuk', namaBahanCache]
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

        const [rows] = await connection.query<any[]>(
            'SELECT stok_total, nama_bahan, warna, berat_ukuran FROM bahan_sisa WHERE bahan_id = ?',
            [bahan_id]
        );

        if (rows.length === 0) {
            throw new Error('Bahan tidak ditemukan');
        }

        const stokSisa = rows[0].stok_total;
        if (stokSisa < jumlah) {
            return res.status(400).json({ message: `Stok tidak cukup. Sisa: ${stokSisa}` });
        }

        await connection.query(
            'INSERT INTO stok_keluar (bahan_id, jumlah, user_id, tanggal_keluar) VALUES (?, ?, ?, NOW())',
            [bahan_id, jumlah, user_id]
        );
        await connection.query(
            'UPDATE bahan_sisa SET stok_total = stok_total - ? WHERE bahan_id = ?',
            [jumlah, bahan_id]
        );
        const tipe = (keterangan && keterangan.startsWith('Rusak')) ? 'rusak' : 'keluar';

        const namaBahanCache = `${rows[0].nama_bahan} - ${rows[0].warna} (${rows[0].berat_ukuran})`;

        await connection.query(
            'INSERT INTO riwayat_stok (bahan_id, tipe, jumlah, user_id, keterangan, tanggal, nama_bahan_cache) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
            [bahan_id, tipe, jumlah, user_id, keterangan || 'Stok Keluar', namaBahanCache]
        );

        if (tipe === 'rusak') {
            const cleanAlasan = keterangan ? keterangan.replace('Rusak: ', '') : 'Tidak ada keterangan';

            await connection.query(
                'INSERT INTO bahan_rusak (bahan_id, jumlah, alasan, user_id, tanggal_rusak) VALUES (?, ?, ?, ?, NOW())',
                [bahan_id, jumlah, cleanAlasan, user_id]
            );
        }

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
