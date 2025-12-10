import { Request, Response } from 'express';
import { db } from '../config/db';

export const getBahanRusak = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        br.rusak_id,
        br.bahan_id,
        br.jumlah,
        br.alasan,
        br.user_id,
        br.tanggal_rusak,
        b.nama_bahan,
        b.warna,
        b.berat_ukuran,
        u.nama as user_name,
        u.role as user_role
      FROM bahan_rusak br
      LEFT JOIN bahan_sisa b ON br.bahan_id = b.bahan_id
      LEFT JOIN users u ON br.user_id = u.user_id
      ORDER BY br.tanggal_rusak DESC
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bahan rusak:', error);
    res.status(500).json({ message: 'Error fetching bahan rusak' });
  }
};

export const getBahanRusakById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        br.rusak_id,
        br.bahan_id,
        br.jumlah,
        br.alasan,
        br.user_id,
        br.tanggal_rusak,
        b.nama_bahan,
        b.warna,
        b.berat_ukuran,
        u.nama as user_name,
        u.role as user_role
      FROM bahan_rusak br
      LEFT JOIN bahan_sisa b ON br.bahan_id = b.bahan_id
      LEFT JOIN users u ON br.user_id = u.user_id
      WHERE br.rusak_id = ?
    `;

    const [rows] = await db.query(query, [id]);
    const data = rows as any[];

    if (data.length === 0) {
      return res.status(404).json({ message: 'Bahan rusak not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error fetching bahan rusak by id:', error);
    res.status(500).json({ message: 'Error fetching bahan rusak' });
  }
};