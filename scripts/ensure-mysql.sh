#!/bin/bash
# Ensure MySQL is running and the yu_sports database exists.
# Safe to call repeatedly.

set -Eeuo pipefail

MYSQL_DATA_DIR="${MYSQL_DATA_DIR:-/var/lib/mysql}"
MYSQL_SOCK="/var/run/mysqld/mysqld.sock"
MYSQL_PORT="${MYSQL_PORT:-3306}"
DB_NAME="${DB_NAME:-yu_sports}"
DB_ADMIN_USER="${DB_ADMIN_USER:-root}"
DB_ADMIN_PASSWORD="${DB_ADMIN_PASSWORD:-YuQuest@2026}"

mkdir -p /var/run/mysqld /var/log/mysql /app/work/logs/bypass
chown -R mysql:mysql /var/run/mysqld 2>/dev/null || true
chown -R mysql:mysql "${MYSQL_DATA_DIR}" 2>/dev/null || true

# Install MySQL server if missing
if ! command -v mysqld >/dev/null 2>&1; then
  echo "[mysql] mysqld not found, installing mysql-server..."
  apt-get install -y mysql-server >/app/work/logs/bypass/mysqld-install.log 2>&1 || {
    echo "[mysql] failed to install mysql-server"; exit 1;
  }
fi

if ! ss -lnt "sport = :${MYSQL_PORT}" 2>/dev/null | grep -q LISTEN; then
  echo "[mysql] starting mysqld on port ${MYSQL_PORT}..."
  nohup mysqld \
    --user=mysql \
    --datadir="${MYSQL_DATA_DIR}" \
    --socket="${MYSQL_SOCK}" \
    --port="${MYSQL_PORT}" \
    --bind-address=0.0.0.0 \
    > /app/work/logs/bypass/mysqld.log 2>&1 &
  for _ in $(seq 1 60); do
    if ss -lnt "sport = :${MYSQL_PORT}" 2>/dev/null | grep -q LISTEN; then
      break
    fi
    sleep 1
  done
fi

# Wait for socket file to exist
for _ in $(seq 1 30); do
  [ -S "${MYSQL_SOCK}" ] && break
  sleep 1
done

# Use Node.js + mysql2 (available from project deps) because the mysql CLI
# may not be installed in the sandbox.
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
node - "${DB_ADMIN_USER}" "${DB_ADMIN_PASSWORD}" "${DB_NAME}" <<'NODE'
const mysql = require(require('path').resolve(process.cwd(), 'node_modules/mysql2/promise'));
(async () => {
  const [adminUser, adminPass, dbName] = process.argv.slice(2);
  let conn;
  const tryConnect = async (opts) => {
    try {
      return await mysql.createConnection(opts);
    } catch (e) {
      return null;
    }
  };
  // 1. TCP with password
  conn = await tryConnect({
    host: '127.0.0.1', port: 3306, user: adminUser, password: adminPass,
    multipleStatements: true, connectTimeout: 5000,
  });
  // 2. Socket with password
  if (!conn) {
    conn = await tryConnect({
      socketPath: '/var/run/mysqld/mysqld.sock', user: adminUser, password: adminPass,
      multipleStatements: true, connectTimeout: 5000,
    });
  }
  // 3. Socket without password (fresh install, unix_socket auth)
  if (!conn) {
    conn = await tryConnect({
      socketPath: '/var/run/mysqld/mysqld.sock', user: adminUser,
      multipleStatements: true, connectTimeout: 5000,
    });
  }
  if (!conn) {
    console.error('[mysql] cannot connect to mysqld');
    process.exit(1);
  }
  // Ensure root password is set (works when connected via unix_socket on fresh installs)
  try {
    await conn.query(
      `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ?`,
      [adminPass]
    );
  } catch (e) {
    // Ignore if not permitted (e.g., already set)
  }
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.end();
})().catch((e) => {
  console.error('[mysql] init failed:', e.message);
  process.exit(1);
});
NODE

echo "[mysql] ready (db=${DB_NAME})"
