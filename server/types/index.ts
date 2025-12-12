export type UserRole = 'admin' | 'staff' | 'manager';

export interface User {
    user_id: number;
    nama: string;
    email: string;
    password?: string; 
    role: UserRole;
    created_at: string;
}

export interface KategoriBahan {
    kategori_id: number;
    nama_kategori: string;
}

export interface BahanSisa {
    bahan_id: number;
    nama_bahan: string;
    kategori_id: number;
    berat_ukuran: string;
    warna: string;
    stok_total: number;
    created_at?: string;
    updated_at?: string;
}
