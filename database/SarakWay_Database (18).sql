-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 21, 2026 at 09:37 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `SarakWay_Database`
--

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `alert_id` int(11) NOT NULL,
  `device_id` varchar(50) DEFAULT NULL,
  `activity_type` varchar(100) NOT NULL,
  `video_url` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `severity` varchar(50) NOT NULL DEFAULT 'Low',
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'New',
  `assigned_to` int(11) DEFAULT NULL,
  `is_broadcast` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `alert_severity`
--

CREATE TABLE `alert_severity` (
  `severity_id` int(11) NOT NULL,
  `severity_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alert_severity`
--

INSERT INTO `alert_severity` (`severity_id`, `severity_name`) VALUES
(1, 'Low'),
(2, 'Medium'),
(3, 'High'),
(4, 'Critical');

-- --------------------------------------------------------

--
-- Table structure for table `alert_status`
--

CREATE TABLE `alert_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alert_status`
--

INSERT INTO `alert_status` (`status_id`, `status_name`) VALUES
(1, 'New'),
(2, 'Reviewing'),
(3, 'Resolved'),
(4, 'Dismissed');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Conservation'),
(2, 'Biodiversity'),
(3, 'Eco-tourism'),
(4, 'Legislation'),
(5, 'Safety');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `certificate_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `park_id` int(11) NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved_at` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`certificate_id`, `user_id`, `park_id`, `status`, `requested_at`, `approved_at`, `approved_by`, `created_at`) VALUES
(1, 2, 1, 'Approved', '2026-05-07 20:09:53', '2026-05-08 04:53:32', 1, '2026-05-07 20:09:53');

-- --------------------------------------------------------

--
-- Table structure for table `certificate_types`
--

CREATE TABLE `certificate_types` (
  `certificate_type_id` int(11) NOT NULL,
  `park_id` int(11) DEFAULT NULL,
  `certificate_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `cert_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `certificate_type_id` int(11) NOT NULL,
  `issued_date` date DEFAULT NULL,
  `cert_status` enum('pending','approved','rejected') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` varchar(50) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `park_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `prerequisite_course_id` varchar(50) DEFAULT NULL,
  `is_mandatory` tinyint(1) NOT NULL,
  `image_url` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Published',
  `total_duration` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_name`, `description`, `park_id`, `created_by`, `prerequisite_course_id`, `is_mandatory`, `image_url`, `category_id`, `status`, `total_duration`) VALUES
('COURSE_1778157399838', 'General Park Guide Orientation', 'This mandatory onboarding course introduces all newly recruited park guides to SarakWay’s operational standards, visitor engagement practices, environmental responsibilities, and workplace safety expectations. The course prepares guides to confidently conduct tours, assist visitors, respond to emergencies, and represent Sarawak’s protected parks professionally.', NULL, 1, NULL, 1, NULL, NULL, 'Published', 48),
('COURSE_1778168841504', 'Bako National Park TPA – Conservation Practices', 'This course trains park guides on conservation responsibilities within Bako National Park, including habitat protection, wildlife preservation, waste management, and sustainable visitor practices.', 1, 1, NULL, 0, NULL, 1, 'Published', 34),
('COURSE_1778168901968', 'Bako National Park TPA – Biodiversity Awareness', 'This course introduces guides to the biodiversity of Bako National Park, including endemic species, mangrove ecosystems, rainforest habitats, and wildlife identification.', 1, 1, NULL, 0, NULL, 2, 'Published', 35),
('COURSE_1778169015839', 'Bako National Park TPA – Eco-Tourism Operations', 'This course prepares guides to deliver responsible eco-tourism experiences while balancing visitor satisfaction with environmental sustainability.', 1, 1, NULL, 0, NULL, 3, 'Published', 34),
('COURSE_1778169156057', 'Bako National Park TPA – Park Legislation and Compliance', 'This course educates guides on regulations, park rules, wildlife laws, visitor compliance, and legal responsibilities while operating within Bako National Park.', 1, 1, NULL, 0, 'https://unsplash.com/s/photos/free-images', 4, 'Published', 34),
('COURSE_1778169241952', 'Bako National Park TPA – Safety and Emergency Response', 'This course trains guides to respond effectively to emergencies, ensure visitor safety, manage environmental hazards, and follow emergency protocols.', 1, 1, NULL, 0, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', 5, 'Published', 17);

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `device_id` varchar(50) NOT NULL,
  `assigned_user_id` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `last_active` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `device_recordings`
--

CREATE TABLE `device_recordings` (
  `id` int(11) NOT NULL,
  `device_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `iot_alerts`
--

CREATE TABLE `iot_alerts` (
  `id` int(11) NOT NULL,
  `sensor_type` varchar(100) NOT NULL,
  `alert_message` text NOT NULL,
  `status` enum('New','Reviewing','Resolved','Dismissed') DEFAULT 'New',
  `triggered_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `iot_alerts`
--

INSERT INTO `iot_alerts` (`id`, `sensor_type`, `alert_message`, `status`, `triggered_at`) VALUES
(41, 'Smart Sensor System', 'Motion detected at 1.0 cm.', 'New', '2026-05-13 10:57:36'),
(42, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:02:51'),
(43, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:02:53'),
(44, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:02:56'),
(45, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:02:59'),
(46, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:02'),
(47, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:05'),
(48, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:08'),
(49, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:11'),
(50, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:14'),
(51, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:17'),
(52, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:20'),
(53, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:23'),
(54, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:26'),
(55, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:29'),
(56, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:32'),
(57, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:35'),
(58, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:38'),
(59, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:41'),
(60, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:44'),
(61, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:47'),
(62, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:50'),
(63, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:53'),
(64, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:56'),
(65, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:03:59'),
(66, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:02'),
(67, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:07'),
(68, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:10'),
(69, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:13'),
(70, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:16'),
(71, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:19'),
(72, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:22'),
(73, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:25'),
(74, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:28'),
(75, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:31'),
(76, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:34'),
(77, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:37'),
(78, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:40'),
(79, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:43'),
(80, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:46'),
(81, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:49'),
(82, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:52'),
(83, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:55'),
(84, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:04:58'),
(85, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:01'),
(86, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:04'),
(87, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:07'),
(88, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:10'),
(89, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:13'),
(90, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:16'),
(91, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:19'),
(92, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:22'),
(93, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:25'),
(94, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:28'),
(95, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:31'),
(96, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:34'),
(97, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:37'),
(98, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:40'),
(99, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:43'),
(100, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-13 11:05:46'),
(101, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:46'),
(102, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:49'),
(103, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:52'),
(104, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:55'),
(105, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:05:58'),
(106, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:01'),
(107, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:04'),
(108, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:07'),
(109, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:10'),
(110, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:13'),
(111, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:16'),
(112, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:19'),
(113, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:22'),
(114, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:25'),
(115, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:28'),
(116, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:31'),
(117, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:34'),
(118, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:37'),
(119, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:40'),
(120, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:43'),
(121, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:46'),
(122, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:49'),
(123, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:52'),
(124, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:55'),
(125, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:06:58'),
(126, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:01'),
(127, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:04'),
(128, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:07'),
(129, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:10'),
(130, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:13'),
(131, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:16'),
(132, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:19'),
(133, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:22'),
(134, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:25'),
(135, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:28'),
(136, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:31'),
(137, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:34'),
(138, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:37'),
(139, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:40'),
(140, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:43'),
(141, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:46'),
(142, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:49'),
(143, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:52'),
(144, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:55'),
(145, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:07:58'),
(146, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:01'),
(147, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:04'),
(148, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:07'),
(149, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:10'),
(150, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:13'),
(151, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:16'),
(152, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:19'),
(153, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:22'),
(154, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:25'),
(155, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:28'),
(156, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:31'),
(157, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:34'),
(158, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:37'),
(159, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:40'),
(160, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:43'),
(161, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:46'),
(162, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:49'),
(163, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:52'),
(164, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:55'),
(165, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:08:58'),
(166, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:01'),
(167, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:04'),
(168, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:07'),
(169, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:10'),
(170, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:13'),
(171, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:16'),
(172, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:19'),
(173, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:22'),
(174, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:25'),
(175, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:28'),
(176, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:31'),
(177, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:34'),
(178, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:37'),
(179, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:40'),
(180, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:43'),
(181, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:46'),
(182, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:49'),
(183, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:52'),
(184, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:55'),
(185, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:09:58'),
(186, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:01'),
(187, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:04'),
(188, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:07'),
(189, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:10'),
(190, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:13'),
(191, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:16'),
(192, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:19'),
(193, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:22'),
(194, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:25'),
(195, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:28'),
(196, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:31'),
(197, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:34'),
(198, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:37'),
(199, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:40'),
(200, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:43'),
(201, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:46'),
(202, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:49'),
(203, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:52'),
(204, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:55'),
(205, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:10:58'),
(206, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:01'),
(207, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:04'),
(208, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:07'),
(209, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:10'),
(210, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:13'),
(211, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:16'),
(212, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:19'),
(213, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:22'),
(214, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-13 11:11:25'),
(215, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:25'),
(216, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:28'),
(217, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-13 11:11:31'),
(218, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:31'),
(219, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:34'),
(220, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:37'),
(221, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:40'),
(222, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:43'),
(223, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:46'),
(224, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:49'),
(225, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:52'),
(226, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:55'),
(227, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:11:58'),
(228, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:01'),
(229, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:04'),
(230, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:07'),
(231, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:10'),
(232, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:13'),
(233, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:16'),
(234, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:19'),
(235, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:22'),
(236, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:25'),
(237, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:28'),
(238, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:31'),
(239, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:34'),
(240, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:37'),
(241, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:40'),
(242, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:43'),
(243, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:46'),
(244, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:49'),
(245, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:52'),
(246, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-13 11:12:55'),
(247, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:55'),
(248, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:12:58'),
(249, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:01'),
(250, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:04'),
(251, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:07'),
(252, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:10'),
(253, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:13'),
(254, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:16'),
(255, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:19'),
(256, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:22'),
(257, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:25'),
(258, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:28'),
(259, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:31'),
(260, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'New', '2026-05-13 11:13:34'),
(261, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'Dismissed', '2026-05-13 11:13:37'),
(262, 'Ultrasonic Sensor', 'Object detected at close range: 1.0cm', 'Dismissed', '2026-05-13 11:13:40'),
(263, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-14 14:57:04'),
(264, 'Ultrasonic Sensor', 'Object detected at close range: 5.3cm', 'New', '2026-05-14 14:57:22'),
(265, 'Ultrasonic Sensor', 'Object detected at close range: 5.3cm', 'New', '2026-05-14 14:57:25'),
(266, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-14 14:57:34'),
(267, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:05'),
(268, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:08'),
(269, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:11'),
(270, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:11'),
(271, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:14'),
(272, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:14'),
(273, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:17'),
(274, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:17'),
(275, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:20'),
(276, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:20'),
(277, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:23'),
(278, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:23'),
(279, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:26'),
(280, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:26'),
(281, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:29'),
(282, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:29'),
(283, 'PIR Sensor', 'Movement detected in secure zone.', 'Reviewing', '2026-05-15 06:28:32'),
(284, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:32'),
(285, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:35'),
(286, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:35'),
(287, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:38'),
(288, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:38'),
(289, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:41'),
(290, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:41'),
(291, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:44'),
(292, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:44'),
(293, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:47'),
(294, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:47'),
(295, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:50'),
(296, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:50'),
(297, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:53'),
(298, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:53'),
(299, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:56'),
(300, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:56'),
(301, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:28:59'),
(302, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:28:59'),
(303, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:02'),
(304, 'Ultrasonic Sensor', 'Object detected at close range: 6.6cm', 'New', '2026-05-15 06:29:02'),
(305, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:05'),
(306, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:05'),
(307, 'PIR Sensor', 'Movement detected in secure zone.', 'Resolved', '2026-05-15 06:29:08'),
(308, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:08'),
(309, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:11'),
(310, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:11'),
(311, 'PIR Sensor', 'Movement detected in secure zone.', 'Dismissed', '2026-05-15 06:29:14'),
(312, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:14'),
(313, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:17'),
(314, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:17'),
(315, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:20'),
(316, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:20'),
(317, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:23'),
(318, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:23'),
(319, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:26'),
(320, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:26'),
(321, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:29'),
(322, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:29'),
(323, 'PIR Sensor', 'Movement detected in secure zone.', 'New', '2026-05-15 06:29:32'),
(324, 'Ultrasonic Sensor', 'Object detected at close range: 3.4cm', 'New', '2026-05-15 06:29:32');

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `lesson_title` varchar(255) DEFAULT NULL,
  `lesson_content` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `video_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `module_id`, `lesson_title`, `lesson_content`, `duration`, `video_url`) VALUES
(1, 1, 'Welcome to SarakWay', 'SarakWay operates a network of protected parks and eco-tourism destinations across Sarawak. Park guides play a critical role in ensuring visitors experience the parks safely while also protecting biodiversity and maintaining conservation standards. Guides are expected to uphold professionalism, provide accurate information, and act responsibly when interacting with visitors and wildlife.\n\nThis lesson explains the structure of SarakWay operations, the responsibilities of park guides, and the importance of environmental stewardship. New guides will also learn how tourism contributes to conservation funding and local community development.', 4, NULL),
(2, 1, 'Roles and Responsibilities of Park Guides', 'Park guides are responsible for leading tours, ensuring visitor safety, monitoring trail conditions, and reporting incidents. Guides must provide accurate information regarding wildlife, local ecosystems, and park regulations.\n\nGuides are also expected to maintain professional conduct at all times, including punctuality, respectful communication, and ethical behavior toward visitors, colleagues, and local communities.', 4, NULL),
(3, 2, 'Effective Visitor Communication', 'Clear communication helps visitors understand park regulations, safety requirements, and environmental responsibilities. Guides should use simple explanations, maintain a calm tone, and encourage questions during tours.\n\nWhen communicating with international visitors, guides should speak clearly and avoid overly technical language. Guides should also remain patient when answering repeated questions.', 20, NULL),
(4, 2, 'Managing Difficult Situations', 'Guides may occasionally encounter visitors who ignore safety instructions, damage facilities, or become disruptive. In such situations, guides should remain calm, avoid confrontation, and follow park escalation procedures.\n\nIf a situation becomes unsafe, guides must contact supervisors or park authorities immediately rather than attempting to resolve dangerous situations alone.', 20, NULL),
(5, 3, 'Introduction to Bako Ecosystems', 'Bako National Park contains a diverse range of ecosystems including mangrove forests, kerangas forests, cliff vegetation, beach vegetation, and lowland dipterocarp forests. Park guides must understand how these ecosystems function together to support wildlife and maintain ecological balance. Guides should educate visitors on the importance of preserving natural habitats and avoiding activities that may damage sensitive environments.', 8, NULL),
(6, 3, 'Human Impact on Protected Areas', 'Human activities such as littering, off-trail hiking, feeding wildlife, and noise pollution can negatively affect ecosystems within Bako National Park. Guides are responsible for monitoring visitor behavior, promoting responsible tourism practices, and ensuring park regulations are followed to minimize environmental impact.', 10, NULL),
(7, 7, 'Protecting Wildlife in Bako', 'Bako National Park is home to species such as proboscis monkeys, silvered langurs, bearded pigs, and various bird species. Guides must ensure visitors observe wildlife responsibly from safe distances and avoid behaviors that may stress or endanger animals.', 9, NULL),
(8, 7, 'Ethical Wildlife Observation', 'Ethical wildlife observation includes maintaining quiet behavior, avoiding flash photography near animals, and preventing visitors from approaching nests or feeding areas. Guides play an important role in maintaining respectful interactions between tourists and wildlife.', 7, NULL),
(9, 4, 'Introduction to Bako’s Biodiversity', 'This lesson introduces guides to the rich biodiversity found in Bako National Park. Guides will learn about the different ecosystems within the park, including mangrove forests, beach vegetation, cliffside habitats, and tropical rainforest environments. The lesson explains why Bako is considered one of Sarawak’s most important biodiversity areas and highlights the role of park guides in educating visitors about conservation and responsible tourism practices.', 8, NULL),
(10, 4, 'Common Wildlife Species in Bako', 'This lesson focuses on the most frequently observed wildlife species in Bako National Park. Guides will learn how to identify proboscis monkeys, silvered langurs, bearded pigs, macaques, monitor lizards, and common bird species. The lesson also explains animal behavior, safe viewing practices, and how guides should manage visitor interactions during wildlife sightings.', 10, NULL),
(11, 5, 'Protected Wildlife in Sarawak', 'This lesson explains the protected wildlife species found in Sarawak and Bako National Park. Guides will learn about conservation laws, illegal wildlife activities, and why species protection is important for long-term ecosystem stability. The lesson also introduces endangered species categories and reporting procedures for suspicious activities.', 8, NULL),
(12, 5, 'Ethical Wildlife Tourism', 'This lesson teaches guides how to manage tourism activities responsibly around wildlife habitats. Guides will learn proper visitor control techniques, ethical photography guidelines, and methods for reducing environmental disturbance during tours. Emphasis is placed on maintaining safe distances and respecting animal behavior.', 9, NULL),
(13, 9, 'Introduction to Eco-Tourism', 'This lesson introduces the core principles of eco-tourism in protected areas such as Bako National Park. Guides will learn how eco-tourism supports environmental conservation, local communities, and sustainable tourism development. The lesson also explains the responsibilities of guides in balancing visitor satisfaction with environmental protection.', 8, NULL),
(14, 9, ' Sustainable Tourism Practices', 'This lesson focuses on sustainable tourism methods used in national parks. Guides will learn about minimizing environmental impact, reducing waste, managing visitor behavior, and promoting conservation awareness during tours. Practical examples of responsible tourism operations in Bako National Park are included.', 9, NULL),
(15, 10, 'Professional Visitor Communication', 'This lesson trains guides to communicate effectively with visitors during guided tours. Topics include public speaking, visitor engagement, answering questions, and delivering educational information clearly and professionally. Guides will also learn how to adapt communication styles for different visitor groups.', 8, ''),
(16, 10, 'Managing Visitor Expectations', 'This lesson explains how guides can manage visitor expectations while maintaining safety and environmental responsibility. Guides will learn techniques for handling complaints, explaining park regulations, and responding to unexpected situations such as weather changes or wildlife encounters.', 9, NULL),
(17, 12, 'Understanding Park Regulations', 'This lesson introduces the official regulations and visitor rules enforced within Bako National Park. Guides will learn about restricted activities, visitor responsibilities, trail regulations, waste management policies, and environmental protection requirements. The lesson also explains why compliance with park regulations is important for conservation and visitor safety.', 8, NULL),
(18, 12, 'Visitor Rule Enforcement', 'This lesson trains guides on how to professionally enforce park rules during tours and public interactions. Guides will learn communication techniques for handling rule violations, preventing unsafe behavior, and maintaining a positive visitor experience while ensuring compliance with park policies.', 9, NULL),
(19, 13, 'Protected Species Legislation', 'This lesson explains wildlife protection laws relevant to Bako National Park and Sarawak’s protected areas. Guides will learn about protected species regulations, illegal wildlife activities, and penalties related to poaching, wildlife trafficking, and habitat destruction.', 8, ''),
(20, 13, 'Reporting Illegal Activities', 'This lesson teaches guides how to identify and report illegal environmental activities within protected areas. Topics include illegal hunting, unauthorized collection of plants or animals, vandalism, and unsafe visitor behavior. Guides will also learn the correct reporting procedures and communication channels.', 9, NULL),
(21, 15, 'Visitor Safety Guidelines', 'Visitor Safety Guidelines facts\n\ni\n\ndouble', 8, 'https://youtu.be/HJgdT15UT4k?si=m1ITO598PvMAwLWI'),
(22, 15, 'Trail and Wildlife Safety', 'This lesson focuses on safety risks commonly encountered during guided tours, including slippery trails, extreme weather conditions, and wildlife encounters. Guides will learn how to minimize risks, maintain group safety, and respond appropriately to potentially dangerous situations during outdoor activities.', 9, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `module_id` int(11) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `module_title` varchar(100) NOT NULL,
  `module_description` text DEFAULT NULL,
  `order_index` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`module_id`, `course_id`, `module_title`, `module_description`, `order_index`) VALUES
(1, 'COURSE_1778157399838', 'Introduction to SarakWay', 'This module introduces the mission of SarakWay, the role of park guides, and the importance of sustainable tourism and conservation within Sarawak’s protected parks.', 1),
(2, 'COURSE_1778157399838', 'Visitor Communication and Professional Conduct', 'This module teaches guides how to communicate professionally with visitors, manage difficult situations, and create positive tourism experiences.', 2),
(3, 'COURSE_1778168841504', 'Ecosystem Protection in Bako', NULL, 1),
(4, 'COURSE_1778168901968', 'Flora and Fauna of Bako', NULL, 1),
(5, 'COURSE_1778168901968', 'Endangered and Protected Species', NULL, 2),
(7, 'COURSE_1778168841504', 'Wildlife Conservation Responsibilities', NULL, 2),
(9, 'COURSE_1778169015839', 'Principles of Eco-Tourism', NULL, 1),
(10, 'COURSE_1778169015839', 'Visitor Experience Management', NULL, 2),
(12, 'COURSE_1778169156057', 'Park Rules and Regulations', NULL, 1),
(13, 'COURSE_1778169156057', 'Wildlife Protection Laws', NULL, 2),
(15, 'COURSE_1778169241952', 'Visitor Safety Procedures', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_broadcast` tinyint(1) DEFAULT 0,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `type`, `message`, `is_broadcast`, `assigned_to`, `created_at`) VALUES
(1, 'Emergency Weather Alert', 'Announcement', 'Heavy rainfall has been detected near Bako National Park. All park guides are advised to suspend outdoor activities temporarily.', 1, NULL, '2026-05-08 09:41:30');

-- --------------------------------------------------------

--
-- Table structure for table `parks`
--

CREATE TABLE `parks` (
  `park_id` int(11) NOT NULL,
  `park_name` varchar(100) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parks`
--

INSERT INTO `parks` (`park_id`, `park_name`, `latitude`, `longitude`) VALUES
(1, 'Bako National Park', 1.70330000, 110.47440000),
(2, 'Gunung Mulu National Park', 4.04890000, 114.81140000),
(3, 'Kubah National Park', 1.61140000, 110.19810000),
(4, 'Niah National Park', 3.81390000, 113.76810000);

-- --------------------------------------------------------

--
-- Table structure for table `park_species`
--

CREATE TABLE `park_species` (
  `park_id` int(11) NOT NULL,
  `species_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `quiz_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `quiz_title` varchar(255) DEFAULT NULL,
  `passing_score` int(11) DEFAULT 70,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `duration_minutes` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quiz_id`, `module_id`, `quiz_title`, `passing_score`, `created_at`, `duration_minutes`) VALUES
(1, 1, 'SarakWay Foundations', 50, '2026-05-07 12:37:54', 10),
(2, 2, 'Communication and Conduct', 70, '2026-05-07 13:00:51', 10),
(3, 3, 'Conservation Fundamentals Quiz', 70, '2026-05-07 15:47:42', 10),
(4, 7, 'Wildlife Protection Quiz', 70, '2026-05-07 15:49:31', 10),
(6, 9, 'Eco-Tourism Fundamentals Quiz', 70, '2026-05-07 15:50:31', 10),
(7, 10, 'Visitor Engagement Quiz', 70, '2026-05-07 15:50:45', 10),
(9, 12, 'Park Regulations Quiz', 70, '2026-05-07 15:52:51', 10),
(10, 13, 'Wildlife Law Assessment', 70, '2026-05-07 15:53:10', 10),
(12, 15, 'Safety Procedures Quiz', 70, '2026-05-07 15:54:24', 10),
(15, 4, 'Flora and Fauna Awareness Quiz', 70, '2026-05-07 16:32:30', 10),
(16, 5, 'Wildlife Protection Quiz', 70, '2026-05-07 16:36:51', 10);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `attempt_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `passed` tinyint(1) DEFAULT 0,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_attempts`
--

INSERT INTO `quiz_attempts` (`attempt_id`, `user_id`, `quiz_id`, `score`, `passed`, `attempted_at`) VALUES
(1, 2, 1, 100, 1, '2026-05-07 17:28:59'),
(2, 2, 2, 100, 1, '2026-05-07 18:38:04'),
(3, 2, 1, 100, 1, '2026-05-07 18:40:43'),
(4, 2, 1, 100, 1, '2026-05-07 18:40:56'),
(5, 2, 1, 0, 0, '2026-05-07 18:41:21'),
(6, 2, 1, 0, 0, '2026-05-07 18:43:11'),
(7, 2, 9, 100, 1, '2026-05-07 18:45:43'),
(8, 2, 3, 80, 1, '2026-05-07 19:53:56'),
(9, 2, 4, 100, 1, '2026-05-07 19:56:04'),
(10, 2, 15, 80, 1, '2026-05-07 19:56:27'),
(11, 2, 16, 80, 1, '2026-05-07 19:57:00'),
(12, 2, 6, 100, 1, '2026-05-07 20:07:54'),
(13, 2, 7, 100, 1, '2026-05-07 20:08:11'),
(14, 2, 10, 100, 1, '2026-05-07 20:09:11'),
(15, 2, 12, 80, 1, '2026-05-07 20:09:52'),
(16, 2, 12, 80, 1, '2026-05-07 20:10:41'),
(17, 2, 12, 40, 0, '2026-05-07 20:13:13'),
(18, 2, 12, 80, 1, '2026-05-07 22:03:53'),
(19, 3, 1, 100, 1, '2026-05-13 21:42:35'),
(20, 3, 2, 100, 1, '2026-05-13 21:42:54'),
(21, 1, 12, 80, 1, '2026-05-13 22:33:15'),
(22, 3, 12, 60, 0, '2026-05-14 12:10:53'),
(23, 3, 12, 60, 0, '2026-05-14 12:12:26'),
(24, 3, 12, 80, 1, '2026-05-14 12:12:39'),
(25, 3, 12, 80, 1, '2026-05-14 12:12:42'),
(26, 3, 12, 80, 1, '2026-05-14 12:22:16'),
(27, 3, 12, 80, 1, '2026-05-14 12:24:08'),
(28, 3, 12, 80, 1, '2026-05-14 12:24:26'),
(29, 3, 12, 80, 1, '2026-05-14 12:24:53'),
(30, 3, 12, 80, 1, '2026-05-14 12:25:22'),
(31, 3, 12, 80, 1, '2026-05-14 12:27:10'),
(32, 3, 12, 80, 1, '2026-05-14 12:27:15'),
(33, 3, 12, 80, 1, '2026-05-14 12:32:08'),
(34, 3, 9, 80, 1, '2026-05-14 12:56:39'),
(35, 3, 6, 100, 1, '2026-05-14 13:22:02'),
(36, 4, 1, 0, 0, '2026-05-15 10:24:13'),
(37, 3, 12, 80, 1, '2026-05-21 06:49:02'),
(38, 3, 9, 60, 0, '2026-05-21 06:51:49'),
(39, 3, 10, 100, 1, '2026-05-21 06:52:17');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `question_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `correct_answer` enum('A','B','C','D') DEFAULT NULL,
  `question_order` int(11) DEFAULT 1,
  `explanation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `question_order`, `explanation`) VALUES
(1, 1, 'What is the primary responsibility of a park guide?', 'Selling souvenirs', 'Ensuring visitor safety and providing guidance', 'Conducting wildlife research only', 'Managing park finances', 'B', 1, NULL),
(2, 1, 'Why is sustainable tourism important?', 'It reduces all park rules', 'It encourages unrestricted visitor access', 'It supports conservation and local communities', 'It replaces conservation programs', 'C', 1, NULL),
(3, 2, 'What should a guide do when a visitor ignores safety instructions?', 'Ignore the behavior', 'Respond aggressively', 'Calmly remind the visitor and follow procedures', 'End the tour immediately without explanation', 'C', 1, NULL),
(4, 2, 'Why should guides avoid technical language with visitors?', 'Visitors dislike learning', 'Clear communication improves understanding', 'Technical terms are banned', 'Guides should speak less during tours', 'B', 1, NULL),
(5, 3, 'What is one major ecosystem found in Bako National Park?', 'Desert biome', 'Mangrove forest', 'Arctic tundra', 'Urban wetland', 'B', 1, NULL),
(6, 3, 'Why should visitors avoid feeding wildlife?', 'It improves tourism ratings', 'It helps animals grow faster', 'It can disrupt natural animal behavior', 'It reduces guide responsibilities', 'C', 1, NULL),
(7, 3, 'What is the role of a park guide in conservation?', 'Selling souvenirs', 'Monitoring visitor behavior', 'Building park facilities', 'Managing ticket pricing', 'B', 1, NULL),
(8, 3, 'Why is staying on designated trails important?', 'To reduce walking distance', 'To avoid disturbing sensitive habitats', 'To increase tourism traffic', 'To improve mobile signal coverage', 'B', 1, NULL),
(9, 3, 'What type of pollution can disturb wildlife behavior?', 'Noise pollution', 'Screen brightness', 'Weather forecasting', 'GPS tracking', 'A', 1, NULL),
(10, 4, 'What is the safest way for visitors to observe wildlife in Bako National Park?', 'Approaching animals closely for photos', 'Feeding animals to attract them', 'Observing from a safe distance', 'Making loud sounds to get attention', 'C', 1, NULL),
(11, 4, 'Why should visitors avoid using flash photography near wildlife?', 'It drains phone batteries quickly', 'It may stress or disturb animals', 'It improves animal movement', 'It helps guides monitor wildlife', 'B', 1, NULL),
(12, 4, 'Which animal is commonly found in Bako National Park?', 'Polar bear', 'Proboscis monkey', 'Kangaroo', 'Panda', 'B', 1, NULL),
(13, 4, 'What should a guide do if visitors attempt to feed wildlife?', 'Ignore the behavior', 'Encourage visitors to continue', 'Politely stop the visitors and explain park rules', 'Take photos of the visitors', 'C', 1, NULL),
(14, 4, 'Why is ethical wildlife observation important?', 'It protects animal welfare and natural behavior', 'It increases ticket sales', 'It makes tours shorter', 'It reduces the number of guides needed', 'A', 1, NULL),
(15, 15, 'Which animal is most associated with Bako National Park?', 'Orangutan', 'Proboscis monkey', 'Panda', 'Elephant', 'B', 1, NULL),
(16, 15, 'Why is biodiversity important in national parks?', 'It increases parking space', 'It supports healthy ecosystems', 'It reduces rainfall', 'It limits tourism', 'B', 1, NULL),
(17, 15, 'Which habitat can be found in Bako National Park?', 'Desert ecosystem', 'Arctic tundra', 'Mangrove forest', 'Snow forest', 'C', 1, NULL),
(18, 15, 'What should guides encourage during wildlife observation?', 'Feeding animals', 'Touching wildlife', 'Quiet and respectful viewing', 'Chasing animals for photos', 'C', 1, NULL),
(19, 15, 'Which species is commonly seen near Bako park headquarters?', 'Polar bears', 'Silvered langurs', 'Penguins', 'Tigers', 'B', 1, NULL),
(20, 16, 'What should visitors avoid doing near wildlife?', 'Keeping quiet', 'Observing from a distance', 'Feeding animals', 'Following guide instructions', 'C', 1, NULL),
(21, 16, 'Why are protected species important?', 'They support ecosystem balance', 'They increase traffic', 'They reduce tourism', 'They create noise pollution', 'A', 1, NULL),
(22, 16, 'What should guides do if visitors disturb wildlife?', 'Ignore the behavior', 'Encourage it', 'Politely stop the activity', 'Record videos only', 'C', 1, NULL),
(23, 16, 'Which activity is considered ethical wildlife tourism?', 'Flash photography near animals', 'Chasing animals for photos', 'Respectful wildlife observation', 'Feeding monkeys', 'C', 1, NULL),
(24, 16, 'Why is wildlife conservation necessary?', 'To protect biodiversity', 'To reduce forests', 'To limit visitors', 'To increase construction', 'A', 1, NULL),
(25, 6, 'What is the main goal of eco-tourism?', 'Increasing pollution', 'Supporting sustainable tourism and conservation', 'Encouraging wildlife feeding', 'Expanding construction projects', 'B', 1, NULL),
(26, 6, 'Which practice supports eco-tourism?', 'Littering on trails', 'Damaging vegetation', 'Respecting protected areas', 'Feeding wildlife', 'C', 1, NULL),
(27, 6, 'Why is environmental education important in eco-tourism?', 'It increases noise levels', 'It promotes conservation awareness', 'It reduces guide responsibilities', 'It encourages illegal activities', 'B', 1, NULL),
(28, 6, 'What should guides encourage during eco-tours?', 'Responsible visitor behavior', 'Off-trail hiking', 'Collecting plants', 'Touching wildlife', 'A', 1, NULL),
(29, 6, 'How does eco-tourism benefit national parks?', 'By damaging ecosystems', 'By supporting conservation efforts', 'By reducing biodiversity', 'By increasing habitat destruction', 'B', 1, NULL),
(30, 7, 'Why is good communication important for park guides?', 'It improves visitor understanding and experience', 'It reduces conservation awareness', 'It prevents questions from visitors', 'It increases confusion', 'A', 1, NULL),
(31, 7, 'What should guides do when visitors ask questions?', 'Ignore the questions', 'Provide clear and accurate information', 'Change the topic immediately', 'Avoid communication', 'B', 1, NULL),
(32, 7, 'How should guides handle visitor complaints?', 'Politely and professionally', 'By arguing with visitors', 'By ignoring the issue', 'By ending the tour immediately', 'A', 1, NULL),
(33, 7, 'What is an important part of visitor experience management?', 'Clear safety instructions', 'Encouraging rule violations', 'Allowing littering', 'Ignoring emergencies', 'A', 1, NULL),
(34, 7, 'Why should guides manage visitor expectations?', 'To maintain safety and satisfaction', 'To shorten tours unnecessarily', 'To avoid communication', 'To reduce environmental awareness', 'A', 1, NULL),
(35, 9, 'Why are park regulations important?', 'To protect visitors and the environment', 'To reduce biodiversity', 'To encourage illegal activities', 'To increase pollution', 'A', 1, NULL),
(36, 9, 'Which activity is prohibited in protected park areas?', 'Staying on marked trails', 'Littering and damaging habitats', 'Following guide instructions', 'Responsible photography', 'B', 1, NULL),
(37, 9, 'What should guides do if visitors break park rules?', 'Ignore the behavior', 'Politely explain the regulations', 'Encourage the activity', 'End the tour immediately without explanation', 'B', 1, NULL),
(38, 9, 'Why should visitors stay on designated trails?', 'To protect ecosystems and reduce erosion', 'To disturb wildlife', 'To damage vegetation', 'To create shortcuts', 'A', 1, NULL),
(39, 9, 'What is an important responsibility of park guides?', 'Promoting compliance with park regulations', 'Encouraging unsafe behavior', 'Ignoring visitor concerns', 'Allowing wildlife harassment', 'A', 1, NULL),
(40, 10, 'Why are wildlife protection laws necessary?', 'To protect biodiversity and ecosystems', 'To reduce conservation efforts', 'To encourage illegal hunting', 'To increase habitat destruction', 'A', 1, NULL),
(41, 10, 'Which activity is illegal in protected national parks?', 'Wildlife trafficking', 'Guided eco-tours', 'Nature photography', 'Environmental education', 'A', 1, NULL),
(42, 10, 'What should guides do if they observe illegal wildlife activities?', 'Ignore the situation', 'Report the incident to park authorities', 'Encourage the activity', 'Share it only on social media', 'B', 1, NULL),
(43, 10, 'What is the purpose of protected species legislation?', 'To ensure species survival and conservation', 'To reduce wildlife populations', 'To encourage habitat destruction', 'To limit environmental education', 'A', 1, NULL),
(44, 10, 'Which action supports wildlife protection?', 'Respecting conservation laws', 'Feeding endangered species', 'Collecting wildlife souvenirs', 'Entering restricted habitats', 'A', 1, NULL),
(45, 12, 'Why are visitor safety briefings important?', 'They help visitors understand safety procedures', 'They reduce environmental awareness', 'They encourage risky behavior', 'They shorten the tour unnecessarily', 'A', 1, NULL),
(46, 12, 'What should guides do during wildlife encounters?', 'Encourage visitors to approach animals', 'Maintain safe distances and stay calm', 'Feed wildlife to distract them', 'Ignore visitor safety', 'B', 1, NULL),
(47, 12, 'Which condition may increase trail hazards in Bako National Park?', 'Dry indoor flooring', 'Heavy rain and slippery surfaces', 'Air conditioning', 'Flat concrete roads', 'B', 1, NULL),
(48, 12, 'What is a guide’s responsibility during tours?', 'Ensuring visitor safety', 'Ignoring park rules', 'Allowing unsafe shortcuts', 'Encouraging off-trail hiking', 'A', 1, NULL),
(49, 12, 'Why should visitors stay with the group?', 'To improve safety and communication', 'To disturb wildlife', 'To reduce guide responsibilities', 'To explore restricted areas', 'A', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Park Guide');

-- --------------------------------------------------------

--
-- Table structure for table `species`
--

CREATE TABLE `species` (
  `species_id` int(11) NOT NULL,
  `species_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `conservation_status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `user_name`, `email`, `phone`, `password_hash`, `created_at`) VALUES
(1, 1, 'Emily', 'emily@test.com', '0123456789', '$2b$10$eB04bjX0FbeYjq69JOAK2.XKQCivuj/CbJH2YE/fRnT56WroJSmAy', '2026-05-07 12:34:56'),
(2, 2, 'Prosper', 'Prosper@test.com', '12394033', '$2b$10$.hUp.P2yFRT8oOdjqB469egju1UA0F4Y10ce6iVZY9b/hEgEZIBty', '2026-05-07 13:11:01'),
(3, 2, 'emily', 'emilyguide@gmail.com', NULL, '$2b$10$ONf/AiOII4lqOqNOdVUMv.NcXVENi1gvyHvMbOWUlSrQVOXIhK79S', '2026-05-07 20:52:16'),
(4, 2, 'Ohyul', 'ohyul@gmail.com', NULL, '$2b$10$Hrbqrww.XsPHp0ztnUDtneAwgKpHbAUYdOvxfHNYXuaiCDMajqIIa', '2026-05-15 08:43:48');

-- --------------------------------------------------------

--
-- Table structure for table `user_course_progress`
--

CREATE TABLE `user_course_progress` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `quizzes_passed` int(11) DEFAULT 0,
  `total_quizzes` int(11) DEFAULT 0,
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_course_progress`
--

INSERT INTO `user_course_progress` (`progress_id`, `user_id`, `course_id`, `quizzes_passed`, `total_quizzes`, `progress_percentage`, `is_completed`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 2, 'COURSE_1778157399838', 2, 2, 100.00, 1, '2026-05-08 02:43:11', '2026-05-07 18:38:04', '2026-05-07 18:43:11'),
(6, 2, 'COURSE_1778169156057', 2, 2, 100.00, 1, '2026-05-08 04:09:11', '2026-05-07 18:45:43', '2026-05-07 20:09:11'),
(7, 2, 'COURSE_1778168841504', 2, 2, 100.00, 1, '2026-05-08 03:56:04', '2026-05-07 19:53:56', '2026-05-07 19:56:04'),
(9, 2, 'COURSE_1778168901968', 2, 2, 100.00, 1, '2026-05-08 03:57:00', '2026-05-07 19:56:27', '2026-05-07 19:57:00'),
(16, 2, 'COURSE_1778169241952', 1, 1, 100.00, 1, '2026-05-08 06:03:53', '2026-05-07 20:13:13', '2026-05-07 22:03:53'),
(18, 3, 'COURSE_1778157399838', 2, 2, 100.00, 1, '2026-05-14 05:42:54', '2026-05-13 21:42:35', '2026-05-13 21:42:54'),
(20, 1, 'COURSE_1778169241952', 1, 1, 100.00, 1, '2026-05-14 06:33:15', '2026-05-13 22:33:15', '2026-05-13 22:33:15'),
(21, 3, 'COURSE_1778169241952', 1, 1, 100.00, 1, '2026-05-21 14:49:02', '2026-05-14 12:10:53', '2026-05-21 06:49:02'),
(33, 3, 'COURSE_1778169156057', 2, 2, 100.00, 1, '2026-05-21 14:52:17', '2026-05-14 12:56:39', '2026-05-21 06:52:17'),
(34, 3, 'COURSE_1778169015839', 1, 2, 50.00, 0, NULL, '2026-05-14 13:22:02', '2026-05-14 14:42:35'),
(36, 3, 'COURSE_1778168901968', 0, 0, 50.00, 0, NULL, '2026-05-14 14:42:09', '2026-05-14 14:42:10'),
(38, 3, 'COURSE_1778168841504', 0, 0, 50.00, 0, NULL, '2026-05-14 14:42:16', '2026-05-14 14:42:22'),
(42, 2, 'COURSE_1778169015839', 0, 0, 25.00, 0, NULL, '2026-05-14 14:43:38', '2026-05-14 14:43:38'),
(45, 4, 'COURSE_1778157399838', 0, 2, 0.00, 0, NULL, '2026-05-15 10:24:07', '2026-05-15 10:24:13');

-- --------------------------------------------------------

--
-- Table structure for table `user_lesson_progress`
--

CREATE TABLE `user_lesson_progress` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 1,
  `completed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_lesson_progress`
--

INSERT INTO `user_lesson_progress` (`progress_id`, `user_id`, `lesson_id`, `is_completed`, `completed_at`) VALUES
(1, 3, 17, 1, '2026-05-14 22:28:18'),
(2, 3, 18, 1, '2026-05-14 22:42:03'),
(3, 3, 9, 1, '2026-05-14 22:42:09'),
(4, 3, 10, 1, '2026-05-14 22:42:10'),
(5, 3, 5, 1, '2026-05-14 22:42:16'),
(6, 3, 6, 1, '2026-05-14 22:42:22'),
(7, 3, 13, 1, '2026-05-14 22:42:34'),
(8, 3, 14, 1, '2026-05-14 22:42:35'),
(9, 2, 13, 1, '2026-05-14 22:43:38'),
(10, 3, 21, 1, '2026-05-15 14:24:04'),
(11, 3, 22, 1, '2026-05-15 14:24:19'),
(14, 4, 1, 1, '2026-05-15 18:24:07'),
(15, 4, 2, 1, '2026-05-15 18:24:07'),
(28, 3, 19, 1, '2026-05-21 14:51:53'),
(29, 3, 20, 1, '2026-05-21 14:51:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `device_id` (`device_id`),
  ADD KEY `fk_alert_user` (`assigned_to`);

--
-- Indexes for table `alert_severity`
--
ALTER TABLE `alert_severity`
  ADD PRIMARY KEY (`severity_id`);

--
-- Indexes for table `alert_status`
--
ALTER TABLE `alert_status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`certificate_id`),
  ADD UNIQUE KEY `unique_certificate` (`user_id`,`park_id`);

--
-- Indexes for table `certificate_types`
--
ALTER TABLE `certificate_types`
  ADD PRIMARY KEY (`certificate_type_id`),
  ADD KEY `park_id` (`park_id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`cert_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `certificate_type_id` (`certificate_type_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `park_id` (`park_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `prerequisite_course_id` (`prerequisite_course_id`),
  ADD KEY `fk_category` (`category_id`);

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`device_id`),
  ADD KEY `assigned_user_id` (`assigned_user_id`);

--
-- Indexes for table `device_recordings`
--
ALTER TABLE `device_recordings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `iot_alerts`
--
ALTER TABLE `iot_alerts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`module_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `parks`
--
ALTER TABLE `parks`
  ADD PRIMARY KEY (`park_id`);

--
-- Indexes for table `park_species`
--
ALTER TABLE `park_species`
  ADD PRIMARY KEY (`park_id`,`species_id`),
  ADD KEY `species_id` (`species_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quiz_id`),
  ADD KEY `idx_quizzes_module` (`module_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`attempt_id`),
  ADD KEY `idx_attempts_quiz` (`quiz_id`),
  ADD KEY `idx_attempts_user` (`user_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `idx_questions_quiz` (`quiz_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `species`
--
ALTER TABLE `species`
  ADD PRIMARY KEY (`species_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_course_progress`
--
ALTER TABLE `user_course_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD UNIQUE KEY `unique_user_course` (`user_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `user_lesson_progress`
--
ALTER TABLE `user_lesson_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD UNIQUE KEY `unique_user_lesson` (`user_id`,`lesson_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `alert_severity`
--
ALTER TABLE `alert_severity`
  MODIFY `severity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `alert_status`
--
ALTER TABLE `alert_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `certificate_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `certificate_types`
--
ALTER TABLE `certificate_types`
  MODIFY `certificate_type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `cert_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `device_recordings`
--
ALTER TABLE `device_recordings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `iot_alerts`
--
ALTER TABLE `iot_alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=325;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `parks`
--
ALTER TABLE `parks`
  MODIFY `park_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `attempt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `species`
--
ALTER TABLE `species`
  MODIFY `species_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_course_progress`
--
ALTER TABLE `user_course_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `user_lesson_progress`
--
ALTER TABLE `user_lesson_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`),
  ADD CONSTRAINT `fk_alert_user` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `certificate_types`
--
ALTER TABLE `certificate_types`
  ADD CONSTRAINT `certificate_types_ibfk_1` FOREIGN KEY (`park_id`) REFERENCES `parks` (`park_id`);

--
-- Constraints for table `certifications`
--
ALTER TABLE `certifications`
  ADD CONSTRAINT `certifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `certifications_ibfk_2` FOREIGN KEY (`certificate_type_id`) REFERENCES `certificate_types` (`certificate_type_id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`park_id`) REFERENCES `parks` (`park_id`),
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `courses_ibfk_3` FOREIGN KEY (`prerequisite_course_id`) REFERENCES `courses` (`course_id`),
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`);

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `park_species`
--
ALTER TABLE `park_species`
  ADD CONSTRAINT `park_species_ibfk_1` FOREIGN KEY (`park_id`) REFERENCES `parks` (`park_id`),
  ADD CONSTRAINT `park_species_ibfk_2` FOREIGN KEY (`species_id`) REFERENCES `species` (`species_id`);

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `user_course_progress`
--
ALTER TABLE `user_course_progress`
  ADD CONSTRAINT `user_course_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_course_progress_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_lesson_progress`
--
ALTER TABLE `user_lesson_progress`
  ADD CONSTRAINT `user_lesson_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_lesson_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
