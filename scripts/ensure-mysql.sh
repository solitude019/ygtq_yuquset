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

if ! ss -lnt "sport = :${MYSQL_PORT}" 2>/dev/null | grep -q LISTEN; then
  echo "[mysql] starting mysqld on port ${MYSQL_PORT}..."
  nohup mysqld \
    --user=mysql \
    --datadir="${MYSQL_DATA_DIR}" \
    --socket="${MYSQL_SOCK}" \
    --port="${MYSQL_PORT}" \
    --bind-address=0.0.0.0 \
    > /app/work/logs/bypass/mysqld.log 2>&1 &
  for _ in $(seq 1 30); do
    if ss -lnt "sport = :${MYSQL_PORT}" 2>/dev/null | grep -q LISTEN; then
      break
    fi
    sleep 1
  done
fi

# Use Node.js + mysql2 (available from project deps) because the mysql CLI
# may not be installed in the sandbox.
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
node - "${DB_ADMIN_USER}" "${DB_ADMIN_PASSWORD}" "${DB_NAME}" <<'NODE'
const mysql = require(require('path').resolve(process.cwd(), 'node_modules/mysql2/promise'));
(async () => {
  const [adminUser, adminPass, dbName] = process.argv.slice(2);
  let conn;
  try {
    conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: adminUser,
      password: adminPass,
      multipleStatements: true,
    });
  } catch (e) {
    // Fall back to socket auth (e.g., root with unix_socket plugin on first init)
    conn = await mysql.createConnection({
      socketPath: '/var/run/mysqld/mysqld.sock',
      user: adminUser,
      multipleStatements: true,
    });
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
