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

# Create database + application user + tables + seed data (idempotent).
# Uses project deps (mysql2 / bcryptjs) via Node since the mysql CLI may not exist.
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
( cd "${COZE_WORKSPACE_PATH}" && \
  DB_ADMIN_USER="${DB_ADMIN_USER:-root}" \
  DB_ADMIN_PASSWORD="${DB_ADMIN_PASSWORD:-YuQuest@2026}" \
  DB_USER="${DB_USER:-yu}" \
  DB_PASSWORD="${DB_PASSWORD:-YuQuest@2026}" \
  DB_NAME="${DB_NAME:-yu_sports}" \
  node scripts/init-db.js )

echo "[mysql] ready (db=${DB_NAME})"
