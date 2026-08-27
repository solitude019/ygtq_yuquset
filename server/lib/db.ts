import mysql, { type Pool, type PoolOptions, type RowDataPacket } from 'mysql2/promise';

let _pool: Pool | null = null;

function createPool(): Pool {
  const options: PoolOptions = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'YuQuest@2026',
    database: process.env.DB_NAME || 'yu_sports',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: 'local',
  };
  return mysql.createPool(options);
}

export function getPool(): Pool {
  if (!_pool) {
    _pool = createPool();
  }
  return _pool;
}

export type QueryRows = RowDataPacket[];

export interface DbRow {
  [key: string]: unknown;
}
