-- ======================================================================
-- Yu Sports - MySQL schema & seed data
-- Database: yu_sports
-- Charset : utf8mb4
-- Run with: mysql -u root -p < schema.sql
-- (or create the DB first, then: mysql -u yu -p yu_sports < schema.sql)
-- ======================================================================

CREATE DATABASE IF NOT EXISTS `yu_sports`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `yu_sports`;

-- ----------------------------------------------------------------------
-- admins (administrator accounts)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)  NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_admins_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- categories (product categories)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `description` TEXT         NOT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_no`  VARCHAR(50)  NOT NULL,
  `name`        VARCHAR(200) NOT NULL,
  `category_id` INT UNSIGNED NULL,
  `price`       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock`       INT          NOT NULL DEFAULT 0,
  `image_url`   VARCHAR(255) NOT NULL DEFAULT '',
  `description` TEXT         NOT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_products_product_no` (`product_no`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- config (key-value runtime config, e.g. upload root directory)
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `config` (
  `config_key`  VARCHAR(100) NOT NULL,
  `value`       TEXT         NOT NULL,
  `description` VARCHAR(255) NOT NULL DEFAULT '',
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================================
-- Seed data
-- ======================================================================

-- Default admin: username = admin, password = ygtq@18618437055
-- (bcrypt hash; if you prefer, regenerate with the server's bcrypt)
INSERT INTO `admins` (`username`, `password_hash`) VALUES
  ('admin', '$2b$10$71c0txsyAPjQzb5FXD29xOjfMqlFaB8NUFMi3RW/PnNCGnvCjgzBO')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
  (1, 'Football',   'Professional footballs and soccer balls for all levels'),
  (2, 'Basketball', 'High-quality basketballs for indoor and outdoor play'),
  (3, 'Volleyball', 'Official volleyballs for beach and indoor courts'),
  (4, 'Tennis',     'Premium tennis balls for training and competition'),
  (5, 'Baseball',   'Professional baseballs for games and practice'),
  (6, 'Golf',       'High-performance golf balls for every skill level'),
  (7, 'Rugby',      'Durable rugby balls for match and training use')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

INSERT INTO `products`
  (`product_no`, `name`, `category_id`, `price`, `stock`, `image_url`, `description`) VALUES
  ('FB-001', 'Apex Pro Match Ball',        1, 49.99, 200, '/images/product-football-1.png',   'Official size and weight match ball with premium PU leather cover. Designed for professional matches with superior flight stability and water resistance.'),
  ('FB-002', 'Apex Training Ball',         1, 29.99, 500, '/images/product-football-2.png',   'Durable training ball ideal for daily practice. Features reinforced bladder and abrasion-resistant cover for extended lifespan.'),
  ('BB-001', 'Apex Elite Indoor Ball',     2, 59.99, 150, '/images/product-basketball-1.png', 'Premium full-grain leather basketball engineered for indoor courts. Offers exceptional grip, consistency, and feel.'),
  ('BB-002', 'Apex Street Outdoor Ball',   2, 34.99, 300, '/images/product-basketball-2.png', 'Rubber cover basketball built for outdoor surfaces. Deep channel design provides reliable handling in all weather conditions.'),
  ('VB-001', 'Apex Competition Volleyball',3, 44.99, 180, '/images/product-volleyball-1.png', 'Official competition volleyball with soft-touch composite leather. Perfect balance of cushioning and control for serious players.'),
  ('TN-001', 'Apex Tour Tennis Balls',     4, 24.99, 600, '/images/product-tennis-1.png',    'Championship-grade tennis balls with premium felt cover. Consistent bounce and durability for competitive play.'),
  ('BS-001', 'Apex Classic Baseball',      5, 19.99, 400, '/images/product-baseball-1.png',  'Official size and weight baseball with full-grain leather cover. Cork center provides optimal resilience and performance.'),
  ('GF-001', 'Apex Distance Golf Ball',    6, 39.99, 250, '/images/product-golf-1.png',      'Advanced 3-piece construction for maximum distance and control. Low compression core delivers explosive speed off the tee.'),
  ('RG-001', 'Apex Match Rugby Ball',      7, 54.99, 120, '/images/product-rugby-1.png',     'Official match rugby ball with ergonomic grip pattern. Premium synthetic leather ensures durability in all conditions.')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Runtime config: physical directory for uploaded product images
INSERT INTO `config` (`config_key`, `value`, `description`) VALUES
  ('upload_root_dir', '/opt/ygtq/product', '本地本地上传文件存放根目录（绝对路径）')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);
