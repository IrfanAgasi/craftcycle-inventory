import type { 
  User, 
  KategoriBahan, 
  BahanSisa, 
  StokMasuk, 
  StokKeluar, 
  BahanRusak, 
  RiwayatStok, 
  ProdukJadi, 
  ResepProduk 
} from '@/types/database';

export const users: User[] = [
  { user_id: 1, nama: 'Admin Utama', email: 'admin@craftcycle.id', password: 'admin123', role: 'admin', created_at: '2025-12-08T05:00:00' },
  { user_id: 2, nama: 'Staff Gudang', email: 'staff@craftcycle.id', password: 'staff123', role: 'staff', created_at: '2025-12-08T05:00:00' },
  { user_id: 3, nama: 'Manager Produksi', email: 'manager@craftcycle.id', password: 'manager123', role: 'manager', created_at: '2025-12-08T05:00:00' },
];

export const kategoriBahan: KategoriBahan[] = [
  { kategori_id: 1, nama_kategori: 'Kain' },
  { kategori_id: 2, nama_kategori: 'Logam' },
  { kategori_id: 3, nama_kategori: 'Plastik' },
  { kategori_id: 4, nama_kategori: 'Kertas' },
  { kategori_id: 5, nama_kategori: 'Kayu' },
  { kategori_id: 6, nama_kategori: 'Benang' },
  { kategori_id: 7, nama_kategori: 'Aksesoris' },
];

export const bahanSisa: BahanSisa[] = [
  { bahan_id: 101, nama_bahan: 'Kain Perca', kategori_id: 1, berat_ukuran: '20x20cm', warna: 'RGB', kondisi: 'siap-olah', stok_total: 300, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 102, nama_bahan: 'Kain Flanel', kategori_id: 1, berat_ukuran: '1m', warna: 'pink', kondisi: 'siap-olah', stok_total: 5, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 103, nama_bahan: 'Kain Flanel', kategori_id: 1, berat_ukuran: '1m', warna: 'hijau', kondisi: 'siap-olah', stok_total: 5, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 104, nama_bahan: 'Kain Flanel', kategori_id: 1, berat_ukuran: '1m', warna: 'kuning', kondisi: 'siap-olah', stok_total: 5, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 105, nama_bahan: 'Kain Flanel', kategori_id: 1, berat_ukuran: '1m', warna: 'putih', kondisi: 'siap-olah', stok_total: 8, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 106, nama_bahan: 'Kain Flanel', kategori_id: 1, berat_ukuran: '1m', warna: 'hitam', kondisi: 'siap-olah', stok_total: 5, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 201, nama_bahan: 'Tutup Botol', kategori_id: 2, berat_ukuran: '3cm', warna: 'silver', kondisi: 'siap-olah', stok_total: 150, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 202, nama_bahan: 'Kawat Tembaga', kategori_id: 2, berat_ukuran: '50cm', warna: 'gold', kondisi: 'siap-olah', stok_total: 30, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 301, nama_bahan: 'Pipecleaner', kategori_id: 3, berat_ukuran: '30cm', warna: 'RGB', kondisi: 'siap-olah', stok_total: 200, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 302, nama_bahan: 'Manik Plastik', kategori_id: 3, berat_ukuran: '5mm', warna: 'RGB', kondisi: 'siap-olah', stok_total: 500, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 401, nama_bahan: 'Karton Bekas', kategori_id: 4, berat_ukuran: '30x30cm', warna: 'coklat', kondisi: 'mentah', stok_total: 100, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 402, nama_bahan: 'Kertas Kado', kategori_id: 4, berat_ukuran: '50x70cm', warna: 'RGB', kondisi: 'siap-olah', stok_total: 50, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 501, nama_bahan: 'Stik Es Krim', kategori_id: 5, berat_ukuran: '11cm', warna: 'natural', kondisi: 'siap-olah', stok_total: 400, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 601, nama_bahan: 'Benang Rajut', kategori_id: 6, berat_ukuran: '100g', warna: 'putih', kondisi: 'siap-olah', stok_total: 20, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 602, nama_bahan: 'Benang Rajut', kategori_id: 6, berat_ukuran: '100g', warna: 'pink', kondisi: 'siap-olah', stok_total: 15, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { bahan_id: 701, nama_bahan: 'Ring Keychain', kategori_id: 7, berat_ukuran: '2.5cm', warna: 'silver', kondisi: 'siap-olah', stok_total: 100, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
];

export const produkJadi: ProdukJadi[] = [
  { produk_id: 1, nama_produk: 'Feltimals Keychain - Katak', harga_jual: 20000, stok_total: 10, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { produk_id: 2, nama_produk: 'Feltimals Keychain - Kelinci', harga_jual: 20000, stok_total: 8, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { produk_id: 3, nama_produk: 'Feltimals Keychain - Kucing', harga_jual: 20000, stok_total: 12, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { produk_id: 4, nama_produk: 'Bottle Cap Pin', harga_jual: 5000, stok_total: 25, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { produk_id: 5, nama_produk: 'Tea Time Bookmark', harga_jual: 10000, stok_total: 15, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { produk_id: 6, nama_produk: 'Pipecleaner Flower Charm', harga_jual: 15000, stok_total: 20, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { produk_id: 7, nama_produk: 'Crochet Mini Cup', harga_jual: 25000, stok_total: 5, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
  { produk_id: 8, nama_produk: 'Mirror Charm', harga_jual: 25000, stok_total: 7, created_at: '2025-12-08T05:00:00', updated_at: '2025-12-08T05:00:00' },
];

export const resepProduk: ResepProduk[] = [
  // Feltimals Keychain - Katak
  { resep_id: 1, produk_id: 1, bahan_id: 103, jumlah_bahan: 1 }, // Flanel hijau
  { resep_id: 2, produk_id: 1, bahan_id: 106, jumlah_bahan: 1 }, // Flanel hitam
  { resep_id: 3, produk_id: 1, bahan_id: 701, jumlah_bahan: 1 }, // Ring keychain
  // Feltimals Keychain - Kelinci
  { resep_id: 4, produk_id: 2, bahan_id: 105, jumlah_bahan: 1 }, // Flanel putih
  { resep_id: 5, produk_id: 2, bahan_id: 106, jumlah_bahan: 1 }, // Flanel hitam
  { resep_id: 6, produk_id: 2, bahan_id: 701, jumlah_bahan: 1 }, // Ring keychain
  // Feltimals Keychain - Kucing
  { resep_id: 7, produk_id: 3, bahan_id: 104, jumlah_bahan: 1 }, // Flanel kuning
  { resep_id: 8, produk_id: 3, bahan_id: 106, jumlah_bahan: 1 }, // Flanel hitam
  { resep_id: 9, produk_id: 3, bahan_id: 701, jumlah_bahan: 1 }, // Ring keychain
  // Bottle Cap Pin
  { resep_id: 10, produk_id: 4, bahan_id: 201, jumlah_bahan: 1 }, // Tutup botol
  { resep_id: 11, produk_id: 4, bahan_id: 402, jumlah_bahan: 1 }, // Kertas kado
  // Tea Time Bookmark
  { resep_id: 12, produk_id: 5, bahan_id: 101, jumlah_bahan: 2 }, // Kain perca
  { resep_id: 13, produk_id: 5, bahan_id: 401, jumlah_bahan: 1 }, // Karton bekas
  // Pipecleaner Flower Charm
  { resep_id: 14, produk_id: 6, bahan_id: 301, jumlah_bahan: 3 }, // Pipecleaner
  { resep_id: 15, produk_id: 6, bahan_id: 701, jumlah_bahan: 1 }, // Ring keychain
  // Crochet Mini Cup
  { resep_id: 16, produk_id: 7, bahan_id: 601, jumlah_bahan: 1 }, // Benang rajut putih
  { resep_id: 17, produk_id: 7, bahan_id: 701, jumlah_bahan: 1 }, // Ring keychain
  // Mirror Charm
  { resep_id: 18, produk_id: 8, bahan_id: 102, jumlah_bahan: 1 }, // Flanel pink
  { resep_id: 19, produk_id: 8, bahan_id: 302, jumlah_bahan: 5 }, // Manik plastik
  { resep_id: 20, produk_id: 8, bahan_id: 701, jumlah_bahan: 1 }, // Ring keychain
];

export const riwayatStok: RiwayatStok[] = [
  { riwayat_id: 1, bahan_id: 101, tipe: 'masuk', jumlah: 100, user_id: 2, keterangan: 'Stok awal', tanggal: '2025-12-01T09:00:00' },
  { riwayat_id: 2, bahan_id: 102, tipe: 'masuk', jumlah: 10, user_id: 2, keterangan: 'Stok awal', tanggal: '2025-12-01T09:00:00' },
  { riwayat_id: 3, bahan_id: 201, tipe: 'masuk', jumlah: 200, user_id: 2, keterangan: 'Stok awal', tanggal: '2025-12-01T09:00:00' },
  { riwayat_id: 4, bahan_id: 101, tipe: 'produksi', jumlah: 10, user_id: 1, keterangan: 'Produksi Tea Time Bookmark', tanggal: '2025-12-05T14:00:00' },
  { riwayat_id: 5, bahan_id: 201, tipe: 'produksi', jumlah: 5, user_id: 1, keterangan: 'Produksi Bottle Cap Pin', tanggal: '2025-12-05T14:30:00' },
  { riwayat_id: 6, bahan_id: 301, tipe: 'rusak', jumlah: 10, user_id: 2, keterangan: 'Patah saat penyimpanan', tanggal: '2025-12-06T10:00:00' },
  { riwayat_id: 7, bahan_id: 103, tipe: 'produksi', jumlah: 2, user_id: 1, keterangan: 'Produksi Feltimals Katak', tanggal: '2025-12-07T11:00:00' },
  { riwayat_id: 8, bahan_id: 602, tipe: 'masuk', jumlah: 5, user_id: 2, keterangan: 'Restok dari supplier', tanggal: '2025-12-08T08:00:00' },
];

export const bahanRusak: BahanRusak[] = [
  { rusak_id: 1, bahan_id: 301, jumlah: 10, alasan: 'Patah saat penyimpanan', user_id: 2, tanggal_rusak: '2025-12-06T10:00:00' },
  { rusak_id: 2, bahan_id: 402, jumlah: 5, alasan: 'Terkena air', user_id: 2, tanggal_rusak: '2025-12-07T09:00:00' },
];

export const stokMasuk: StokMasuk[] = [
  { masuk_id: 1, bahan_id: 101, jumlah: 100, user_id: 2, tanggal_masuk: '2025-12-01T09:00:00' },
  { masuk_id: 2, bahan_id: 102, jumlah: 10, user_id: 2, tanggal_masuk: '2025-12-01T09:00:00' },
  { masuk_id: 3, bahan_id: 602, jumlah: 5, user_id: 2, tanggal_masuk: '2025-12-08T08:00:00' },
];

export const stokKeluar: StokKeluar[] = [
  { keluar_id: 1, bahan_id: 101, jumlah: 10, user_id: 1, tanggal_keluar: '2025-12-05T14:00:00' },
  { keluar_id: 2, bahan_id: 201, jumlah: 5, user_id: 1, tanggal_keluar: '2025-12-05T14:30:00' },
];

// Helper functions
export const getBahanById = (id: number) => bahanSisa.find(b => b.bahan_id === id);
export const getKategoriById = (id: number) => kategoriBahan.find(k => k.kategori_id === id);
export const getUserById = (id: number) => users.find(u => u.user_id === id);
export const getProdukById = (id: number) => produkJadi.find(p => p.produk_id === id);
export const getResepByProdukId = (produkId: number) => resepProduk.filter(r => r.produk_id === produkId);
