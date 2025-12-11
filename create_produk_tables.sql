-- Tabel produk_jadi
CREATE TABLE IF NOT EXISTS produk_jadi (
    produk_id INT PRIMARY KEY AUTO_INCREMENT,
    nama_produk VARCHAR(100) NOT NULL,
    harga_jual DECIMAL(10,2) NOT NULL,
    stok_total INT DEFAULT 0,
    gambar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel resep_produk (relasi many-to-many antara produk_jadi dan bahan_sisa)
CREATE TABLE IF NOT EXISTS resep_produk (
    resep_id INT PRIMARY KEY AUTO_INCREMENT,
    produk_id INT NOT NULL,
    bahan_id INT NOT NULL,
    jumlah_bahan INT NOT NULL,
    FOREIGN KEY (produk_id) REFERENCES produk_jadi(produk_id) ON DELETE CASCADE,
    FOREIGN KEY (bahan_id) REFERENCES bahan_sisa(bahan_id) ON DELETE CASCADE
);

-- Insert sample data produk_jadi
INSERT INTO produk_jadi (nama_produk, harga_jual, stok_total) VALUES
('Feltimals Keychain - Katak', 20000, 10),
('Feltimals Keychain - Kelinci', 20000, 8),
('Feltimals Keychain - Kucing', 20000, 12),
('Bottle Cap Pin', 5000, 25),
('Tea Time Bookmark', 10000, 15),
('Pipecleaner Flower Charm', 15000, 20),
('Crochet Mini Cup', 25000, 5),
('Mirror Charm', 25000, 7);

-- Insert sample resep_produk
-- Feltimals Keychain - Katak
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(1, 103, 1),  -- Flanel hijau
(1, 106, 1),  -- Flanel hitam
(1, 701, 1);  -- Ring keychain

-- Feltimals Keychain - Kelinci
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(2, 105, 1),  -- Flanel putih
(2, 106, 1),  -- Flanel hitam
(2, 701, 1);  -- Ring keychain

-- Feltimals Keychain - Kucing
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(3, 104, 1),  -- Flanel kuning
(3, 106, 1),  -- Flanel hitam
(3, 701, 1);  -- Ring keychain

-- Bottle Cap Pin
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(4, 201, 1),  -- Tutup botol
(4, 402, 1);  -- Kertas kado

-- Tea Time Bookmark
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(5, 101, 2),  -- Kain perca
(5, 401, 1);  -- Karton bekas

-- Pipecleaner Flower Charm
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(6, 301, 3),  -- Pipecleaner
(6, 701, 1);  -- Ring keychain

-- Crochet Mini Cup
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(7, 601, 1),  -- Benang rajut putih
(7, 701, 1);  -- Ring keychain

-- Mirror Charm
INSERT INTO resep_produk (produk_id, bahan_id, jumlah_bahan) VALUES
(8, 102, 1),  -- Flanel pink
(8, 302, 5),  -- Manik plastik
(8, 701, 1);  -- Ring keychain
