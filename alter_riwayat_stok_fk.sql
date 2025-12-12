-- Alter foreign key constraint on riwayat_stok to allow SET NULL on delete
-- This allows us to keep history even after bahan is deleted

-- Step 1: Add nama_bahan_cache column to store bahan name as backup
ALTER TABLE riwayat_stok ADD COLUMN nama_bahan_cache VARCHAR(255) NULL AFTER bahan_id;

-- Step 2: Drop existing foreign key constraint
ALTER TABLE riwayat_stok DROP FOREIGN KEY riwayat_stok_ibfk_1;

-- Step 3: Modify bahan_id to allow NULL
ALTER TABLE riwayat_stok MODIFY COLUMN bahan_id INT NULL;

-- Step 4: Add new foreign key with ON DELETE SET NULL
ALTER TABLE riwayat_stok 
ADD CONSTRAINT riwayat_stok_ibfk_1 
FOREIGN KEY (bahan_id) REFERENCES bahan_sisa(bahan_id) 
ON DELETE SET NULL;

-- Do the same for other tables if needed
-- stok_masuk
ALTER TABLE stok_masuk DROP FOREIGN KEY stok_masuk_ibfk_1;
ALTER TABLE stok_masuk MODIFY COLUMN bahan_id INT NULL;
ALTER TABLE stok_masuk 
ADD CONSTRAINT stok_masuk_ibfk_1 
FOREIGN KEY (bahan_id) REFERENCES bahan_sisa(bahan_id) 
ON DELETE SET NULL;

-- stok_keluar
ALTER TABLE stok_keluar DROP FOREIGN KEY stok_keluar_ibfk_1;
ALTER TABLE stok_keluar MODIFY COLUMN bahan_id INT NULL;
ALTER TABLE stok_keluar 
ADD CONSTRAINT stok_keluar_ibfk_1 
FOREIGN KEY (bahan_id) REFERENCES bahan_sisa(bahan_id) 
ON DELETE SET NULL;

-- bahan_rusak
ALTER TABLE bahan_rusak DROP FOREIGN KEY bahan_rusak_ibfk_1;
ALTER TABLE bahan_rusak MODIFY COLUMN bahan_id INT NULL;
ALTER TABLE bahan_rusak 
ADD CONSTRAINT bahan_rusak_ibfk_1 
FOREIGN KEY (bahan_id) REFERENCES bahan_sisa(bahan_id) 
ON DELETE SET NULL;
