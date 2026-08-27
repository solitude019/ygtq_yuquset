#!/bin/bash
# Ensure MySQL is running and the yu_sports database exists.
# Safe to call repeatedly.

set -Eeuo pipefail

MYSQL_DATA_DIR="${MYSQL_DATA_DIR:-/var/lib/mysql}"
MYSQL_SOCK="/var/run/mysqld/mysqld.sock"
MYSQL_PORT="${MYSQL_PORT:-3306}"
DB_NAME="${DB_NAME:-yu_sports}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-YuQuest@2026}"

mkdir -p /var/run/mysqld /var/log/mysql
chown -R mysql:mysql /var/run/mysqld 2>/dev/null || true
chown -R mysql:mysql "${MYSQL_DATA_DIR}" 2>/dev/null || true

if ! ss -lnt "sport = :${MYSQL_PORT}" 2>/dev/null | grep -q LISTEN; then
  echo "[mysql] starting mysqld on port ${MYSQL_PORT}..."
  nohup mysqld \
    --user=mysql \
    --datadir="${MYSQL_DATA_DIR}" \
    --socket="${MYSQL_SOCK}" \
    --port="${MYSQL_PORT}" \
    --bind-address=127.0.0.1 \
    > /app/work/logs/bypass/mysqld.log 2>&1 &
  for _ in $(seq 1 30); do
    if ss -lnt "sport = :${MYSQL_PORT}" 2>/dev/null | grep -q LISTEN; then
      break
    fi
    sleep 1
  done
fi

# Wait for socket to be ready
for _ in $(seq 1 20); do
  if mysqladmin --socket="${MYSQL_SOCK}" -u"${DB_USER}" -p"${DB_PASSWORD}" ping >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

mysql -u"${DB_USER}" -p"${DB_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

echo "[mysql] ready (db=${DB_NAME})"
