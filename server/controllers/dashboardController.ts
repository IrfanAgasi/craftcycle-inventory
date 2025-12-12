import { Request, Response } from 'express';
import { db } from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const currentMonth = new Date().getMonth() + 1; 

        const queries = [
            //total bahan sisa
            db.query('SELECT COUNT(*) as count FROM bahan_sisa'),
            //total kategori
            db.query('SELECT COUNT(*) as count FROM kategori_bahan'),
            //total produk jadi
            db.query('SELECT COUNT(*) as count FROM produk_jadi'),
            //stok masuk bulan Ini
            db.query('SELECT SUM(jumlah) as total FROM riwayat_stok WHERE tipe="masuk" AND MONTH(tanggal) = ?', [currentMonth]),
            //stok keluar bulan Ini
            db.query('SELECT SUM(jumlah) as total FROM riwayat_stok WHERE tipe="keluar" AND MONTH(tanggal) = ?', [currentMonth]),
            //total stok produk (sum all product stock)
            db.query('SELECT SUM(stok_total) as total FROM produk_jadi'),
            //total bahan rusak bulan Ini
            db.query('SELECT SUM(jumlah) as total FROM bahan_rusak WHERE MONTH(tanggal_rusak) = ?', [currentMonth]),
            //low stock 
            db.query('SELECT * FROM bahan_sisa WHERE stok_total < 10')
        ];

        const results = await Promise.all(queries);

        const [bahanRows] = results[0] as any;
        const [kategoriRows] = results[1] as any;
        const [produkRows] = results[2] as any;
        const [masukRows] = results[3] as any;
        const [keluarRows] = results[4] as any;
        const [stokProdukRows] = results[5] as any;
        const [rusakRows] = results[6] as any;
        const [lowStockRows] = results[7] as any;

        const stats = {
            totalBahan: bahanRows[0].count,
            totalKategori: kategoriRows[0].count,
            totalProduk: produkRows[0].count,
            stokMasukBulanIni: masukRows[0].total || 0,
            stokKeluarBulanIni: keluarRows[0].total || 0,
            totalStokProduk: Math.floor(stokProdukRows[0].total || 0),
            rusakBulanIni: Math.floor(rusakRows[0].total || 0),
            lowStockBahan: lowStockRows
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
