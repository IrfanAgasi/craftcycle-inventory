export type UserRole = 'admin' | 'staff' | 'manager';

export interface User {
    user_id: number;
    nama: string;
    email: string;
    password?: string; // Optional for response
    role: UserRole;
    created_at: string;
}

export interface KategoriBahan {
    kategori_id: number;
    nama_kategori: string;
}

export type KondisiBahan = 'mentah' | 'siap-olah' | 'rusak';

export interface BahanSisa {
    bahan_id: number;
    nama_bahan: string;
    kategori_id: number;
    berat_ukuran: string;
    warna: string;
    kondisi: KondisiBahan;
    stok_total: number;
    created_at?: string;
    updated_at?: string;
}
