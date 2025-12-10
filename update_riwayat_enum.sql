-- WARNING: Ensure you have deleted or updated any existing 'produksi' records before running this, 
-- otherwise they may be truncated or cause errors depending on your SQL mode.
-- DELETE FROM riwayat_stok WHERE tipe = 'produksi';

ALTER TABLE riwayat_stok MODIFY COLUMN tipe ENUM('masuk', 'keluar', 'rusak');
