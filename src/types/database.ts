export type UserRole = 'admin' | 'staff' | 'manager';

export interface User {
  user_id: number;
  nama: string;
  email: string;
  password: string;
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
  kategori?: KategoriBahan;
  berat_ukuran: string;
  warna: string;
  kondisi: KondisiBahan;
  stok_total: number;
  created_at: string;
  updated_at: string;
}

export interface StokMasuk {
  masuk_id: number;
  bahan_id: number;
  bahan?: BahanSisa;
  jumlah: number;
  user_id: number;
  user?: User;
  tanggal_masuk: string;
}

export interface StokKeluar {
  keluar_id: number;
  bahan_id: number;
  bahan?: BahanSisa;
  jumlah: number;
  user_id: number;
  user?: User;
  tanggal_keluar: string;
}

export interface BahanRusak {
  rusak_id: number;
  bahan_id: number;
  bahan?: BahanSisa;
  jumlah: number;
  alasan: string;
  user_id: number;
  user?: User;
  tanggal_rusak: string;
}

export type TipeRiwayat = 'masuk' | 'keluar' | 'rusak' | 'produksi';

export interface RiwayatStok {
  riwayat_id: number;
  bahan_id: number;
  bahan?: BahanSisa;
  tipe: TipeRiwayat;
  jumlah: number;
  user_id: number;
  user?: User;
  keterangan: string;
  tanggal: string;
}

export interface ProdukJadi {
  produk_id: number;
  nama_produk: string;
  harga_jual: number;
  stok_total: number;
  created_at: string;
  updated_at: string;
}

export interface ResepProduk {
  resep_id: number;
  produk_id: number;
  produk?: ProdukJadi;
  bahan_id: number;
  bahan?: BahanSisa;
  jumlah_bahan: number;
}
