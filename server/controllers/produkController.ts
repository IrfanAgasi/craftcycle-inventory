import { Request, Response } from 'express';
import { db } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Get all produk jadi
export const getAllProduk = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM produk_jadi ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching produk:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get produk by ID with resep
export const getProdukById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [produkRows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM produk_jadi WHERE produk_id = ?',
            [id]
        );

        if (produkRows.length === 0) {
            return res.status(404).json({ message: 'Produk not found' });
        }

        const [resepRows] = await db.query<RowDataPacket[]>(
            `SELECT rp.*, bs.nama_bahan, bs.warna, bs.stok_total 
             FROM resep_produk rp
             JOIN bahan_sisa bs ON rp.bahan_id = bs.bahan_id
             WHERE rp.produk_id = ?`,
            [id]
        );

        res.json({
            ...produkRows[0],
            resep: resepRows
        });
    } catch (error) {
        console.error('Error fetching produk:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create new produk with resep
export const createProduk = async (req: Request, res: Response) => {
    const { nama_produk, harga_jual, gambar_url, resep } = req.body;

    if (!nama_produk || !harga_jual || !resep || resep.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Insert produk
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO produk_jadi (nama_produk, harga_jual, gambar_url, stok_total) VALUES (?, ?, ?, 0)',
            [nama_produk, harga_jual, gambar_url || null]
        );

        const produkId = result.insertId;

        // Insert resep items
        for (const item of resep) {
            if (item.bahan_id && item.jumlah_bahan > 0) {
                await connection.query(
                    'INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES (?, ?, ?)',
                    [produkId, item.bahan_id, item.jumlah_bahan]
                );
            }
        }

        await connection.commit();
        res.status(201).json({
            message: 'Produk created successfully',
            produk_id: produkId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating produk:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

// Update produk
export const updateProduk = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama_produk, harga_jual, gambar_url, resep } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Update produk basic info
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE produk_jadi SET nama_produk = ?, harga_jual = ?, gambar_url = ? WHERE produk_id = ?',
            [nama_produk, harga_jual, gambar_url || null, id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Produk not found' });
        }

        // Update resep if provided
        if (resep && Array.isArray(resep)) {
            // Delete existing resep
            await connection.query('DELETE FROM resep_produk WHERE produk_id = ?', [id]);

            // Insert new resep
            for (const item of resep) {
                await connection.query(
                    'INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES (?, ?, ?)',
                    [id, item.bahan_id, item.jumlah_bahan]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Produk updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating produk:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

// Delete produk
export const deleteProduk = async (req: Request, res: Response) => {
    const { id } = req.params;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Delete resep first (foreign key)
        await connection.query('DELETE FROM resep_produk WHERE produk_id = ?', [id]);

        // Delete produk
        const [result] = await connection.query<ResultSetHeader>(
            'DELETE FROM produk_jadi WHERE produk_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Produk not found' });
        }

        await connection.commit();
        res.json({ message: 'Produk deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting produk:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

// Produksi (manufacture) produk
export const produksiProduk = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, jumlah = 1 } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Get produk info
        const [produkRows] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM produk_jadi WHERE produk_id = ?',
            [id]
        );

        if (produkRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Produk not found' });
        }

        const produk = produkRows[0];

        // Get resep
        const [resepRows] = await connection.query<RowDataPacket[]>(
            `SELECT rp.*, bs.stok_total, bs.nama_bahan 
             FROM resep_produk rp
             JOIN bahan_sisa bs ON rp.bahan_id = bs.bahan_id
             WHERE rp.produk_id = ?`,
            [id]
        );

        // Check if all bahan have enough stock
        for (const item of resepRows) {
            const neededAmount = item.jumlah_bahan * jumlah;
            if (item.stok_total < neededAmount) {
                await connection.rollback();
                return res.status(400).json({
                    message: `Stok ${item.nama_bahan} tidak cukup. Dibutuhkan: ${neededAmount}, Tersedia: ${item.stok_total}`
                });
            }
        }

        // Reduce bahan stock and record history
        for (const item of resepRows) {
            const neededAmount = item.jumlah_bahan * jumlah;

            // Update bahan stock
            await connection.query(
                'UPDATE bahan_sisa SET stok_total = stok_total - ? WHERE bahan_id = ?',
                [neededAmount, item.bahan_id]
            );

            // Record in riwayat_stok
            await connection.query(
                'INSERT INTO riwayat_stok (bahan_id, tipe, jumlah, user_id, keterangan) VALUES (?, ?, ?, ?, ?)',
                [item.bahan_id, 'keluar', neededAmount, user_id, `Produksi ${produk.nama_produk}`]
            );
        }

        // Increase produk stock
        await connection.query(
            'UPDATE produk_jadi SET stok_total = stok_total + ? WHERE produk_id = ?',
            [jumlah, id]
        );

        await connection.commit();
        res.json({
            message: `Berhasil memproduksi ${jumlah} unit ${produk.nama_produk}`,
            produk_id: id,
            jumlah
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error during produksi:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

// Get all resep
export const getAllResep = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query(`
            SELECT rp.*, 
                   pj.nama_produk,
                   bs.nama_bahan, bs.warna
            FROM resep_produk rp
            JOIN produk_jadi pj ON rp.produk_id = pj.produk_id
            JOIN bahan_sisa bs ON rp.bahan_id = bs.bahan_id
            ORDER BY rp.produk_id, rp.resep_id
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching resep:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
