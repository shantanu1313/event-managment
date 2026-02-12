-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: bohcx1sasr4br0vv072c-mysql.services.clever-cloud.com:3306
-- Generation Time: Feb 09, 2026 at 07:00 AM
-- Server version: 8.0.22-13
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bohcx1sasr4br0vv072c`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_header`
--

CREATE TABLE `about_header` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text NOT NULL,
  `image` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `about_header`
--

INSERT INTO `about_header` (`id`, `title`, `subtitle`, `image`, `created_at`) VALUES
(1, 'Who We Are ?', 'Turning your ideas into well-organized and memorable events.\r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        ', '1770143299136_about.jpg', '2026-01-30 05:16:00');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `admin_mobile` varchar(15) NOT NULL,
  `admin_email` varchar(100) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_name`, `admin_mobile`, `admin_email`, `admin_password`, `profile_image`, `created_at`) VALUES
(1, 'Karan Gahininath Dhadge', '8261978030', 'admin@gmail.com', 'Admin@123', '1770440255154.jpg', '2026-02-01 17:00:09'),
(2, 'mahesh', '7823867123', 'mp@gmail.com', 'mp9696', NULL, '2026-02-05 12:57:28');

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `blog_id` int NOT NULL,
  `blog_image` varchar(255) NOT NULL,
  `blog_date` date NOT NULL,
  `blog_title` varchar(200) NOT NULL,
  `blog_para` varchar(255) DEFAULT NULL,
  `blog_message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`blog_id`, `blog_image`, `blog_date`, `blog_title`, `blog_para`, `blog_message`, `created_at`) VALUES
(1, '1769605774326_blog_images1.jpg', '2026-01-26', 'Wedding Trends', 'Modern decor, pastel themes & destination weddings.', 'Wedding trends in 2023 focus on personalization, elegance, and memorable experiences. Pastel color palettes, destination weddings, eco-friendly decor, luxury lighting, live music, and customized menus are becoming extremely popular.', '2026-01-28 13:09:35'),
(2, '1769659534212_blog_images2.jpg', '2023-05-23', 'Hybrid Corporate Events', 'Online + offline events planning made easy.', 'Hybrid corporate events combine physical and virtual experiences. Live streaming, virtual networking, digital registrations, interactive Q&A sessions, and professional production help companies reach wider audiences while reducing costs.', '2026-01-29 04:05:35'),
(3, '1769659695297_blog_image3.jpg', '2023-04-12', 'Event on Budget', 'Smart tricks to reduce cost without compromise.', 'Planning an event on a budget requires smart vendor selection, minimal yet elegant décor, digital invitations, seasonal flowers, and proper planning to deliver a premium experience without overspending.', '2026-01-29 04:08:16'),
(4, '1769659882579_blog_img4.jpg', '2026-01-10', 'Live Music Events', 'Why live music creates unforgettable vibes.', 'Live music transforms event atmosphere completely. DJs, live bands, synchronized lighting, quality sound systems, and audience engagement make events energetic, emotional, and memorable.', '2026-01-29 04:11:23'),
(5, '1769659980117_blog_img5.jpg', '2026-01-17', 'Food & Catering Ideas', 'How food experience defines your event.', 'Food is the soul of any event. Live food counters, fusion menus, regional cuisines, hygiene standards, and creative food presentation greatly enhance guest satisfaction.', '2026-01-29 04:13:00'),
(10, '1769680405572_img5_blog.jpg', '2026-01-22', 'Event on Budget', 'Every occasion deserves perfect planning and a professional touch.', 'The BudgeEvent Management Platform enables seamless management of events from start to finish. It allows organizers to create events, track registrations, manage attendees, and monitor event progress in real time, ensuring accuracy and efficiency.', '2026-01-29 09:53:26');

-- --------------------------------------------------------

--
-- Table structure for table `blog_slider`
--

CREATE TABLE `blog_slider` (
  `id` int NOT NULL,
  `blog_image` varchar(255) NOT NULL,
  `blog_title` varchar(255) NOT NULL,
  `blog_description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `blog_slider`
--

INSERT INTO `blog_slider` (`id`, `blog_image`, `blog_title`, `blog_description`, `created_at`) VALUES
(4, '1769680173409_blog_img4.jpg', 'Our Blog & News', 'Latest trends, tips & ideas for unforgettable events... ', '2026-01-29 09:49:34');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `event_type` varchar(100) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `name`, `email`, `mobile`, `event_type`, `price`, `event_date`, `created_at`) VALUES
(1, 'Pawar Gayatri Arun', 'gayatripawar1880@gmail.com', '08329875781', 'Wedding Planning', 50000, '2026-03-02', '2026-02-04 04:20:24'),
(2, 'Pawar Gayatri Arun', 'gayatripawar1880@gmail.com', '08329875781', 'Wedding Planning', 50000, '2026-02-23', '2026-02-04 04:34:18'),
(3, 'Pawar Gayatri Arun', 'gayatripawar1880@gmail.com', '08329875781', 'Wedding Planning', 50000, '2026-02-23', '2026-02-04 04:40:30'),
(4, 'Pawar Gayatri Arun', 'gayatripawar1880@gmail.com', '08329875781', 'Wedding Planning', 50000, '2026-02-20', '2026-02-04 04:41:27'),
(5, 'Pawar Gayatri Arun', 'gayatripawar1880@gmail.com', '08329875781', 'Wedding Planning', 50000, '2026-02-20', '2026-02-04 04:43:02'),
(6, 'Pawar Gayatri Arun', 'gayatripawar1880@gmail.com', '08329875781', 'Wedding Planning', 50000, '2026-02-20', '2026-02-04 04:43:07');

-- --------------------------------------------------------

--
-- Table structure for table `book_event`
--

CREATE TABLE `book_event` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `budget` varchar(50) NOT NULL,
  `message` text,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `book_event`
--

INSERT INTO `book_event` (`id`, `name`, `mobile`, `start_date`, `end_date`, `event_type`, `budget`, `message`, `user_id`, `created_at`, `status`) VALUES
(1, 'mahesh digambar lodhe', '7841915881', '2026-02-01', '2026-02-14', 'Birthday Party', '₹50,000 – ₹1,00,000', 'shree\r\n', 3, '2026-02-05 04:59:29', 'Ongoing'),
(3, 'Mahesh Lodhe', '7841915881', '2026-02-11', '2026-02-13', 'Wedding', '₹50,000 – ₹1,00,000', 'book event', 3, '2026-02-06 09:44:31', 'Confirmed'),
(4, 'Mahesh Lodhe', '7841915881', '2026-02-18', '2026-02-27', 'Corporate Event', '₹1,00,000 – ₹3,00,000', 'ytfyffy gyv  ygybnn bb ', 3, '2026-02-06 09:47:35', 'pending'),
(5, 'Mahesh Lodhe', 'njvisfsvnsnn ', '2026-02-12', '2026-03-06', 'Corporate Event', '₹50,000 – ₹1,00,000', 'adbjabdbabdbd', 3, '2026-02-07 05:53:49', 'pending'),
(6, 'Mahesh Lodhe', '7841915881', '2026-02-18', '2026-02-28', 'Wedding', '₹1,00,000 – ₹3,00,000', 'i want best event company \r\n', 3, '2026-02-07 06:02:03', 'pending'),
(8, 'Pawar Gayatri Arun', '8329875781', '2026-02-03', '2026-02-13', 'Wedding Planning', 'Starting from ₹50000', 'dfghjk', 4, '2026-02-09 06:50:20', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `book_event_mobile`
--

CREATE TABLE `book_event_mobile` (
  `id` int NOT NULL,
  `mobile_no` varchar(15) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `book_event_mobile`
--

INSERT INTO `book_event_mobile` (`id`, `mobile_no`, `updated_at`) VALUES
(1, '7823867123', '2026-02-06 03:52:12');

-- --------------------------------------------------------

--
-- Table structure for table `choose_us`
--

CREATE TABLE `choose_us` (
  `choose_us_id` int NOT NULL,
  `icon` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `choose_us`
--

INSERT INTO `choose_us` (`choose_us_id`, `icon`, `title`, `description`, `created_at`) VALUES
(1, 'fas fa-award', 'Experience', '15+ years of proven expertise in event planning and execution.', '2026-02-01 13:28:33'),
(2, 'fas fa-users-cog', 'Expert Team', 'Creative professionals managing every detail flawlessly.', '2026-02-01 13:49:24'),
(3, 'fas fa-heart', 'Client Satisfaction', '98% happy clients enjoying stress-free, memorable events.', '2026-02-01 13:49:52'),
(4, 'fas fa-headset', '24/7 Support', 'Dedicated assistance before, during, and after your event.', '2026-02-01 13:50:17');

-- --------------------------------------------------------

--
-- Table structure for table `contact_form`
--

CREATE TABLE `contact_form` (
  `id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contact_form`
--

INSERT INTO `contact_form` (`id`, `full_name`, `email`, `phone`, `event_type`, `subject`, `message`, `created_at`) VALUES
(3, 'Pranjal Ghodechor', 'pranjalghodechor2005@gmail.com', '8080282215', 'Wedding', 'event p', 'event management', '2026-01-29 09:11:52'),
(4, 'Pranjal Ghodechor', 'pranjalghodechor2005@gmail.com', '8080282215', 'Corporate Event', 'event management', 'event management system', '2026-01-31 04:53:25'),
(5, 'Pranjal Ghodechor', 'pranjalghodechor2005@gmail.com', '08080282215', 'Conference', 'event management', 'event management', '2026-02-01 10:37:33'),
(6, 'Pranjal Ghodechor', 'pranjalghodechor2005@gmail.com', '08080282215', 'Corporate Event', 'event management', 'event management ewjhrv', '2026-02-01 11:28:58'),
(7, 'Karan Gahininath Dhadge', 'dhadgekaran8@gmail.com', '08261978030', 'Corporate Event', 'Nothing', 'Nothing', '2026-02-03 08:55:37'),
(8, 'Pranjal Ghodechor', 'pranjalghodechor2005@gmail.com', '08080282215', 'Corporate Event', 'event management', 'event management System', '2026-02-04 06:26:54');

-- --------------------------------------------------------

--
-- Table structure for table `contact_header`
--

CREATE TABLE `contact_header` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(500) NOT NULL,
  `image` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contact_header`
--

INSERT INTO `contact_header` (`id`, `title`, `subtitle`, `image`, `created_at`) VALUES
(4, 'Contact Us', '\"We’d love to hear from you.\"', '1770366107688_all_page_bg.jpg', '2026-02-05 06:07:31');

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--

CREATE TABLE `contact_info` (
  `id` int NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `map_url` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contact_info`
--

INSERT INTO `contact_info` (`id`, `address`, `phone`, `email`, `whatsapp`, `map_url`, `created_at`) VALUES
(5, ' Siddhivinayak Event Management, BalikAshram Road, Near A2Z IT HUB, Ahilyanagar, Maharashtra – 414601', '9192043756', 'siddhivinayak@gmail.com', '9192043756', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0521343291857!2d74.72775317497818!3d19.10536868210523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdcb17ca9d749e5%3A0x516744f9b2f35ec9!2sA2Z%20IT%20HUB%20PVT.%20LTD.!5e0!3m2!1sen!2sin!4v1769924128800!5m2!1sen!2sin\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"', '2026-02-01 10:09:46');

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `contact_id` int NOT NULL,
  `contact_phone` varchar(20) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `contact_address` text NOT NULL,
  `contact_availability` varchar(100) DEFAULT NULL,
  `contact_response_time` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contact_us`
--

INSERT INTO `contact_us` (`contact_id`, `contact_phone`, `contact_email`, `contact_address`, `contact_availability`, `contact_response_time`, `created_at`) VALUES
(1, '98765 43210', 'siddhivinayakevents@gmail.com', ' Ahilaynagar, Maharashtra, India', '9AM - 5PM', '24 hours', '2026-01-31 04:34:21');

-- --------------------------------------------------------

--
-- Table structure for table `core_values`
--

CREATE TABLE `core_values` (
  `id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `core_values`
--

INSERT INTO `core_values` (`id`, `title`, `description`, `icon`, `status`, `created_at`) VALUES
(1, 'Passion', 'We approach every event with genuine enthusiasm and dedication to create memorable experiences.', 'fa-bullseye', 1, '2026-01-31 05:01:33'),
(2, 'Integrity', 'We believe in honesty, transparency, and strong moral principles in everything we do. Integrity guides our decisions, builds trust with our clients, and ensures long-term relationships.', 'fa-star', 1, '2026-01-31 05:03:30'),
(3, 'Innovation', 'We constantly strive to innovate by embracing new ideas, technologies, and creative solutions. Innovation helps us deliver better results and stay ahead in a competitive world.', 'fa-lightbulb', 1, '2026-01-31 05:04:16');

-- --------------------------------------------------------

--
-- Table structure for table `event_enquiries`
--

CREATE TABLE `event_enquiries` (
  `enquiry_id` int NOT NULL,
  `enquiry_title` varchar(150) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `budget` varchar(50) DEFAULT NULL,
  `requirements` varchar(200) DEFAULT NULL,
  `custom_requirement` text,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event_enquiries`
--

INSERT INTO `event_enquiries` (`enquiry_id`, `enquiry_title`, `name`, `mobile`, `start_date`, `end_date`, `event_type`, `budget`, `requirements`, `custom_requirement`, `message`, `created_at`) VALUES
(1, 'Wedding At Pune', 'Karan Gahininath Dhadge', '8261978030', '2026-01-30', '2026-01-31', 'Wedding', '₹1,00,000 – ₹3,00,000', 'Decoration,Catering,Photography,DJ / Music,Lighting,Entry Effects,Anchoring', 'Planning and organization of waiters', 'Nothing', '2026-01-30 04:27:32');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `created_at`) VALUES
(9, 'What types of events do you manage?', 'We manage a wide range of events including weddings, birthday parties, corporate events, conferences, exhibitions, product launches, and private celebrations.', '2026-02-04 09:09:41'),
(10, 'We recommend booking at least 2–4 weeks in advance. For large events like weddings or corporate functions, earlier booking ensures better planning and availability.', '2. How early should I book your event management services?', '2026-02-04 09:11:59'),
(11, 'Yes, we provide fully customizable packages based on your budget, event type, and specific requirements.', 'Do you offer customized event packages?', '2026-02-04 09:12:46'),
(12, 'Our packages may include venue decoration, catering coordination, sound & lighting, stage setup, photography, videography, artist management, and event coordination.', 'What services are included in your event packages?', '2026-02-04 09:14:33'),
(13, 'Absolutely. We handle small private gatherings as well as large-scale events with the same level of professionalism and attention to detail.\r\n', 'Can you manage both small and large-scale events?', '2026-02-04 09:15:14'),
(14, 'Yes, we assist in selecting the best venue based on your event type, guest count, location preference, and budget.', 'Do you help with venue selection?', '2026-02-04 09:15:36'),
(15, 'Yes, we offer a free consultation to understand your requirements and suggest the best solutions for your event.', 'Is there a consultation before finalizing the event?', '2026-02-04 09:16:05'),
(16, 'Yes, changes can be made depending on availability. We recommend informing us as early as possible for smooth execution.', 'Can I make changes after booking the event?', '2026-02-04 09:16:31');

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

CREATE TABLE `features` (
  `id` int NOT NULL,
  `feature` varchar(255) NOT NULL,
  `basic` tinyint(1) NOT NULL DEFAULT '0',
  `premium` tinyint(1) NOT NULL DEFAULT '0',
  `luxury` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `features`
--

INSERT INTO `features` (`id`, `feature`, `basic`, `premium`, `luxury`, `created_at`, `updated_at`) VALUES
(3, ' Event Planning ', 0, 1, 1, '2026-01-30 08:53:15', '2026-02-03 07:04:26'),
(4, ' Event Planning Consultation', 0, 1, 1, '2026-01-30 16:00:44', '2026-01-30 16:00:44'),
(5, 'Custom Theme Design', 0, 0, 1, '2026-02-03 07:03:46', '2026-02-03 07:03:46'),
(6, 'Catering Coordination', 0, 0, 1, '2026-02-03 07:04:10', '2026-02-03 07:04:10'),
(7, 'Entertainment Setup', 0, 1, 1, '2026-02-03 07:04:48', '2026-02-03 07:04:48'),
(8, 'Photography & Videography', 0, 1, 1, '2026-02-03 07:05:13', '2026-02-03 07:05:13'),
(9, 'Dedicated Event Manager', 1, 1, 1, '2026-02-03 07:05:37', '2026-02-05 04:48:07');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int NOT NULL,
  `category` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `gallary_img` text NOT NULL,
  `event_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `category`, `title`, `gallary_img`, `event_date`, `created_at`) VALUES
(3, 'Wedding', 'Destination Wedding', '1769663969047Destination Wedding in the Hills.png', '2026-01-04', '2026-01-29 05:19:28'),
(5, 'Corporate', 'apa-itu-event-coporate', '1769668298789_corporate.png', '2026-01-03', '2026-01-29 05:40:20'),
(6, 'Wedding', 'Elegant Wedding Ceremony', '1769675225635_Elegant_Wedding_Ceremony.png', '2023-06-14', '2026-01-29 07:31:02'),
(7, 'Corporate', 'Annual Corporate Conference', '1769675245431_Annual_Corporate_Conference.png', '2023-08-17', '2026-01-29 07:31:02'),
(8, 'Birthday', 'Kids Birthday Party', '1769676126878_Kids_Birthday_Party.png', '2023-11-09', '2026-01-29 07:31:02'),
(9, 'Conference', 'Medical Innovation Summit', '1769676105480_Medical_Innovation_Summit.png', '2023-10-04', '2026-01-29 07:31:02'),
(10, 'Anniversary', 'Golden Anniversary Celebration', '1769676080634_Golden_Anniversary_Celebration.png', '2023-03-31', '2026-01-29 07:31:02'),
(11, 'Corporate', 'Tech Product Launch', '1769676060161_Tech_Product_Launch.png', '2023-03-21', '2026-01-29 07:31:02'),
(12, 'Wedding', 'Beach Destination Wedding', '1769676037925_Beach_Destination_Wedding.png', '2023-07-09', '2026-01-29 07:31:02'),
(13, 'Conference', 'Industry Leadership Summit', '1769676022989_Industry_Leadership_Summit.png', '2023-09-21', '2026-01-29 07:31:02'),
(14, 'Birthday', 'Surprise Birthday Bash', '1769675988960_Surprise_Birthday_Bash.png', '2023-05-08', '2026-01-29 07:31:02'),
(15, 'Anniversary', 'Silver Jubilee Celebration', '1769676005393_Silver_Jubilee_Celebration.png', '2023-01-17', '2026-01-29 07:31:02'),
(16, 'Wedding', 'Traditional Indian Wedding', '1769675969763_Traditional_Indian_Wedding.png', '2023-12-04', '2026-01-29 07:31:02'),
(17, 'Corporate', 'Award Ceremony Night', '1769675949720_Award_Ceremony_Night.png', '2023-02-24', '2026-01-29 07:31:02'),
(18, 'Birthday', 'Theme Birthday Celebration', '1769676457112_Theme_Birthday_Celebration.png', '2024-01-07', '2026-01-29 07:31:02'),
(23, 'Conference', 'Education Conference', '1769677005046_Education_Conference.png', '2024-02-02', '2026-01-29 07:31:02'),
(26, 'Wedding', 'Royal Palace Wedding', '1769676988732_Royal_Palace_Wedding.png', '2024-02-13', '2026-01-29 07:31:02'),
(29, 'Conference', 'International Business Conference', '1769676962809_International_Business_Conference.png', '2023-12-16', '2026-01-29 07:31:02'),
(39, 'Conference', 'AI & ML Conference', '1769676936201_AI_&_ML_Conference.png', '2024-11-19', '2026-01-29 07:31:02'),
(47, 'Corporate', 'Office Farewell Party', '1769678249961_Office_Farewell_Party.png', '2024-06-16', '2026-01-29 09:02:07'),
(50, 'College_Event', 'Annual College Fest', '1769678222566_Annual_College_Fest.png', '2024-02-24', '2026-01-29 09:02:07'),
(51, 'Cultural_Event', 'Traditional Cultural Program', '1769678206559_Traditional_Cultural_Program.png', '2024-03-11', '2026-01-29 09:02:07'),
(52, 'Music_Concert', 'Live Music Concert', '1769678178295_Live_Music_Concert.png', '2024-08-08', '2026-01-29 09:02:07'),
(54, 'Roadshow', 'Brand Promotion Roadshow', '1769678155154_Brand_Promotion_Roadshow.png', '2024-10-02', '2026-01-29 09:02:07'),
(55, 'Charity_Event', 'Charity Fundraising Event', '1769678141499_Charity_Fundraising_Event.png', '2024-11-10', '2026-01-29 09:02:07'),
(56, 'Cultural_Event', 'Ganesh Festival', '1769747013934ganesh fest.png', '2025-09-30', '2026-01-30 04:23:36');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_header`
--

CREATE TABLE `gallery_header` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text NOT NULL,
  `image` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `gallery_header`
--

INSERT INTO `gallery_header` (`id`, `title`, `subtitle`, `image`, `created_at`) VALUES
(5, 'Event Gallery', 'A glimpse into moments that make every event unforgettable\r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        ', '1770093244572_ganesh_fest.png', '2026-01-28 05:10:22'),
(9, 'Gallery', 'Gallery for an image', '', '2026-01-28 05:14:03'),
(10, 'Gallery', 'Gallery for an image', '', '2026-01-28 05:15:31'),
(11, 'Gallery', 'Gallery for an image', '', '2026-01-28 05:15:33'),
(20, 'About', 'This is Our About Page\r\n                        ', '1769748695197_gallery_slider.png', '2026-01-30 04:51:37');

-- --------------------------------------------------------

--
-- Table structure for table `header_faq`
--

CREATE TABLE `header_faq` (
  `id` int NOT NULL,
  `bg_image` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `header_faq`
--

INSERT INTO `header_faq` (`id`, `bg_image`, `title`, `description`, `created_at`) VALUES
(4, '1770271867632_faq.jpg', 'Frequently Asked Questions', 'Everything you need to know about our services ', '2026-02-03 05:15:23');

-- --------------------------------------------------------

--
-- Table structure for table `header_packages`
--

CREATE TABLE `header_packages` (
  `id` int NOT NULL,
  `bg_image` varchar(500) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `header_packages`
--

INSERT INTO `header_packages` (`id`, `bg_image`, `title`, `description`, `created_at`, `updated_at`) VALUES
(3, '1770097353126_all_page_bg.jpg', 'Event Packages', 'Experience excellence with our professionally curated event packages, designed to make your celebrations unforgettable', '2026-02-03 05:42:36', '2026-02-03 05:42:36');

-- --------------------------------------------------------

--
-- Table structure for table `home_our_story`
--

CREATE TABLE `home_our_story` (
  `home_our_story_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `point1` varchar(255) NOT NULL,
  `point2` varchar(255) NOT NULL,
  `point3` varchar(255) NOT NULL,
  `point4` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `home_our_story`
--

INSERT INTO `home_our_story` (`home_our_story_id`, `title`, `description`, `point1`, `point2`, `point3`, `point4`, `image`) VALUES
(1, 'Turning Events Into Unforgettable Moments', 'Since 2008, we have been delivering premium event management services with creativity, precision, and professionalism.  From corporate events to personal celebrations, we manage everything so you can enjoy stress-free moments.', 'Experienced professionals', 'Trusted vendors', 'Budget-friendly planning', ' End-to-end execution', '1769949563123_img5_blog.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `home_slider`
--

CREATE TABLE `home_slider` (
  `home_slider_id` int NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `home_slider`
--

INSERT INTO `home_slider` (`home_slider_id`, `image`, `title`, `description`, `created_at`) VALUES
(3, '1769937384866_slider1.jpg', 'Create Unforgettable Events', 'Wedding & luxury event planning with perfection.', '2026-02-01 09:16:27'),
(7, '1770309207216_meeting.jpg', 'Corporate Event Experts', 'Professional planning for meetings & conferences.', '2026-02-05 04:05:47'),
(8, '1770309373339_slider3.jpg', 'Make Every Moment Special', 'Birthdays, parties & private celebrations.', '2026-02-05 04:12:58'),
(9, '1770309405906_slider1.jpg', 'Your Vision, Our Execution', 'From concept to completion.', '2026-02-05 04:13:57');

-- --------------------------------------------------------

--
-- Table structure for table `how_work`
--

CREATE TABLE `how_work` (
  `how_work_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `quote` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `how_work`
--

INSERT INTO `how_work` (`how_work_id`, `title`, `quote`, `created_at`) VALUES
(1, 'Consultation', 'Share your vision and requirements with our experts', '2026-02-01 05:33:21'),
(2, 'Planning', 'We create a detailed plan and budget proposal', '2026-02-01 05:48:57'),
(3, 'Coordination', 'We handle all vendors, logistics and details', '2026-02-01 05:49:16'),
(4, 'Execution', 'Perfect event execution with on-site management', '2026-02-01 05:50:19');

-- --------------------------------------------------------

--
-- Table structure for table `journey_timeline`
--

CREATE TABLE `journey_timeline` (
  `id` int NOT NULL,
  `year` varchar(10) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `journey_timeline`
--

INSERT INTO `journey_timeline` (`id`, `year`, `title`, `description`, `status`, `created_at`) VALUES
(3, '2009', 'Foundation & First Milestone', 'The company was founded with a clear vision to deliver high-quality, client-centric solutions. Successfully completed the first major project and established a strong foundation built on trust, innovation, and teamwork.', 1, '2026-02-02 06:58:39'),
(4, '2013', 'Digital Growth & Process Automation', 'Adopted modern digital tools and automated internal processes to improve efficiency. This phase marked a significant improvement in service delivery, scalability, and customer satisfaction across multiple projects.', 1, '2026-02-02 06:59:37'),
(5, '2018', 'Expansion & Industry Recognition', 'Expanded operations across new regions and strengthened the professional team. Received industry recognition for innovation, reliability, and consistent performance in delivering complex solutions.', 1, '2026-02-02 07:00:37'),
(6, '2024', 'Innovation & Sustainable Future', 'Focused on innovation-driven growth with sustainable practices. Introduced advanced technologies and optimized workflows to deliver smarter, eco-friendly, and future-ready solutions for clients worldwide.', 1, '2026-02-02 07:01:26');

-- --------------------------------------------------------

--
-- Table structure for table `leadership_team`
--

CREATE TABLE `leadership_team` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `leadership_team`
--

INSERT INTO `leadership_team` (`id`, `name`, `designation`, `description`, `image`, `linkedin`, `twitter`, `status`, `created_at`) VALUES
(5, 'Aarav Sharma', 'Founder & CEO', 'With 15+ years of experience in event management, Aarav leads the company vision and strategy.', '1770023615810_1st team.png', 'https://linkedin.com/in/aaravsharma', 'https://twitter.com/aaravsharma', 1, '2026-02-02 09:13:39'),
(6, 'Priya Verma', 'Creative Director', 'Priya ensures every event has a unique visual identity and exceptional design.', '1770023699569_2nd team.png', 'https://linkedin.com/in/priyaverma', 'https://twitter.com/priyaverma', 1, '2026-02-02 09:15:01'),
(7, 'Siddharth Gupta', 'Finance Head', 'Manages budgeting, finance planning and resource allocation for all projects.', '1770142985987_leadership.jpg', 'https://linkedin.com/in/siddharthgupta', 'https://twitter.com/siddharthgupta', 1, '2026-02-02 09:17:00');

-- --------------------------------------------------------

--
-- Table structure for table `other_service`
--

CREATE TABLE `other_service` (
  `other_service_id` int NOT NULL,
  `icon` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `short_quote` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `other_service`
--

INSERT INTO `other_service` (`other_service_id`, `icon`, `title`, `short_quote`) VALUES
(1, 'bi bi-cup-hot', 'Catering', 'Gourmet food'),
(2, 'bi bi-music-note-beamed', 'Music & DJ', 'Live entertainment'),
(3, 'bi bi-camera', 'Photography', 'Capture moments'),
(4, 'bi bi-palette', 'Decor', 'Stunning designs'),
(5, 'bi bi-flower1', 'Florals', 'Fresh flowers'),
(9, 'bi bi-truck', 'Transport', 'Transport Service');

-- --------------------------------------------------------

--
-- Table structure for table `our_story`
--

CREATE TABLE `our_story` (
  `id` int NOT NULL,
  `section_title` varchar(100) NOT NULL,
  `image_url` text NOT NULL,
  `team_name` varchar(100) DEFAULT NULL,
  `team_members` int DEFAULT NULL,
  `experience_years` int DEFAULT NULL,
  `intro_text` text NOT NULL,
  `intro_desc` text NOT NULL,
  `total_events` int NOT NULL,
  `vendor_partners` int NOT NULL,
  `satisfaction_percentage` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `our_story`
--

INSERT INTO `our_story` (`id`, `section_title`, `image_url`, `team_name`, `team_members`, `experience_years`, `intro_text`, `intro_desc`, `total_events`, `vendor_partners`, `satisfaction_percentage`, `created_at`, `updated_at`) VALUES
(1, 'Our Story', '1769758849455_our_story.png', 'Siddhivnayak Team 2023', 44, 40, 'Founded in 2008, Siddhivnayak has grown from a small boutique service to a leading event management company.', 'We specialize in creating personalized, memorable events that tell unique stories. With over 15 years of experience and 2000+ events managed, we bring passion and professionalism to every occasion.', 2000, 500, 98, '2026-01-30 06:37:19', '2026-02-04 09:20:57');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `package_name` varchar(255) NOT NULL,
  `start_price` decimal(10,2) NOT NULL,
  `max_guests` int NOT NULL,
  `description` text NOT NULL,
  `support` json NOT NULL,
  `service` text NOT NULL,
  `bg_image` varchar(500) DEFAULT NULL,
  `feature_included` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `type`, `package_name`, `start_price`, `max_guests`, `description`, `support`, `service`, `bg_image`, `feature_included`, `created_at`, `updated_at`) VALUES
(4, 'Basic', 'Basic Package', 10000.00, 100, 'Perfect package for small and elegant wedding ceremonies with essential services included.', '[\"Phone Support\", \"On-site Support\"]', 'Corporate', '1770102587415_8ezr4m.jpeg', '[\"Stage Decoration\", \"Basic Lighting\", \"Floral Entrance\", \"Sound System\"]', '2026-02-03 07:09:50', '2026-02-05 07:07:42'),
(5, 'Premium', 'premium package', 45000.00, 500, 'A premium birthday celebration package with full decoration, entertainment, and premium services.\r\n                                    ', '[\"Phone Support\", \"Email Support\", \"Live Chat\", \"On-site Support\"]', 'Wedding', '1770275474440_dnyxy.png', '[\"planning consultation\", \"planning\", \"planning consultation  in paevents\"]', '2026-02-04 09:00:14', '2026-02-05 07:11:17');

-- --------------------------------------------------------

--
-- Table structure for table `privacy_policy`
--

CREATE TABLE `privacy_policy` (
  `privacy_id` int NOT NULL,
  `privacy_title` varchar(255) NOT NULL,
  `privacy_image` text,
  `privacy_icon` varchar(50) DEFAULT NULL,
  `privacy_content` text NOT NULL,
  `privacy_last_updated` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `privacy_policy`
--

INSERT INTO `privacy_policy` (`privacy_id`, `privacy_title`, `privacy_image`, `privacy_icon`, `privacy_content`, `privacy_last_updated`) VALUES
(1, 'Privacy policy', '1769763432823_image1.jpg', 'bi bi-shield-lock', 'Your privacy is important to us. This Privacy Policy explains how EventSync Pro collects, uses, and protects your personal information.', '2026-01-30');

-- --------------------------------------------------------

--
-- Table structure for table `privacy_policy_points`
--

CREATE TABLE `privacy_policy_points` (
  `points_id` int NOT NULL,
  `policy_id` int NOT NULL,
  `points_icon` varchar(50) DEFAULT NULL,
  `point_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `privacy_policy_report`
--

CREATE TABLE `privacy_policy_report` (
  `policy_id` int NOT NULL,
  `section_no` int NOT NULL,
  `section_title` varchar(255) NOT NULL,
  `section_content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `privacy_policy_report`
--

INSERT INTO `privacy_policy_report` (`policy_id`, `section_no`, `section_title`, `section_content`, `created_at`, `updated_at`) VALUES
(2, 1, 'Introduction', 'SIDDHIVINAYAK EVENT respects your privacy and is committed to protecting your personal information. This Privacy Policy outlines the types of information we collect, how it is used, and the measures we take to ensure it remains secure.   We collect only the information necessary to provide our services effectively and to improve your overall experience. Your trust is important to us, and we are transparent about how your data is handled.', '2026-01-30 11:12:16', '2026-01-30 13:37:41'),
(7, 2, 'Information We Collect', 'Name, email address, phone number.\r\nEvent details and preferences.\r\nPayment information (processed securely).\r\nCommunication records.\r\nEvent location details.', '2026-01-30 19:33:15', '2026-01-30 19:33:15'),
(8, 3, 'How We Use Your Information', 'To provide event planning services.\r\n To communicate about your events.\r\nTo process payments.\r\nTo improve our services.\r\nTo prevent fraud.', '2026-01-30 19:45:57', '2026-01-30 19:47:50'),
(9, 4, 'Data Security', 'We use industry-standard security measures to protect your data:\r\nSecure data transmission (SSL encryption).\r\nLimited access to personal information.\r\nRegular security audits.\r\nSecure payment processing.\r\nEncrypted data storage', '2026-01-30 19:52:56', '2026-01-30 19:52:56'),
(10, 5, 'Third Party Sharing', 'We do not sell your personal information. We only share information with:\r\n Service providers essential for your event.\r\nWhen required by law.\r\nWith your consent.\r\nBusiness transfer situations.', '2026-01-30 20:00:02', '2026-01-30 20:00:02'),
(11, 6, 'Your Rights', 'You have the right to:\r\nAccess your personal information.\r\nCorrect inaccurate information.\r\nDelete your information.\r\nObject to processing.\r\nData portability.\r\nWithdraw consent.', '2026-01-30 20:05:48', '2026-01-30 20:05:48'),
(12, 7, 'Cookies Policy', 'We use cookies to improve your browsing experience:\r\nEssential cookies for website functionality.\r\nAnalytics cookies to understand usage.\r\nPreference cookies to remember settings.\r\nYou can control cookies through your browser settings.', '2026-01-30 20:09:17', '2026-01-30 20:09:17');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `service_id` int NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `short_quote` varchar(255) DEFAULT NULL,
  `feature1` varchar(255) DEFAULT NULL,
  `feature2` varchar(255) DEFAULT NULL,
  `feature3` varchar(255) DEFAULT NULL,
  `feature4` varchar(255) DEFAULT NULL,
  `feature5` varchar(255) DEFAULT NULL,
  `feature6` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `book_button` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`service_id`, `logo`, `short_quote`, `feature1`, `feature2`, `feature3`, `feature4`, `feature5`, `feature6`, `price`, `book_button`, `title`) VALUES
(1, 'bi bi-heart-fill', 'Dream weddings come true', 'Full event coordination', 'Venue selection & booking', 'Vendor negotiations', 'Timeline management', 'Day-of coordination', 'Guest management', 50000.00, 'Book Now', 'Wedding Planning'),
(2, 'bi bi-briefcase-fill', 'Professional excellence', 'Conference management', 'Product launches', 'Team building events', 'Award ceremonies', 'Trade shows', 'Brand activations', 35000.00, 'Book Now', 'Corporate Events'),
(3, 'bi bi-gift-fill', 'Celebrate every moment', 'Birthday celebrations', 'Anniversary parties', 'Baby showers', 'Reunion parties', 'Theme parties', 'House warming', 15000.00, 'Book Now', 'Social Events'),
(4, 'bi bi-display-fill', 'Connect digitally', 'Virtual conferences', 'Webinar production', 'Live streaming', 'Hybrid events', 'Online workshops', 'Tech support', 25000.00, 'Book Now', 'Virtual Events'),
(5, 'bi bi-gem', 'Elite experiences', 'VIP services', 'Exclusive venues', 'Celebrity bookings', 'Private jets/yachts', 'Luxury catering', 'Concierge service', 100000.00, 'Book Now', 'Luxury Events'),
(6, 'bi bi-music-note-beamed', 'Entertainment events', 'Artist management', 'Stage production', 'Sound & lighting', 'Ticket management', 'Security planning', 'Crowd management', 200000.00, 'Book Now', 'Concerts & Festivals'),
(7, 'bi bi-map', 'Events Over Ahilyanagar', 'Location scouting', 'Travel arrangements', 'Accommodation booking', 'Local vendor network', 'Visa assistance', '24/7 support', 75000.00, 'Book Now', 'Destination Events'),
(8, 'bi bi-gem', 'For noble causes', 'Charity galas', 'Silent auctions', 'Donor events', 'Marathons/walks', 'Golf tournaments', 'Online campaigns', 45000.00, 'Book Now', 'Fundraising');

-- --------------------------------------------------------

--
-- Table structure for table `service_slider`
--

CREATE TABLE `service_slider` (
  `slider_id` int NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `service_slider`
--

INSERT INTO `service_slider` (`slider_id`, `image`, `title`, `description`, `created_at`) VALUES
(4, '1769746816762_slider4.jpeg', 'Exceptional Event Services', 'Transform your vision into unforgettable experiences with our professional event management solutions', '2026-01-30 02:56:26');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `social_links_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `copywrite` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`social_links_id`, `title`, `description`, `copywrite`, `facebook`, `twitter`, `instagram`, `linkedin`, `youtube`, `created_at`) VALUES
(1, 'SIDDHIVINAYAK', 'Creating memorable experiences through professional event management. Let us help you bring your vision to life with our expert planning and coordination services.', '2026 Siddhivinayak Events. All rights reserved. | Designed with ❤️  for event management', 'https://facebook.com', 'https://twitter.com', 'https://instagram.com', 'https://linkedin.com', 'https://youtube.com', '2026-02-03 07:08:31');

-- --------------------------------------------------------

--
-- Table structure for table `terms_conditions`
--

CREATE TABLE `terms_conditions` (
  `id` int NOT NULL,
  `term_title` varchar(255) NOT NULL,
  `term_content` text NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `terms_conditions`
--

INSERT INTO `terms_conditions` (`id`, `term_title`, `term_content`, `status`, `created_at`) VALUES
(2, '<h2><strong>Description of Service</strong></h2>', '<p>EventFlow Pro provides a comprehensive online event management platform that allows users to:</p><ul><li>Create and manage events with customizable registration forms</li><li>Sell tickets and manage registrations with real-time tracking</li><li>Promote events through various channels including email and social media</li><li>Track event analytics and generate detailed reporting</li><li>Manage attendee communications and engagement</li><li>Handle event check-ins with QR code scanning</li><li>Create and manage seating arrangements</li><li>Generate and distribute digital tickets and badges</li><li>Process secure online payments</li><li>Access customer support and technical assistance</li></ul><p>The Service is available through our website and mobile applications. We reserve the right to modify or discontinue the Service (or any part thereof) at any time with or without notice.</p>', 'active', '2026-01-30 19:38:49'),
(3, 'User Accounts', '<p>To use certain features of the Service, you must register for an account. You agree to:</p>\r\n<ul>\r\n  <li>Provide accurate, current, and complete information during registration</li>\r\n  <li>Maintain and promptly update your account information to keep it accurate</li>\r\n  <li>Maintain the security of your password and accept all risks of unauthorized access</li>\r\n  <li>Notify us immediately of any breach of security or unauthorized use of your account</li>\r\n  <li>Be responsible for all activities that occur under your account</li>\r\n  <li>Not share your account credentials with any third party</li>\r\n  <li>Not create multiple accounts to circumvent our policies</li>\r\n  <li>Not use accounts of other users without their permission</li>\r\n </ul>\r\n <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>', 'active', '2026-01-30 19:40:06'),
(4, 'Event Creation and Management', '<p>As an event organizer using EventFlow Pro, you agree to:</p>\r\n<ul>\r\n  <li>Provide accurate event information including date, time, location, and pricing</li>\r\n  <li>Comply with all applicable laws and regulations regarding your events</li>\r\n  <li>Honor all tickets sold through our platform</li>\r\n  <li>Provide refunds according to your stated refund policy</li>\r\n  <li>Maintain appropriate insurance for your events where required</li>\r\n  <li>Clearly communicate any age restrictions or requirements</li>\r\n  <li>Provide accurate descriptions of event content and activities</li>\r\n  <li>Comply with venue rules and regulations</li>\r\n  <li>Ensure events do not promote illegal activities or hate speech</li>\r\n  <li>Obtain necessary permits and licenses for your events</li>\r\n</ul>\r\n<p>You are solely responsible for the events you create and manage through our platform. We reserve the right to remove any event that violates our policies or applicable laws.</p>', 'active', '2026-01-30 19:41:36'),
(5, 'Important Payment Information', '<p>All payments are processed through secure third-party payment processors. EventFlow Pro is not responsible for payment processing errors, bank fees, or currency conversion fees. Ticket sales are subject to our service fees as displayed during the checkout process. Refunds may be subject to processing fees as outlined in our refund policy.</p>\r\n', 'active', '2026-01-30 19:42:28'),
(6, 'Fees and Payments', '<p>Our comprehensive fee structure includes:</p>\r\n<ul>\r\n  <li><strong>Service Fees:</strong> Applied to each ticket sold (2.5% - 5% depending on your subscription plan)</li>\r\n  <li><strong>Processing Fees:</strong> 2.9% + $0.30 per transaction for payment processing</li>\r\n  <li><strong>Subscription Fees:</strong> For premium features starting at $29/month or $299/year</li>\r\n  <li><strong>Add-on Services:</strong> Custom fees for additional services like premium support or custom development</li>\r\n </ul>\r\n <p>All fees are non-refundable unless otherwise stated in our refund policy. We reserve the right to change our fees at any time with 30 days notice to current users.</p>\r\n <p>Payments will be processed to your account within 5-7 business days after the completion of your event, minus any applicable fees. International payments may take additional time and may be subject to currency conversion fees.</p>\r\n <p>You agree to pay all applicable taxes associated with your ticket sales. We are not responsible for collecting or remitting taxes on your behalf unless explicitly stated.</p>', 'active', '2026-01-30 19:43:48'),
(7, 'Cancellations and Refunds', '<h3>Event Cancellations by Organizers:</h3>\r\n<ul>\r\n  <li>If you cancel an event, you must notify all attendees immediately</li>\r\n  <li>Refunds must be processed according to your stated refund policy</li>\r\n  <li>Service fees are non-refundable in case of event cancellation</li>\r\n  <li>You must provide alternative arrangements if applicable</li>\r\n  <li>Repeat cancellations may result in account suspension</li>\r\n</ul>                           \r\n<h3>Refund Policies:</h3>\r\n<ul>\r\n  <li>Refund policies are set by event organizers and must be clearly stated</li>\r\n  <li>EventFlow Pro will process refunds as directed by the organizer</li>\r\n  <li>Refunds are typically processed within 7-14 business days</li>\r\n  <li>Processing fees may be deducted from refund amounts</li>\r\n  <li>Chargebacks may result in additional fees</li>\r\n</ul>\r\n<h3>Service Termination:</h3>\r\n<p>We reserve the right to terminate service for violations of these terms, non-payment of fees, or fraudulent activities. Upon termination, you must cease all use of the Service and any outstanding fees become immediately due.</p>', 'active', '2026-01-30 19:56:31'),
(8, 'Intellectual Property', '<h3>Our Intellectual Property:</h3>\r\n<p>All content on the EventFlow Pro platform, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of EventFlow Pro or its content suppliers and protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>\r\n<h3>Your Content:</h3>\r\n<p>You retain ownership of your event content (including event descriptions, images, logos, and other materials you upload). However, by uploading content to our platform, you grant EventFlow Pro a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your content in connection with our services.</p>\r\n<h3>Restrictions:</h3>\r\n<ul>\r\n  <li>You may not copy, modify, distribute, sell, or lease any part of our services</li>\r\n  <li>You may not reverse engineer or attempt to extract source code from our platform</li>\r\n  <li>You may not use our trademarks without our prior written permission</li>\r\n  <li>You may not scrape or collect data from our platform without authorization</li>\r\n</ul>', 'active', '2026-01-30 19:57:35'),
(9, 'Limitation of Liability', '<p>EventFlow Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:</p>\r\n<ul>\r\n  <li>Your use or inability to use the service</li>\r\n  <li>Unauthorized access to or alteration of your transmissions or data</li>\r\n  <li>Statements or conduct of any third party on the service</li>\r\n  <li>Any other matter relating to the service</li>\r\n  <li>Event cancellations or changes by organizers</li>\r\n  <li>Attendee behavior at events</li>\r\n  <li>Technical issues beyond our reasonable control</li>\r\n  <li>Force majeure events including natural disasters</li>\r\n</ul>\r\n<p>Our total cumulative liability to you for all claims arising from or related to these Terms or your use of the Service shall not exceed the total amount of fees you paid to us in the twelve (12) months preceding the event giving rise to the claim.</p>\r\n<p>Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitation may not apply to you.</p>', 'active', '2026-01-30 19:58:33');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `event_type` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `message`, `rating`, `created_at`, `event_type`, `image`) VALUES
(70, 'Amit Kumar', '“Stress-free experience. From setup to closure, everything was handled professionally. Highly recommended for corporate events.”', 5, '2026-02-06 05:35:48', 'Corporate Event', '1770356096208_81683.jpg'),
(71, 'Mahesh Lodhe', '“Excellent management and very professional service. Our corporate event was smooth and well-organized.”', 5, '2026-02-06 05:41:48', 'Corporate Event', '1770356425459_32378.jpg'),
(72, 'Sham', '“Amazing birthday celebration! Everything was perfectly arranged and fun.”', 5, '2026-02-06 05:46:11', 'Birthday Party', '1770356707532_66896.jpg'),
(77, 'Gaurav Honde ', 'Key strengths include a skilled management team, strong client relationships, and a scalable business model. However, increasing competition and rising operational costs remain areas of concern.', 5, '2026-02-07 05:39:20', 'Corporate Event', '1770025747747_55465.jpg'),
(78, 'mahesh Lodhe', 'for give review related to my experience during ma event ', 5, '2026-02-07 05:48:12', 'Birthday Party', '1770443237677_66861.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials_header`
--

CREATE TABLE `testimonials_header` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `testimonials_header`
--

INSERT INTO `testimonials_header` (`id`, `title`, `subtitle`, `image`, `created_at`) VALUES
(1, 'Experience From Our Clients', ' Real stories from people who trusted us with their special moments.\r\n                    See what our clients say about their unforgettable experiences.', '1770007082185_heder.jpg', '2026-01-30 05:53:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `mobile`, `password`, `created_at`, `profile_photo`) VALUES
(1, 'Karan Gahininath Dhadge', 'dhadgekaran8@gmail.com', '8261978030', 'Dhadge@1234', '2026-01-29 05:22:04', '1770440120950_55877.jpg'),
(2, 'Gaurav Honde ', 'gauravhonde66@gmail.com', '7620796870', '12345678', '2026-01-29 09:02:38', '1770025747747_55465.jpg'),
(3, 'mahesh', 'maheshlodhe2910@gmail.com', '07823867123', 'mp9696', '2026-02-02 03:29:49', '1770610924001_86001.jpg'),
(4, 'Pawar Gayatri Arun', 'gayatripawar1880@gmail.com', '8329875781', '2sept2004', '2026-02-04 05:16:41', '1770383004599_13248.jpg'),
(5, 'Priti Mahadev Walke', 'walke@gmail.com', '08080582841', 'priti@2610', '2026-02-04 06:15:22', NULL),
(6, 'Pranjal Ghodechor', 'pranjalghodechor2005@gmail.com', '8080282215', 'pranjal2611', '2026-02-04 06:23:48', NULL),
(7, 'xyz', 'xyz@gmail.com', '12345abcd', '12345678', '2026-02-04 09:26:27', '1770197275382_79506.jpg'),
(8, 'Gaurav', 'gaurav@gmail.com', '7620796870', '12345678', '2026-02-05 16:31:57', NULL),
(9, 'Amit Kumar', 'amit@gmail.com', '7620796870', '12345678', '2026-02-06 05:10:35', '1770356096208_81683.jpg'),
(10, 'Mahesh Lodhe', 'mahesh@gmail.com', '9422850916', '12345678', '2026-02-06 05:38:02', '1770356425459_32378.jpg'),
(11, 'Sham', 'sham@gmail.com', '9422850916', '12345678', '2026-02-06 05:42:59', '1770356707532_66896.jpg'),
(12, 'q', 'wqewre@gmail.com', 'wdesfgfgdfsdasa', 'qwqewfgthggrfedd', '2026-02-06 08:44:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vision_mission`
--

CREATE TABLE `vision_mission` (
  `id` int NOT NULL,
  `type` enum('mission','vision') NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `features` text,
  `tag_line` varchar(150) DEFAULT NULL,
  `icon_class` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vision_mission`
--

INSERT INTO `vision_mission` (`id`, `type`, `title`, `description`, `features`, `tag_line`, `icon_class`, `status`, `created_at`, `updated_at`) VALUES
(1, 'vision', 'Vision', 'To become a trusted and leading event management company that transforms every occasion into a memorable experience through creativity, innovation, and flawless execution.\r\n', 'Adopt modern event technologies,Create lasting client relationships,Deliver world-class event experiences', 'Creating Experiences Beyond Expectations', 'fas fa-eye', 1, '2026-01-30 17:22:36', '2026-01-30 18:13:01'),
(2, 'mission', 'Mission', 'Our mission is to plan, design, and execute exceptional events by understanding client needs, maintaining high-quality standards, and delivering stress-free, well-organized, and impactful events.\r\n', 'Client-focused event planning,Creative and customized event solutions,On-time execution with perfection', 'Your Vision, Our Execution', 'fas fa-bullseye', 1, '2026-01-30 17:23:39', '2026-01-30 18:13:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_header`
--
ALTER TABLE `about_header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_email` (`admin_email`);

--
-- Indexes for table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`blog_id`);

--
-- Indexes for table `blog_slider`
--
ALTER TABLE `blog_slider`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`);

--
-- Indexes for table `book_event`
--
ALTER TABLE `book_event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_book_event_user` (`user_id`);

--
-- Indexes for table `book_event_mobile`
--
ALTER TABLE `book_event_mobile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `choose_us`
--
ALTER TABLE `choose_us`
  ADD PRIMARY KEY (`choose_us_id`);

--
-- Indexes for table `contact_form`
--
ALTER TABLE `contact_form`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_header`
--
ALTER TABLE `contact_header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`contact_id`);

--
-- Indexes for table `core_values`
--
ALTER TABLE `core_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_enquiries`
--
ALTER TABLE `event_enquiries`
  ADD PRIMARY KEY (`enquiry_id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery_header`
--
ALTER TABLE `gallery_header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `header_faq`
--
ALTER TABLE `header_faq`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `header_packages`
--
ALTER TABLE `header_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_our_story`
--
ALTER TABLE `home_our_story`
  ADD PRIMARY KEY (`home_our_story_id`);

--
-- Indexes for table `home_slider`
--
ALTER TABLE `home_slider`
  ADD PRIMARY KEY (`home_slider_id`);

--
-- Indexes for table `how_work`
--
ALTER TABLE `how_work`
  ADD PRIMARY KEY (`how_work_id`);

--
-- Indexes for table `journey_timeline`
--
ALTER TABLE `journey_timeline`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leadership_team`
--
ALTER TABLE `leadership_team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `other_service`
--
ALTER TABLE `other_service`
  ADD PRIMARY KEY (`other_service_id`);

--
-- Indexes for table `our_story`
--
ALTER TABLE `our_story`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `privacy_policy`
--
ALTER TABLE `privacy_policy`
  ADD PRIMARY KEY (`privacy_id`);

--
-- Indexes for table `privacy_policy_points`
--
ALTER TABLE `privacy_policy_points`
  ADD PRIMARY KEY (`points_id`),
  ADD KEY `policy_id` (`policy_id`);

--
-- Indexes for table `privacy_policy_report`
--
ALTER TABLE `privacy_policy_report`
  ADD PRIMARY KEY (`policy_id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `service_slider`
--
ALTER TABLE `service_slider`
  ADD PRIMARY KEY (`slider_id`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`social_links_id`);

--
-- Indexes for table `terms_conditions`
--
ALTER TABLE `terms_conditions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials_header`
--
ALTER TABLE `testimonials_header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- Indexes for table `vision_mission`
--
ALTER TABLE `vision_mission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_header`
--
ALTER TABLE `about_header`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blog`
--
ALTER TABLE `blog`
  MODIFY `blog_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `blog_slider`
--
ALTER TABLE `blog_slider`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `book_event`
--
ALTER TABLE `book_event`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `book_event_mobile`
--
ALTER TABLE `book_event_mobile`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `choose_us`
--
ALTER TABLE `choose_us`
  MODIFY `choose_us_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_form`
--
ALTER TABLE `contact_form`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `contact_header`
--
ALTER TABLE `contact_header`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contact_info`
--
ALTER TABLE `contact_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `contact_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `core_values`
--
ALTER TABLE `core_values`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `event_enquiries`
--
ALTER TABLE `event_enquiries`
  MODIFY `enquiry_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `features`
--
ALTER TABLE `features`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `gallery_header`
--
ALTER TABLE `gallery_header`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `header_faq`
--
ALTER TABLE `header_faq`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `header_packages`
--
ALTER TABLE `header_packages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `home_our_story`
--
ALTER TABLE `home_our_story`
  MODIFY `home_our_story_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `home_slider`
--
ALTER TABLE `home_slider`
  MODIFY `home_slider_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `how_work`
--
ALTER TABLE `how_work`
  MODIFY `how_work_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `journey_timeline`
--
ALTER TABLE `journey_timeline`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `leadership_team`
--
ALTER TABLE `leadership_team`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `other_service`
--
ALTER TABLE `other_service`
  MODIFY `other_service_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `our_story`
--
ALTER TABLE `our_story`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `privacy_policy`
--
ALTER TABLE `privacy_policy`
  MODIFY `privacy_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `privacy_policy_points`
--
ALTER TABLE `privacy_policy_points`
  MODIFY `points_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `privacy_policy_report`
--
ALTER TABLE `privacy_policy_report`
  MODIFY `policy_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `service_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `service_slider`
--
ALTER TABLE `service_slider`
  MODIFY `slider_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `social_links_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `terms_conditions`
--
ALTER TABLE `terms_conditions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `testimonials_header`
--
ALTER TABLE `testimonials_header`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `vision_mission`
--
ALTER TABLE `vision_mission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book_event`
--
ALTER TABLE `book_event`
  ADD CONSTRAINT `fk_book_event_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `privacy_policy_points`
--
ALTER TABLE `privacy_policy_points`
  ADD CONSTRAINT `privacy_policy_points_ibfk_1` FOREIGN KEY (`policy_id`) REFERENCES `privacy_policy_report` (`policy_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
