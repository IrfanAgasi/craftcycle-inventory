-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 13, 2025 at 02:33 PM
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
  `jumlah` int DEFAULT NULL,
  `alasan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_rusak` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rusak_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bahan_rusak`
--

INSERT INTO `bahan_rusak` (`rusak_id`, `bahan_id`, `jumlah`, `alasan`, `user_id`, `tanggal_rusak`) VALUES
(1, 1, 23, 'Terbakar', 1, '2025-12-12 16:32:16'),
(2, 33, 15, 'Putus', 1, '2025-12-12 16:33:00');

-- --------------------------------------------------------

--
-- Table structure for table `bahan_sisa`
--

DROP TABLE IF EXISTS `bahan_sisa`;
CREATE TABLE IF NOT EXISTS `bahan_sisa` (
  `bahan_id` int NOT NULL AUTO_INCREMENT,
  `nama_bahan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kategori_id` int DEFAULT NULL,
  `berat_ukuran` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `warna` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stok_total` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`bahan_id`),
  KEY `kategori_id` (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bahan_sisa`
--

INSERT INTO `bahan_sisa` (`bahan_id`, `nama_bahan`, `kategori_id`, `berat_ukuran`, `warna`, `stok_total`, `created_at`, `updated_at`) VALUES
(1, 'Kain Perca', 1, '20x20 cm', 'merah', 77, '2025-12-12 15:13:54', '2025-12-12 16:32:16'),
(2, 'Kain Perca', 1, '20x20 cm', 'biru', 100, '2025-12-12 15:14:47', '2025-12-12 15:14:47'),
(3, 'Kain Perca', 1, '20x20 cm', 'hijau', 1, '2025-12-12 15:15:40', '2025-12-12 16:35:42'),
(4, 'Kain Flanel', 1, '20x20 cm', 'pink', 100, '2025-12-12 15:18:43', '2025-12-12 15:18:43'),
(5, 'Kain Flanel', 1, '20x20 cm', 'hijau', 100, '2025-12-12 15:19:21', '2025-12-12 15:19:21'),
(6, 'Kain Flanel', 1, '20x20 cm', 'orange', 100, '2025-12-12 15:20:03', '2025-12-12 15:24:04'),
(7, 'Kain Flanel', 1, '20x20 cm', 'kuning', 100, '2025-12-12 15:21:40', '2025-12-12 15:21:40'),
(8, 'Kain Flanel', 1, '20x20 cm', 'putih', 100, '2025-12-12 15:22:18', '2025-12-12 15:22:18'),
(9, 'Kain Flanel', 1, '20x20 cm', 'hitam', 100, '2025-12-12 15:22:52', '2025-12-12 15:22:52'),
(10, 'Kain Flanel', 1, '20x20 cm', 'cream', 100, '2025-12-12 15:23:42', '2025-12-12 15:23:42'),
(11, 'Pipecleaner', 2, '30 cm', 'pink', 288, '2025-12-12 15:25:12', '2025-12-13 00:58:18'),
(12, 'Pipecleaner', 2, '30 cm', 'ungu', 300, '2025-12-12 15:25:54', '2025-12-12 15:25:54'),
(13, 'Pipecleaner', 2, '30 cm', 'biru', 300, '2025-12-12 15:26:47', '2025-12-12 15:26:47'),
(14, 'Pipecleaner', 2, '30 cm', 'hijau', 297, '2025-12-12 15:30:47', '2025-12-13 00:58:18'),
(15, 'Pipecleaner', 2, '30 cm', 'kuning', 300, '2025-12-12 15:31:15', '2025-12-12 15:31:15'),
(16, 'Pipecleaner', 2, '30 cm', 'putih', 297, '2025-12-12 15:31:39', '2025-12-13 00:58:18'),
(17, 'Pipecleaner', 2, '30 cm', 'merah', 297, '2025-12-12 15:32:07', '2025-12-13 00:58:18'),
(18, 'Pipecleaner', 2, '30 cm', 'orange', 300, '2025-12-12 15:33:01', '2025-12-12 15:33:01'),
(19, 'Pipecleaner', 2, '30 cm', 'cokelat', 270, '2025-12-12 15:33:18', '2025-12-13 00:58:18'),
(20, 'Milk Cotton', 3, '100 m', 'putih', 50, '2025-12-12 16:09:32', '2025-12-12 16:09:32'),
(21, 'Milk Cotton', 3, '100 m', 'merah', 50, '2025-12-12 16:10:53', '2025-12-12 16:11:51'),
(22, 'Milk Cotton', 3, '100 m', 'hijau', 50, '2025-12-12 16:11:18', '2025-12-12 16:11:18'),
(23, 'Milk Cotton', 3, '100 m', 'kuning', 50, '2025-12-12 16:12:30', '2025-12-12 16:12:30'),
(24, 'Milk Cotton', 3, '100 m', 'cokelat', 50, '2025-12-12 16:13:34', '2025-12-12 16:13:34'),
(25, 'Milk Cotton', 3, '100 m', 'hitam', 50, '2025-12-12 16:14:12', '2025-12-12 16:14:12'),
(26, 'Milk Cotton', 3, '100 m', 'cream', 50, '2025-12-12 16:14:35', '2025-12-12 16:14:35'),
(27, 'Milk Cotton', 3, '100 m', 'pink', 50, '2025-12-12 16:14:53', '2025-12-12 16:14:53'),
(28, 'Wol', 3, '100 m', 'hijau', 50, '2025-12-12 16:15:35', '2025-12-12 16:15:35'),
(29, 'Wol', 3, '100 m', 'cokelat', 50, '2025-12-12 16:15:51', '2025-12-12 16:15:51'),
(30, 'Tutup Botol', 4, '3 cm', 'silver', 100, '2025-12-12 16:17:53', '2025-12-12 16:19:39'),
(31, 'Peniti', 4, '2 cm', 'silver', 100, '2025-12-12 16:18:24', '2025-12-12 16:19:23'),
(32, 'Ring Keychain', 4, '9.5 cm', 'silver', 997, '2025-12-12 16:19:15', '2025-12-13 00:58:18'),
(33, 'Karet Kunciran', 7, '15 cm', 'hitam', 195, '2025-12-12 16:20:19', '2025-12-12 16:37:31'),
(34, 'Plastik Fotocopy', 5, '25x40 cm', 'transparant', 100, '2025-12-12 16:21:13', '2025-12-12 16:21:13'),
(35, 'Manik-manik', 5, '0.5 cm', 'putih', 291, '2025-12-12 16:22:08', '2025-12-13 00:58:18'),
(36, 'Manik-manik', 5, '1 cm', 'putih', 300, '2025-12-12 16:22:33', '2025-12-12 16:22:33'),
(37, 'Sobekan Buku', 6, '210 x 297 mm', 'putih', 100, '2025-12-12 16:23:22', '2025-12-12 16:26:49'),
(38, 'Karet Kunciran', 7, '10 cm', 'hitam', 100, '2025-12-13 01:31:44', '2025-12-13 01:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_bahan`
--

DROP TABLE IF EXISTS `kategori_bahan`;
CREATE TABLE IF NOT EXISTS `kategori_bahan` (
  `kategori_id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
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
  `nama_produk` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `harga_jual` decimal(10,2) DEFAULT NULL,
  `stok_total` int DEFAULT '0',
  `gambar_url` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`produk_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk_jadi`
--

INSERT INTO `produk_jadi` (`produk_id`, `nama_produk`, `harga_jual`, `stok_total`, `gambar_url`, `created_at`, `updated_at`) VALUES
(1, 'Baby Cherry Charm', 5000.00, 0, 'http://localhost:3000/uploads/products/product-1765532643571-188209705.png', '2025-12-12 16:44:03', '2025-12-12 16:44:19'),
(2, 'Cactus Charm', 10000.00, 0, 'http://localhost:3000/uploads/products/product-1765532772782-387069068.png', '2025-12-12 16:46:12', '2025-12-12 16:46:12'),
(3, 'Flowers Charm - Sunflower', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765533680185-146347935.png', '2025-12-12 17:01:20', '2025-12-12 17:07:35'),
(4, 'Flowers Charm - Daisy', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765533805065-879517156.png', '2025-12-12 17:03:25', '2025-12-12 17:07:24'),
(5, 'Mini Flora - Pink', 3000.00, 0, 'http://localhost:3000/uploads/products/product-1765533885820-738461074.png', '2025-12-12 17:04:45', '2025-12-12 17:07:06'),
(6, 'Mini Flora - Ungu', 3000.00, 0, 'http://localhost:3000/uploads/products/product-1765533938505-15259430.png', '2025-12-12 17:05:38', '2025-12-12 17:06:57'),
(7, 'Mini Flora - Biru', 3000.00, 0, 'http://localhost:3000/uploads/products/product-1765533990228-216737454.png', '2025-12-12 17:06:30', '2025-12-12 17:06:48'),
(8, 'Bottle Cap Pin', 5000.00, 0, 'http://localhost:3000/uploads/products/product-1765534118220-591046410.png', '2025-12-12 17:08:38', '2025-12-12 17:08:38'),
(9, 'Feltimals Keychain - Kodok (7 cm)', 20000.00, 0, 'http://localhost:3000/uploads/products/product-1765534399549-762657569.png', '2025-12-12 17:13:19', '2025-12-12 17:13:19'),
(10, 'Feltimals Keychain - Kodok (4 cm)', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765534482740-899847590.png', '2025-12-12 17:14:42', '2025-12-12 17:14:42'),
(11, 'Feltimals Keychain - Kelinci (7 cm)', 20000.00, 0, 'http://localhost:3000/uploads/products/product-1765561375042-775964750.png', '2025-12-12 17:16:27', '2025-12-13 00:42:55'),
(12, 'Feltimals Keychain - Kelinci (4 cm)', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765561384913-68349618.png', '2025-12-12 17:17:14', '2025-12-13 00:43:04'),
(13, 'Scrunchie Chochet', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765534725066-385806236.png', '2025-12-12 17:18:45', '2025-12-12 17:18:45'),
(14, 'Triple Tulip - ver 1', 10000.00, 0, 'http://localhost:3000/uploads/products/product-1765534881234-135851580.png', '2025-12-12 17:21:21', '2025-12-12 17:21:21'),
(15, 'Triple Tulip - ver 2', 10000.00, 0, 'http://localhost:3000/uploads/products/product-1765534985476-878968433.png', '2025-12-12 17:23:05', '2025-12-12 17:23:05'),
(16, 'Mirror Charm - Strawberry', 25000.00, 0, 'http://localhost:3000/uploads/products/product-1765535087366-789412861.png', '2025-12-12 17:24:47', '2025-12-12 17:24:47'),
(17, 'Feltimals Keychain - Kucing (7 cm)', 20000.00, 0, 'http://localhost:3000/uploads/products/product-1765560472639-919057930.png', '2025-12-12 17:27:41', '2025-12-13 00:27:52'),
(18, 'Feltimals Keychain - Kucing (4 cm)', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765560484928-78251653.png', '2025-12-12 17:28:37', '2025-12-13 00:28:04'),
(19, 'Bookmark Tea Time', 10000.00, 0, 'http://localhost:3000/uploads/products/product-1765561263116-152978044.png', '2025-12-12 17:30:33', '2025-12-13 00:41:03'),
(20, 'Floresca Charm - Pink', 12000.00, 0, 'http://localhost:3000/uploads/products/product-1765561274696-943149657.png', '2025-12-12 17:32:31', '2025-12-13 00:41:14'),
(21, 'Floresca Charm - Biru', 12000.00, 0, 'http://localhost:3000/uploads/products/product-1765561284405-539077563.png', '2025-12-12 17:33:16', '2025-12-13 00:41:24'),
(22, 'Floresca Charm - Ungu', 12000.00, 0, 'http://localhost:3000/uploads/products/product-1765561295832-449721579.png', '2025-12-12 17:34:01', '2025-12-13 00:41:35'),
(23, 'Mirror Charm - Tomato', 25000.00, 0, 'http://localhost:3000/uploads/products/product-1765561305469-637803120.png', '2025-12-12 17:35:10', '2025-12-13 00:41:45'),
(24, 'Mirror Charm - Daisy', 25000.00, 0, 'http://localhost:3000/uploads/products/product-1765561818092-641911168.png', '2025-12-12 17:36:10', '2025-12-13 00:50:18'),
(25, 'Bucket Bunga Mini - Sunflower', 20000.00, 0, 'http://localhost:3000/uploads/products/product-1765561318013-470933039.png', '2025-12-12 17:39:25', '2025-12-13 00:41:58'),
(26, 'Bucket Bunga Mini - Ungu', 25000.00, 0, 'http://localhost:3000/uploads/products/product-1765561327760-622412714.png', '2025-12-12 17:41:21', '2025-12-13 00:42:07'),
(27, 'Sweetcake Charm - Strawberry (Cherry)', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765536275962-820500490.png', '2025-12-12 17:44:35', '2025-12-12 17:44:35'),
(28, 'Sweetcake Charm - Strawberry Full', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765561346694-175500488.png', '2025-12-12 17:46:54', '2025-12-13 00:42:26'),
(29, 'Sweetcake Charm - Red Velvet', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765561495372-634795545.png', '2025-12-12 17:49:25', '2025-12-13 00:44:55'),
(30, 'Sweetcake Charm - Matcha', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765562071953-649202541.jpg', '2025-12-12 17:51:10', '2025-12-13 00:54:31'),
(31, 'Sweetcake Charm - Chocolate (Cheese)', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765561483878-185530273.png', '2025-12-12 17:52:35', '2025-12-13 00:44:43'),
(32, 'Sweetcake Charm - Chocolate (Cherry)', 15000.00, 0, 'http://localhost:3000/uploads/products/product-1765561406345-894709134.png', '2025-12-12 17:56:11', '2025-12-13 00:43:26'),
(33, 'Sweetcake Charm - Chocolate (Strawberry)', 15000.00, 3, 'http://localhost:3000/uploads/products/product-1765561415559-440255108.png', '2025-12-12 17:58:52', '2025-12-13 00:58:18');

-- --------------------------------------------------------

--
-- Table structure for table `resep_produk`
--

DROP TABLE IF EXISTS `resep_produk`;
CREATE TABLE IF NOT EXISTS `resep_produk` (
  `resep_id` int NOT NULL AUTO_INCREMENT,
  `produk_id` int DEFAULT NULL,
  `bahan_id` int DEFAULT NULL,
  `jumlah_bahan` int DEFAULT NULL,
  PRIMARY KEY (`resep_id`),
  KEY `produk_id` (`produk_id`),
  KEY `bahan_id` (`bahan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resep_produk`
--

INSERT INTO `resep_produk` (`resep_id`, `produk_id`, `bahan_id`, `jumlah_bahan`) VALUES
(4, 1, 17, 1),
(5, 1, 14, 1),
(6, 1, 32, 1),
(33, 7, 13, 1),
(34, 7, 15, 1),
(35, 7, 32, 1),
(36, 6, 12, 1),
(37, 6, 15, 1),
(38, 6, 32, 1),
(39, 5, 11, 1),
(40, 5, 15, 1),
(41, 5, 32, 1),
(42, 4, 15, 2),
(43, 4, 16, 8),
(44, 4, 14, 2),
(45, 4, 32, 1),
(46, 3, 18, 8),
(47, 3, 19, 2),
(48, 3, 14, 2),
(49, 3, 32, 1),
(50, 8, 31, 1),
(51, 8, 30, 1),
(52, 9, 5, 1),
(53, 9, 9, 1),
(54, 9, 10, 1),
(55, 9, 4, 1),
(56, 9, 32, 1),
(57, 10, 5, 1),
(58, 10, 9, 1),
(59, 10, 10, 1),
(60, 10, 4, 1),
(61, 10, 32, 1),
(68, 13, 26, 1),
(69, 13, 21, 1),
(70, 13, 22, 1),
(71, 13, 33, 1),
(72, 14, 14, 3),
(73, 14, 11, 1),
(74, 14, 12, 1),
(75, 14, 13, 1),
(76, 14, 17, 1),
(77, 14, 35, 1),
(78, 14, 32, 1),
(79, 15, 14, 3),
(80, 15, 17, 1),
(81, 15, 15, 1),
(82, 15, 18, 1),
(83, 15, 11, 1),
(84, 15, 32, 1),
(85, 15, 35, 1),
(86, 16, 11, 10),
(87, 16, 14, 2),
(88, 16, 16, 1),
(89, 16, 32, 1),
(90, 2, 14, 6),
(91, 2, 19, 1),
(92, 2, 17, 1),
(93, 2, 18, 2),
(94, 2, 32, 1),
(140, 27, 11, 10),
(141, 27, 16, 5),
(142, 27, 17, 1),
(143, 27, 32, 1),
(144, 27, 35, 3),
(198, 17, 6, 1),
(199, 17, 7, 1),
(200, 17, 9, 1),
(201, 17, 32, 1),
(202, 18, 6, 1),
(203, 18, 9, 1),
(204, 18, 7, 1),
(205, 18, 32, 1),
(206, 19, 3, 1),
(207, 19, 29, 1),
(208, 19, 28, 1),
(209, 19, 2, 1),
(210, 20, 11, 6),
(211, 20, 15, 2),
(212, 20, 32, 1),
(213, 21, 13, 6),
(214, 21, 15, 2),
(215, 21, 32, 1),
(216, 22, 12, 6),
(217, 22, 15, 2),
(218, 22, 32, 1),
(219, 23, 17, 10),
(220, 23, 14, 2),
(221, 23, 32, 1),
(222, 25, 18, 4),
(223, 25, 19, 1),
(224, 25, 14, 4),
(225, 25, 37, 1),
(226, 25, 34, 1),
(227, 25, 32, 1),
(228, 26, 14, 3),
(229, 26, 12, 4),
(230, 26, 16, 10),
(231, 26, 32, 1),
(232, 28, 11, 10),
(233, 28, 16, 5),
(234, 28, 17, 1),
(235, 28, 14, 1),
(236, 28, 32, 1),
(237, 28, 35, 3),
(243, 11, 8, 1),
(244, 11, 9, 1),
(245, 11, 32, 1),
(246, 12, 9, 1),
(247, 12, 8, 1),
(248, 12, 32, 1),
(249, 32, 19, 10),
(250, 32, 16, 5),
(251, 32, 17, 1),
(252, 32, 32, 1),
(253, 32, 35, 3),
(254, 33, 19, 10),
(255, 33, 11, 4),
(256, 33, 17, 1),
(257, 33, 14, 1),
(258, 33, 32, 1),
(259, 33, 35, 3),
(260, 33, 16, 1),
(261, 31, 19, 10),
(262, 31, 18, 5),
(263, 31, 32, 1),
(264, 31, 36, 1),
(265, 31, 35, 3),
(266, 29, 17, 10),
(267, 29, 18, 5),
(268, 29, 32, 1),
(269, 29, 36, 1),
(270, 29, 35, 3),
(271, 24, 16, 10),
(272, 24, 15, 3),
(273, 24, 14, 2),
(274, 24, 32, 1),
(275, 30, 14, 10),
(276, 30, 16, 5),
(277, 30, 17, 1),
(278, 30, 32, 1),
(279, 30, 35, 3);

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_stok`
--

DROP TABLE IF EXISTS `riwayat_stok`;
CREATE TABLE IF NOT EXISTS `riwayat_stok` (
  `riwayat_id` int NOT NULL AUTO_INCREMENT,
  `bahan_id` int DEFAULT NULL,
  `nama_bahan_cache` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipe` enum('masuk','keluar','rusak') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `jumlah` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `tanggal` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`riwayat_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `riwayat_stok`
--

INSERT INTO `riwayat_stok` (`riwayat_id`, `bahan_id`, `nama_bahan_cache`, `tipe`, `jumlah`, `user_id`, `keterangan`, `tanggal`) VALUES
(1, 1, 'Kain Perca - merah (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:13:54'),
(2, 2, 'Kain Perca - biru (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:14:47'),
(3, 3, 'Kain Perca - hijau (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:15:40'),
(4, 4, 'Kain Flanel - pink (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:18:43'),
(5, 5, 'Kain Flanel - hijau (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:19:21'),
(6, 6, 'Kain Flanel - oren (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:20:03'),
(7, 7, 'Kain Flanel - kuning (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:21:40'),
(8, 8, 'Kain Flanel - putih (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:22:18'),
(9, 9, 'Kain Flanel - hitam (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:22:52'),
(10, 10, 'Kain Flanel - cream (20x20 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:23:42'),
(11, 11, 'Pipecleaner - pink (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:25:12'),
(12, 12, 'Pipecleaner - ungu (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:25:54'),
(13, 13, 'Pipecleaner - biru (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:26:47'),
(14, 14, 'Pipecleaner - hijau (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:30:47'),
(15, 15, 'Pipecleaner - kuning (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:31:15'),
(16, 16, 'Pipecleaner - putih (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:31:39'),
(17, 17, 'Pipecleanerrrr - merah (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:32:08'),
(18, 18, 'Pipecleaner - orange (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:33:01'),
(19, 19, 'Pipecleaner - coklat (30 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 15:33:18'),
(20, 20, 'Milk Cotton - putih (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:09:32'),
(21, 21, 'Milk Cotton - merah (100)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:10:53'),
(22, 22, 'Milk Cotton - hijau (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:11:18'),
(23, 23, 'Milk Cotton - kuning (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:12:30'),
(24, 24, 'Milk Cotton - cokelat (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:13:34'),
(25, 25, 'Milk Cotton - hitam (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:14:12'),
(26, 26, 'Milk Cotton - cream (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:14:35'),
(27, 27, 'Milk Cotton - pink (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:14:53'),
(28, 28, 'Wol - hijau (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:15:35'),
(29, 29, 'Wol - cokelat (100 m)', 'masuk', 50, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:15:51'),
(30, 30, 'Tutup Botol - perak (3 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:17:53'),
(31, 31, 'Peniti - perak (2 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:18:24'),
(32, 32, 'Ring Keychain - silver (9.5 cm)', 'masuk', 1000, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:19:15'),
(33, 33, 'Karet Kunciran - hitam (15 cm)', 'masuk', 200, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:20:19'),
(34, 34, 'Plastik Fotocopy - transparant (25x40 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:21:13'),
(35, 35, 'Manik-manik - putih (0.5 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:22:08'),
(36, 36, 'Manik-manik - putih (1 cm)', 'masuk', 300, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:22:33'),
(37, 37, 'Kertas Hvs - putih (a4)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-12 16:23:22'),
(38, 1, 'Kain Perca - merah (20x20 cm)', 'rusak', 23, 1, 'Rusak: Terbakar', '2025-12-12 16:32:16'),
(39, 33, 'Karet Kunciran - hitam (15 cm)', 'rusak', 15, 1, 'Rusak: Putus', '2025-12-12 16:33:00'),
(40, 3, 'Kain Perca - hijau (20x20 cm)', 'keluar', 99, 1, 'Lainnya: Salah input', '2025-12-12 16:35:42'),
(41, 33, 'Karet Kunciran - hitam (15 cm)', 'masuk', 10, 1, 'Stok Masuk', '2025-12-12 16:37:31'),
(42, 19, 'Pipecleaner - cokelat (30 cm)', 'keluar', 30, 1, 'Produksi 3x Sweetcake Charm - Chocolate (Strawberry)', '2025-12-13 00:58:18'),
(43, 11, 'Pipecleaner - pink (30 cm)', 'keluar', 12, 1, 'Produksi 3x Sweetcake Charm - Chocolate (Strawberry)', '2025-12-13 00:58:18'),
(44, 17, 'Pipecleaner - merah (30 cm)', 'keluar', 3, 1, 'Produksi 3x Sweetcake Charm - Chocolate (Strawberry)', '2025-12-13 00:58:18'),
(45, 14, 'Pipecleaner - hijau (30 cm)', 'keluar', 3, 1, 'Produksi 3x Sweetcake Charm - Chocolate (Strawberry)', '2025-12-13 00:58:18'),
(46, 32, 'Ring Keychain - silver (9.5 cm)', 'keluar', 3, 1, 'Produksi 3x Sweetcake Charm - Chocolate (Strawberry)', '2025-12-13 00:58:18'),
(47, 35, 'Manik-manik - putih (0.5 cm)', 'keluar', 9, 1, 'Produksi 3x Sweetcake Charm - Chocolate (Strawberry)', '2025-12-13 00:58:18'),
(48, 16, 'Pipecleaner - putih (30 cm)', 'keluar', 3, 1, 'Produksi 3x Sweetcake Charm - Chocolate (Strawberry)', '2025-12-13 00:58:18'),
(49, 38, 'Karet Kunciran - hitam (10 cm)', 'masuk', 100, 1, 'Stok awal saat menambah bahan baru', '2025-12-13 01:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `stok_keluar`
--

DROP TABLE IF EXISTS `stok_keluar`;
CREATE TABLE IF NOT EXISTS `stok_keluar` (
  `keluar_id` int NOT NULL AUTO_INCREMENT,
  `bahan_id` int DEFAULT NULL,
  `jumlah` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_keluar` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`keluar_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stok_keluar`
--

INSERT INTO `stok_keluar` (`keluar_id`, `bahan_id`, `jumlah`, `user_id`, `tanggal_keluar`) VALUES
(1, 1, 23, 1, '2025-12-12 16:32:16'),
(2, 33, 15, 1, '2025-12-12 16:33:00'),
(3, 3, 99, 1, '2025-12-12 16:35:42');

-- --------------------------------------------------------

--
-- Table structure for table `stok_masuk`
--

DROP TABLE IF EXISTS `stok_masuk`;
CREATE TABLE IF NOT EXISTS `stok_masuk` (
  `masuk_id` int NOT NULL AUTO_INCREMENT,
  `bahan_id` int DEFAULT NULL,
  `jumlah` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tanggal_masuk` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`masuk_id`),
  KEY `bahan_id` (`bahan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stok_masuk`
--

INSERT INTO `stok_masuk` (`masuk_id`, `bahan_id`, `jumlah`, `user_id`, `tanggal_masuk`) VALUES
(1, 33, 10, 1, '2025-12-12 16:37:31'),
(2, 38, 100, 1, '2025-12-13 01:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','staff','manager') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `nama`, `email`, `password`, `role`, `created_at`, `is_deleted`) VALUES
(1, 'Admin', 'admin@craftcycle.id', '0192023a7bbd73250516f069df18b500', 'admin', '2025-12-03 00:55:51', 0),
(2, 'Staff Gudang', 'staff@craftcycle.id', 'de9bf5643eabf80f4a56fda3bbb84483', 'staff', '2025-12-03 00:55:51', 0),
(3, 'Manager Produksi', 'manager@craftcycle.id', '0795151defba7a4b5dfa89170de46277', 'manager', '2025-12-03 00:55:51', 0),
(4, 'Citra Ayu Ardhanareswari', 'citra@craftcycle.id', 'a471cc23d89f15b4c552246412714ee8', 'staff', '2025-12-08 22:14:59', 1),
(5, 'Irfan Agasi', 'panjul@craftcycle.id', '71fd4287dbf8d7ae96dbaf856c538423', 'staff', '2025-12-12 16:29:27', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bahan_rusak`
--
ALTER TABLE `bahan_rusak`
  ADD CONSTRAINT `bahan_rusak_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`) ON DELETE SET NULL,
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
  ADD CONSTRAINT `riwayat_stok_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `riwayat_stok_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `stok_keluar`
--
ALTER TABLE `stok_keluar`
  ADD CONSTRAINT `stok_keluar_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stok_keluar_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `stok_masuk`
--
ALTER TABLE `stok_masuk`
  ADD CONSTRAINT `stok_masuk_ibfk_1` FOREIGN KEY (`bahan_id`) REFERENCES `bahan_sisa` (`bahan_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stok_masuk_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
