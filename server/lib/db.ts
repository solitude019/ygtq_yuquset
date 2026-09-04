import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';

/** SQL bind parameter values we use across the app. */
type SqlParam = string | number | null;
type SqlParams = SqlParam[];

/**
 * MySQL connection pool.
 *
 * Connection parameters are read from environment variables so the same code
 * runs in the Coze sandbox (dev) and on a self-hosted Aliyun ECS server (prod).
 *
 *   DB_HOST=localhost
 *   DB_PORT=3306
 *   DB_NAME=yu_sports
 *   DB_USER=yu
 *   DB_PASSWORD=YuQuest@2026
 */
let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'yu_sports',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    // DECIMAL is returned as a JS number instead of a string.
    decimalNumbers: true,
  });

  return pool;
}

/** Run a SELECT and return rows typed as T. */
export async function query<T = RowDataPacket[]>(
  sql: string,
  params: unknown[] = []
): Promise<T> {
  const [rows] = await getPool().query(sql, params as SqlParams);
  return rows as T;
}

/** Run an INSERT / UPDATE / DELETE and return the result header. */
export async function execute(
  sql: string,
  params: unknown[] = []
): Promise<ResultSetHeader> {
  const [result] = await getPool().execute(sql, params as SqlParams);
  return result as ResultSetHeader;
}
