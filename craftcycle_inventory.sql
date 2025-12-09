-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 08, 2025 at 05:36 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `craftcycle_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `bahan_rusak`
--

DROP TABLE IF EXISTS `bahan_rusak`;
CREATE TABLE IF NOT EXISTS `bahan_rusak` (
  `rusak_id` int NOT NULL AUTO_INCREMENT,
  `bahan_id` int DEFAULT NULL,
  `jumlah` decimal(10,2) DEFAULT NULL,
  `alasan` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_rusak` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rusak_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bahan_sisa`
--

DROP TABLE IF EXISTS `bahan_sisa`;
CREATE TABLE IF NOT EXISTS `bahan_sisa` (
  `bahan_id` int NOT NULL AUTO_INCREMENT,
  `nama_bahan` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kategori_id` int DEFAULT NULL,
  `berat_ukuran` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `warna` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  -- `kondisi` enum('mentah','siap-olah','rusak') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stok_total` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`bahan_id`),
  KEY `kategori_id` (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=702 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bahan_sisa`
--

INSERT INTO `bahan_sisa` (`bahan_id`, `nama_bahan`, `kategori_id`, `berat_ukuran`, `warna`, `stok_total`, `created_at`, `updated_at`) VALUES
(101, 'Kain Perca', 1, '20x20cm', 'RGB', 300, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(102, 'Kain Flanel', 1, '1m', 'pink', 5, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(103, 'Kain Flanel', 1, '1m', 'hijau', 5, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(104, 'Kain Flanel', 1, '1m', 'oren', 5, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(105, 'Kain Flanel', 1, '1m', 'kuning', 5, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(106, 'Kain Flanel', 1, '1m', 'putih', 5, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(107, 'Kain Flanel', 1, '1m', 'hitam', 5, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(108, 'Kain Flanel', 1, '1m', 'cream', 5, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(201, 'Pipecleaner', 2, '30cm', 'pink', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(202, 'Pipecleaner', 2, '30cm', 'ungu', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(203, 'Pipecleaner', 2, '30cm', 'biru', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(204, 'Pipecleaner', 2, '30cm', 'hijau', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(205, 'Pipecleaner', 2, '30cm', 'kuning', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(206, 'Pipecleaner', 2, '30cm', 'putih', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(207, 'Pipecleaner', 2, '30cm', 'merah', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(208, 'Pipecleaner', 2, '30cm', 'coklat', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(209, 'Pipecleaner', 2, '30cm', 'oren', 3000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(301, 'Milk Cotton', 3, '100m', 'putih', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(302, 'Milk Cotton', 3, '100m', 'merah', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(303, 'Milk Cotton', 3, '100m', 'hijau', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(304, 'Milk Cotton', 3, '100m', 'kuning', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(305, 'Milk Cotton', 3, '100m', 'coklat', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(306, 'Milk Cotton', 3, '100m', 'hitam', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(307, 'Milk Cotton', 3, '100m', 'cream', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(308, 'Milk Cotton', 3, '100m', 'pink', 1000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(309, 'Wol', 3, '100m', 'hijau', 500, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(310, 'Wol', 3, '100m', 'coklat', 500, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(401, 'Tutup Botol', 4, 'standar', 'perak', 50, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(402, 'Peniti', 4, '2cm', 'perak', 100, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(403, 'Rantai Biji', 4, '9.5cm', 'perak', 150, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(501, 'Plastik Fotocopy', 5, '25x40cm', 'transparan', 50, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(502, 'Manik-manik', 5, '0.5cm', 'putih', 500, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(503, 'Manik-manik', 5, '1cm', 'putih', 100, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(601, 'Kertas HVS', 6, 'A4', 'putih', 50, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(602, 'Sobekan Kertas Buku', 6, 'variasi', 'variasi', 20000, '2025-12-08 05:00:00', '2025-12-08 05:00:00'),
(701, 'Karet Kunciran', 7, '15cm', 'hitam', 50, '2025-12-08 05:00:00', '2025-12-08 05:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_bahan`
--

DROP TABLE IF EXISTS `kategori_bahan`;
CREATE TABLE IF NOT EXISTS `kategori_bahan` (
  `kategori_id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori_bahan`
--

INSERT INTO `kategori_bahan` (`kategori_id`, `nama_kategori`) VALUES
(1, 'Kain'),
(2, 'Kawat'),
(3, 'Benang'),
(4, 'Logam'),
(5, 'Plastik'),
(6, 'Kertas'),
(7, 'Karet');

-- --------------------------------------------------------

--
-- Table structure for table `produk_jadi`
--

DROP TABLE IF EXISTS `produk_jadi`;
CREATE TABLE IF NOT EXISTS `produk_jadi` (
  `produk_id` int NOT NULL AUTO_INCREMENT,
  `nama_produk` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `harga_jual` decimal(10,2) DEFAULT NULL,
  `stok_total` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`produk_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk_jadi`
--

INSERT INTO `produk_jadi` (`produk_id`, `nama_produk`, `harga_jual`, `stok_total`, `created_at`, `updated_at`) VALUES
(1, 'Cactus Charm', 15000.00, 10, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(2, 'Baby Cherry Charm', 12000.00, 15, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(3, 'Sweetcake Charm Coklat (Ceri)', 18000.00, 5, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(4, 'Sweetcake Charm Coklat (Strawberry)', 19500.00, 5, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(5, 'Sweetcake Charm Strawberry (Ceri)', 18000.00, 5, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(6, 'Sweetcake Charm Red Velvet', 18500.00, 5, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(7, 'Sweetcake Charm Matcha', 18000.00, 5, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(8, 'Sweetcake Charm Coklat (Cheese)', 19000.00, 5, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(9, 'Flowers Charm Sunflower', 16000.00, 8, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(10, 'Flowers Charm Daisy', 16000.00, 8, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(11, 'Floresca Charm (Pink/Ungu/Biru)', 15000.00, 10, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(12, 'Mini Flora', 10000.00, 15, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(13, 'Bookmark Tea Time', 8000.00, 20, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(14, 'Bottle Cap Pin', 6000.00, 25, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(15, 'Feltimals Keychain Kodok', 14000.00, 7, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(16, 'Feltimals Keychain Kelinci', 14000.00, 7, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(17, 'Feltimals Keychain Kucing', 14000.00, 7, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(18, 'Scrunchie Apple Series Cream/Merah', 12000.00, 10, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(19, 'Triple Tulip Charm Ungu/Biru/Pink', 17000.00, 6, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(20, 'Mirror Charm Tomat', 25000.00, 4, '2025-12-08 05:27:04', '2025-12-08 05:27:04'),
(21, 'Bucket Bunga Sunflower', 35000.00, 3, '2025-12-08 05:27:04', '2025-12-08 05:27:04');

-- --------------------------------------------------------

--
-- Table structure for table `resep_produk`
--

DROP TABLE IF EXISTS `resep_produk`;
CREATE TABLE IF NOT EXISTS `resep_produk` (
  `resep_id` int NOT NULL AUTO_INCREMENT,
  `produk_id` int DEFAULT NULL,
  `bahan_id` int DEFAULT NULL,
  `jumlah_bahan` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`resep_id`),
  KEY `produk_id` (`produk_id`),
  KEY `bahan_id` (`bahan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resep_produk`
--

INSERT INTO `resep_produk` (`resep_id`, `produk_id`, `bahan_id`, `jumlah_bahan`) VALUES
(1, 1, 204, 180.00),
(2, 1, 209, 60.00),
(3, 1, 208, 30.00),
(4, 1, 207, 15.00),
(5, 1, 403, 1.00),
(6, 2, 207, 30.00),
(7, 2, 204, 30.00),
(8, 2, 403, 1.00),
(9, 3, 208, 240.00),
(10, 3, 206, 150.00),
(11, 3, 207, 30.00),
(12, 3, 403, 1.00),
(13, 3, 502, 3.00),
(14, 4, 208, 240.00),
(15, 4, 201, 120.00),
(16, 4, 207, 30.00),
(17, 4, 204, 30.00),
(18, 4, 206, 30.00),
(19, 4, 403, 1.00),
(20, 4, 502, 3.00),
(21, 5, 201, 240.00),
(22, 5, 206, 150.00),
(23, 5, 207, 30.00),
(24, 5, 403, 1.00),
(25, 5, 502, 3.00),
(26, 6, 207, 240.00),
(27, 6, 209, 150.00),
(28, 6, 403, 1.00),
(29, 6, 502, 3.00),
(30, 6, 503, 1.00),
(31, 7, 204, 240.00),
(32, 7, 206, 150.00),
(33, 7, 207, 30.00),
(34, 7, 403, 1.00),
(35, 7, 502, 3.00),
(36, 8, 208, 240.00),
(37, 8, 209, 150.00),
(38, 8, 403, 1.00),
(39, 8, 502, 3.00),
(40, 8, 503, 1.00),
(41, 9, 209, 240.00),
(42, 9, 208, 60.00),
(43, 9, 204, 60.00),
(44, 9, 403, 1.00),
(45, 10, 206, 240.00),
(46, 10, 205, 60.00),
(47, 10, 204, 60.00),
(48, 10, 403, 1.00),
(49, 11, 201, 180.00),
(50, 11, 205, 60.00),
(51, 11, 403, 1.00),
(52, 12, 202, 30.00),
(53, 12, 205, 10.00),
(54, 12, 403, 1.00),
(55, 13, 101, 1.00),
(56, 13, 309, 100.00),
(57, 14, 401, 1.00),
(58, 14, 402, 1.00),
(59, 15, 103, 400.00),
(60, 15, 102, 25.00),
(61, 15, 108, 25.00),
(62, 15, 107, 25.00),
(63, 15, 403, 1.00),
(64, 16, 106, 400.00),
(65, 16, 107, 25.00),
(66, 16, 403, 1.00),
(67, 17, 104, 400.00),
(68, 17, 107, 25.00),
(69, 17, 403, 1.00),
(70, 18, 307, 100.00),
(71, 18, 302, 50.00),
(72, 18, 701, 1.00),
(73, 19, 204, 90.00),
(74, 19, 202, 30.00),
(75, 19, 203, 30.00),
(76, 19, 201, 30.00),
(77, 19, 207, 30.00),
(78, 19, 502, 1.00),
(79, 19, 403, 1.00),
(80, 20, 207, 300.00),
(81, 20, 204, 60.00),
(82, 20, 403, 1.00),
(83, 21, 209, 120.00),
(84, 21, 208, 30.00),
(85, 21, 204, 120.00),
(86, 21, 602, 100.00),
(87, 21, 501, 0.36),
(88, 21, 403, 1.00);

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_stok`
--

DROP TABLE IF EXISTS `riwayat_stok`;
CREATE TABLE IF NOT EXISTS `riwayat_stok` (
  `riwayat_id` int NOT NULL AUTO_INCREMENT,
  `bahan_id` int DEFAULT NULL,
  `tipe` enum('masuk','keluar','rusak','produksi') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `jumlah` decimal(10,2) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_general_ci,
  `tanggal` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`riwayat_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stok_keluar`
--

DROP TABLE IF EXISTS `stok_keluar`;
CREATE TABLE IF NOT EXISTS `stok_keluar` (
  `keluar_id` int NOT NULL AUTO_INCREMENT,
  `bahan_id` int DEFAULT NULL,
  `jumlah` decimal(10,2) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_keluar` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`keluar_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stok_masuk`
--

DROP TABLE IF EXISTS `stok_masuk`;
CREATE TABLE IF NOT EXISTS `stok_masuk` (
  `masuk_id` int NOT NULL AUTO_INCREMENT,
  `bahan_id` int DEFAULT NULL,
  `jumlah` decimal(10,2) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_masuk` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`masuk_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','staff','manager') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `nama`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@craft.com', '0192023a7bbd73250516f069df18b500', 'admin', '2025-12-03 00:55:51'),
(2, 'Staff Gudang', 'staff@craft.com', 'de9bf5643eabf80f4a56fda3bbb84483', 'staff', '2025-12-03 00:55:51'),
(3, 'Manager Produksi', 'manager@craft.com', '0795151defba7a4b5dfa89170de46277', 'manager', '2025-12-03 00:55:51');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bahan_rusak`
--
ALTER TABLE `bahan_rusak`
  ADD CONSTRAINT `bahan_rusak_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`),
  ADD CONSTRAINT `bahan_rusak_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `bahan_sisa`
--
ALTER TABLE `bahan_sisa`
  ADD CONSTRAINT `bahan_sisa_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_bahan` (`kategori_id`);

--
-- Constraints for table `resep_produk`
--
ALTER TABLE `resep_produk`
  ADD CONSTRAINT `resep_produk_ibfk_1` FOREIGN KEY (`produk_id`) REFERENCES `produk_jadi` (`produk_id`),
  ADD CONSTRAINT `resep_produk_ibfk_2` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`);

--
-- Constraints for table `riwayat_stok`
--
ALTER TABLE `riwayat_stok`
  ADD CONSTRAINT `riwayat_stok_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`),
  ADD CONSTRAINT `riwayat_stok_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `stok_keluar`
--
ALTER TABLE `stok_keluar`
  ADD CONSTRAINT `stok_keluar_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`),
  ADD CONSTRAINT `stok_keluar_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `stok_masuk`
--
ALTER TABLE `stok_masuk`
  ADD CONSTRAINT `stok_masuk_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`),
  ADD CONSTRAINT `stok_masuk_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
