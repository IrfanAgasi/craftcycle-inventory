import { Request, Response } from 'express';
import { db } from '../config/db';

export const getHistory = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        r.riwayat_id,
        r.bahan_id,
        CASE 
            WHEN r.keterangan LIKE 'Rusak%' THEN 'rusak'
            ELSE r.tipe 
        END as tipe,
        r.jumlah,
        r.user_id,
        r.keterangan,
        r.tanggal,
        COALESCE(
          b.nama_bahan, 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.nama_bahan_cache, ' - ', 1), ' (', 1))
        ) as nama_bahan,
        COALESCE(
          b.warna,
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.nama_bahan_cache, ' - ', -1), ' (', 1))
        ) as warna,
        COALESCE(
          b.berat_ukuran,
          CASE 
            WHEN r.nama_bahan_cache LIKE '%(%' 
            THEN TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.nama_bahan_cache, '(', -1), ')', 1))
            ELSE NULL
          END
        ) as berat_ukuran,
        u.nama as user_name,
        u.role as user_role 
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
