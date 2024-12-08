-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2024 at 04:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacation_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'User', 'admin@test.com', '$2a$10$m3/9dp5hwlCCPG2WnLgBI.DykIR7SRCcicnbE6DDmXslXunEiPR1S', 'admin', '2024-12-04 10:01:36.652339', '2024-12-04 10:01:36.652339'),
(2, 'Regular', 'User', 'user@test.com', '$2a$10$m3/9dp5hwlCCPG2WnLgBI.DykIR7SRCcicnbE6DDmXslXunEiPR1S', 'user', '2024-12-04 10:01:36.661544', '2024-12-04 10:01:36.661544'),
(3, 'אלעד', 'יעקובוביץ\'', 'elad@test.com', '$2a$10$lYTR0UmQ4Rv90cm6p/yiR.KGr92a30si2YwygmUlq5ix509fwi9r.', 'user', '2024-12-04 10:11:44.474240', '2024-12-04 10:11:44.474240');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `id` int(11) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`id`, `destination`, `description`, `startDate`, `endDate`, `price`, `imageUrl`, `createdAt`, `updatedAt`) VALUES
(25, 'פריז, צרפת', 'עיר האורות והרומנטיקה. טיול מושלם הכולל ביקור במגדל אייפל, מוזיאון הלובר, ושיט על נהר הסן.', '2024-06-15', '2024-06-22', 3500.00, '/uploads/vacations/paris.jpg', '2024-12-04 18:16:08.232780', '2024-12-04 18:16:08.232780'),
(26, 'טוקיו, יפן', 'חוויה יפנית אותנטית. שילוב מושלם של מסורת ומודרניות, כולל ביקור במקדשים עתיקים ובשכונות הייטק.', '2024-07-01', '2024-07-10', 5500.00, '/uploads/vacations/tokyo.jpg', '2024-12-04 18:16:08.238966', '2024-12-04 18:16:08.238966'),
(27, 'ברצלונה, ספרד', 'עיר תוססת עם אדריכלות מרהיבה של גאודי, אוכל מעולה וחופים מדהימים.', '2024-08-10', '2024-08-17', 3200.00, '/uploads/vacations/barcelona.jpg', '2024-12-04 18:16:08.242814', '2024-12-04 18:16:08.242814'),
(28, 'ניו יורק, ארה\"ב', 'העיר שלא ישנה לעולם. כולל סיור בסנטרל פארק, טיימס סקוור, ומוזיאונים מובילים.', '2024-09-05', '2024-09-12', 4800.00, '/uploads/vacations/nyc.jpg', '2024-12-04 18:16:08.243732', '2024-12-04 18:16:08.243732'),
(29, 'מלדיביים', 'גן עדן טרופי עם חופים לבנים, מים צלולים ובקתות מעל המים.', '2024-10-15', '2024-10-25', 7800.00, '/uploads/vacations/maldives.jpg', '2024-12-04 18:16:08.245105', '2024-12-04 18:16:08.245105'),
(30, 'רומא, איטליה', 'העיר הנצחית. טיול הכולל ביקור בקולוסיאום, ותיקן, ומזרקת טרווי.', '2024-11-01', '2024-11-08', 3800.00, '/uploads/vacations/rome.jpg', '2024-12-04 18:16:08.246044', '2024-12-04 18:16:08.246044'),
(31, 'אמסטרדם, הולנד', 'עיר התעלות היפה. סיור באופניים, ביקור במוזיאון ואן גוך ושיט בתעלות.', '2024-12-05', '2024-12-12', 3300.00, '/uploads/vacations/amsterdam.jpg', '2024-12-04 18:16:08.246839', '2024-12-04 18:16:08.246839'),
(32, 'דובאי, איחוד האמירויות', 'חוויית יוקרה במדבר. ביקור בבורג׳ חליפה, ספארי במדבר וקניות בקניונים מפוארים.', '2025-01-10', '2025-01-17', 4200.00, '/uploads/vacations/dubai.jpg', '2024-12-04 18:16:08.247513', '2024-12-04 18:16:08.247513'),
(33, 'לונדון, אנגליה', 'עיר קוסמופוליטית עם היסטוריה עשירה. ביקור בארמון בקינגהאם, ביג בן ולונדון איי.', '2025-02-01', '2025-02-10', 4800.00, '/uploads/vacations/london.jpg', '2024-12-04 18:16:08.248386', '2024-12-04 18:16:08.248386'),
(34, 'סנטוריני, יוון', 'אי קסום עם נופים מרהיבים, שקיעות מדהימות ואדריכלות ייחודית.', '2025-03-01', '2025-03-08', 3900.00, '/uploads/vacations/maldives.jpg', '2024-12-04 18:16:08.249130', '2024-12-04 18:16:08.249130');

-- --------------------------------------------------------

--
-- Table structure for table `vacation_follows`
--

CREATE TABLE `vacation_follows` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `userId` int(11) DEFAULT NULL,
  `vacationId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vacation_follows`
--

INSERT INTO `vacation_follows` (`id`, `createdAt`, `userId`, `vacationId`) VALUES
(34, '2024-12-04 18:16:08.273184', 2, 25),
(35, '2024-12-04 18:16:08.277475', 2, 26),
(36, '2024-12-04 18:16:08.280985', 2, 27),
(37, '2024-12-04 18:16:08.281595', 3, 27),
(38, '2024-12-04 18:16:08.286047', 2, 28),
(39, '2024-12-04 18:16:08.286566', 3, 28),
(40, '2024-12-04 18:16:08.287260', 1, 28),
(41, '2024-12-04 18:16:08.291927', 2, 29),
(42, '2024-12-04 18:16:08.292410', 3, 29),
(43, '2024-12-04 18:16:08.296329', 3, 30),
(44, '2024-12-04 18:16:08.299504', 3, 31),
(45, '2024-12-04 18:16:08.300113', 1, 31),
(46, '2024-12-04 18:16:08.304408', 3, 32),
(47, '2024-12-04 18:16:08.304926', 1, 32),
(48, '2024-12-04 18:16:08.308586', 1, 33),
(49, '2024-12-04 18:16:08.309089', 2, 33),
(50, '2024-12-04 18:16:08.309552', 3, 33),
(51, '2024-12-04 18:16:08.317870', 3, 34),
(52, '2024-12-04 18:16:08.318531', 2, 34);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vacation_follows`
--
ALTER TABLE `vacation_follows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_fee4b29d901462568a1e2efc884` (`userId`),
  ADD KEY `FK_ac00c1f385ddb6a34e3f9470ffa` (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `vacation_follows`
--
ALTER TABLE `vacation_follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `vacation_follows`
--
ALTER TABLE `vacation_follows`
  ADD CONSTRAINT `FK_ac00c1f385ddb6a34e3f9470ffa` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fee4b29d901462568a1e2efc884` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
