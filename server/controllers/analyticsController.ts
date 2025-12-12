import { Request, Response } from 'express';
import { db } from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getMonthlyTrends = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(tanggal, '%Y-%m') as month, 
                tipe, 
                SUM(jumlah) as total 
            FROM riwayat_stok 
            WHERE tanggal >= DATE_SUB(NOW(), INTERVAL 6 MONTH) 
            GROUP BY month, tipe 
            ORDER BY month ASC
        `;

        const [rows] = await db.query<RowDataPacket[]>(query);

        // Transform data for frontend: { month: '2023-01', masuk: 100, keluar: 50, rusak: 10 }
        const monthlyData: Record<string, any> = {};

        rows.forEach(row => {
            if (!monthlyData[row.month]) {
                monthlyData[row.month] = { name: row.month, masuk: 0, keluar: 0, rusak: 0 };
            }
            if (row.tipe === 'masuk') monthlyData[row.month].masuk = Number(row.total);
            else if (row.tipe === 'keluar' || row.tipe === 'produksi') monthlyData[row.month].keluar += Number(row.total);
            else if (row.tipe === 'rusak') monthlyData[row.month].rusak = Number(row.total);
        });

        res.json(Object.values(monthlyData));
    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTopMaterials = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                b.nama_bahan as name, 
                SUM(r.jumlah) as value 
            FROM riwayat_stok r 
            JOIN bahan_sisa b ON r.bahan_id = b.bahan_id 
            WHERE r.tipe IN ('keluar', 'produksi') 
            GROUP BY r.bahan_id 
            ORDER BY value DESC 
            LIMIT 5
        `;

        const [rows] = await db.query<RowDataPacket[]>(query);
        const data = rows.map(row => ({
            name: row.name,
            value: Number(row.value)
        }));

        res.json(data);
    } catch (error) {
        console.error('Error fetching top materials:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCategoryDistribution = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                k.nama_kategori as name, 
                COUNT(b.bahan_id) as value 
            FROM bahan_sisa b 
            JOIN kategori_bahan k ON b.kategori_id = k.kategori_id 
            GROUP BY k.kategori_id
        `;

        const [rows] = await db.query<RowDataPacket[]>(query);
        const data = rows.map(row => ({
            name: row.name,
            value: Number(row.value)
        }));

        res.json(data);
    } catch (error) {
        console.error('Error fetching category distribution:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserPerformance = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                u.user_id,
                u.nama,
                u.role,
                COUNT(CASE WHEN r.tipe = 'masuk' THEN 1 END) as total_masuk,
                COUNT(CASE WHEN r.tipe IN ('keluar', 'produksi') THEN 1 END) as total_keluar,
                COUNT(CASE WHEN r.tipe = 'rusak' THEN 1 END) as total_rusak,
                MAX(r.tanggal) as last_active
            FROM users u
            LEFT JOIN riwayat_stok r ON u.user_id = r.user_id
            WHERE u.is_deleted = 0 AND u.role != 'manager'
            GROUP BY u.user_id
            ORDER BY last_active DESC
        `;

        const [rows] = await db.query<RowDataPacket[]>(query);
        const data = rows.map(row => ({
            user_id: row.user_id,
            nama: row.nama,
            role: row.role,
            total_masuk: Number(row.total_masuk),
            total_keluar: Number(row.total_keluar),
            total_rusak: Number(row.total_rusak),
            last_active: row.last_active
        }));

        res.json(data);
    } catch (error) {
        console.error('Error fetching user performance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
