/* eslint-disable no-console */
// Idempotent MySQL initialization for the Yu sports site.
// - Connects as admin (root) trying TCP(socket password) -> socket(password) -> socket(no password)
// - Ensures root password, yu application user, database, tables and seed data
// Safe to run repeatedly.

const path = require('path');
const mysql = require(path.resolve(process.cwd(), 'node_modules/mysql2/promise'));
const bcrypt = require(path.resolve(process.cwd(), 'node_modules/bcryptjs'));

const ADMIN_USER = process.env.DB_ADMIN_USER || 'root';
const ADMIN_PASS = process.env.DB_ADMIN_PASSWORD || 'YuQuest@2026';
const APP_USER = process.env.DB_USER || 'yu';
const APP_PASS = process.env.DB_PASSWORD || 'YuQuest@2026';
const DB_NAME = process.env.DB_NAME || 'yu_sports';

async function connectAdmin() {
  const attempts = [
    { host: '127.0.0.1', port: Number(process.env.DB_PORT || 3306), user: ADMIN_USER, password: ADMIN_PASS },
    { socketPath: '/var/run/mysqld/mysqld.sock', user: ADMIN_USER, password: ADMIN_PASS },
    { socketPath: '/var/run/mysqld/mysqld.sock', user: ADMIN_USER },
  ];
  let lastErr;
  for (const opts of attempts) {
    try {
      const conn = await mysql.createConnection({ ...opts, multipleStatements: true, connectTimeout: 5000 });
      return conn;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function main() {
  const conn = await connectAdmin();

  // 1. Ensure root password (fresh installs use unix_socket auth)
  try {
    await conn.query(
      `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ?`,
      [ADMIN_PASS]
    );
  } catch (e) {
    // ignore (e.g. already set / insufficient privilege in some setups)
  }

  // 2. Application user
  await conn.query(
    `CREATE USER IF NOT EXISTS 'yu'@'localhost' IDENTIFIED WITH mysql_native_password BY ?`,
    [APP_PASS]
  );
  await conn.query(
    `CREATE USER IF NOT EXISTS 'yu'@'%' IDENTIFIED WITH mysql_native_password BY ?`,
    [APP_PASS]
  );
  // Make sure the password is current
  await conn.query(`ALTER USER 'yu'@'localhost' IDENTIFIED WITH mysql_native_password BY ?`, [APP_PASS]);
  await conn.query(`ALTER USER 'yu'@'%' IDENTIFIED WITH mysql_native_password BY ?`, [APP_PASS]);

  // 3. Database
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.query(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO 'yu'@'localhost'`);
  await conn.query(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO 'yu'@'%'`);
  await conn.query('FLUSH PRIVILEGES');
  await conn.query(`USE \`${DB_NAME}\``);

  // 4. Tables
  await conn.query(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await conn.query(`CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await conn.query(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_no VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_id INT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category
      FOREIGN KEY (category_id) REFERENCES categories(id)
      ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 5. Seed admin
  const [adminRows] = await conn.query('SELECT COUNT(*) AS n FROM admins WHERE username = ?', ['admin']);
  if (Number(adminRows[0].n) === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    await conn.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', ['admin', hash]);
  }

  // 6. Seed categories
  const categories = [
    ['Badminton', 'Professional badminton rackets, shuttlecocks and accessories for all skill levels'],
    ['Football', 'Match and training footballs, boots and gear for champions'],
    ['Basketball', 'Indoor and outdoor basketballs designed for control and durability'],
    ['Tennis', 'Tennis rackets, balls and equipment for club and tournament play'],
    ['Volleyball', 'Beach and indoor volleyballs engineered for precision flight'],
    ['Table Tennis', 'Blades, rubbers and tournament-grade table tennis balls'],
    ['Rugby', 'Rugby balls built for grip, accuracy and all-weather performance'],
  ];
  const catIdByName = {};
  for (const [name, desc] of categories) {
    const [exist] = await conn.query('SELECT id FROM categories WHERE name = ?', [name]);
    if (exist.length === 0) {
      const [res] = await conn.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, desc]);
      catIdByName[name] = res.insertId;
    } else {
      catIdByName[name] = exist[0].id;
    }
  }

  // 7. Seed products (skip if product_no exists)
  const products = [
    ['YU-BD-001', 'Yu Power Smash 900 Racket', 'Badminton', 189.0, 45, '/images/product-badminton-1.png', 'Advanced carbon-fiber badminton racket delivering explosive smashes and pinpoint control.'],
    ['YU-BD-002', 'Yu Aero Shuttle 12-Pack', 'Badminton', 28.5, 120, '/images/product-badminton-2.png', 'Tournament-grade feather shuttlecocks with stable trajectory and durable cork base.'],
    ['YU-FB-001', 'Yu Pro Match Football', 'Football', 49.9, 200, '/images/product-football-1.png', 'FIFA-quality match football with textured surface for enhanced grip and flight.'],
    ['YU-FB-002', 'Yu Strike Training Ball', 'Football', 29.9, 180, '/images/product-football-2.png', 'Durable training football engineered for consistent bounce on grass and turf.'],
    ['YU-BK-001', 'Yu Court Grip Basketball', 'Basketball', 45.0, 90, '/images/product-basketball-1.png', 'Indoor competition basketball with deep channels for superior ball handling.'],
    ['YU-BK-002', 'Yu Street King Basketball', 'Basketball', 39.0, 150, '/images/product-basketball-2.png', 'All-surface outdoor basketball built to withstand asphalt and concrete courts.'],
    ['YU-TN-001', 'Yu Spin Control Tennis Racket', 'Tennis', 159.0, 35, '/images/product-tennis-1.png', 'Player-favorite tennis racket offering spin-friendly string pattern and stable feel.'],
    ['YU-VB-001', 'Yu Flight Pro Volleyball', 'Volleyball', 42.0, 80, '/images/product-volleyball-1.png', 'Soft-touch indoor volleyball with 18-panel construction for accurate flight.'],
    ['YU-TT-001', 'Yu Tournament Ping Pong Balls', 'Table Tennis', 15.9, 300, '/images/product-tabletennis-1.png', '3-star 40+ table tennis balls delivering consistent bounce and spin response.'],
  ];
  for (const [no, name, catName, price, stock, img, desc] of products) {
    const [exist] = await conn.query('SELECT id FROM products WHERE product_no = ?', [no]);
    if (exist.length === 0) {
      await conn.query(
        'INSERT INTO products (product_no, name, category_id, price, stock, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [no, name, catIdByName[catName] || null, price, stock, img, desc]
      );
    }
  }

  const [[a]] = await conn.query('SELECT COUNT(*) AS n FROM admins');
  const [[c]] = await conn.query('SELECT COUNT(*) AS n FROM categories');
  const [[p]] = await conn.query('SELECT COUNT(*) AS n FROM products');
  console.log(`[init-db] admins=${a.n} categories=${c.n} products=${p.n}`);

  await conn.end();
}

main().catch((e) => {
  console.error('[init-db] failed:', e.message);
  process.exit(1);
});
