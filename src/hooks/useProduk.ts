import { useState, useEffect } from 'react';
import { fetchProduk, fetchResep, createProduk, produksiProduk } from '@/services/api';
import type { ProdukJadi, ResepProduk } from '@/types/database';

export const useProduk = () => {
    const [produkList, setProdukList] = useState<ProdukJadi[]>([]);
    const [resepList, setResepList] = useState<ResepProduk[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProduk = async () => {
        try {
            setLoading(true);
            const data = await fetchProduk();
            setProdukList(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load produk');
        } finally {
            setLoading(false);
        }
    };

    const loadResep = async () => {
        try {
            const data = await fetchResep();
            setResepList(data);
        } catch (err) {
            console.error('Failed to load resep:', err);
        }
    };

    useEffect(() => {
        loadProduk();
        loadResep();
    }, []);

    const addProduk = async (data: {
        nama_produk: string;
        harga_jual: number;
        gambar_url?: string;
        resep: { bahan_id: number; jumlah_bahan: number }[];
    }) => {
        await createProduk(data);
        await loadProduk();
        await loadResep();
    };

    const produksi = async (produkId: number, userId: number, jumlah: number = 1) => {
        await produksiProduk(produkId, userId, jumlah);
        await loadProduk();
    };

    const getResepByProdukId = (produkId: number) => {
        return resepList.filter(r => r.produk_id === produkId);
    };

    return {
        produkList,
        resepList,
        loading,
        error,
        addProduk,
        produksi,
        getResepByProdukId,
        reload: loadProduk
    };
};
