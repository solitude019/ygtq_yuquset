import path from 'path';
import { query } from './db';

interface ConfigRow {
  value: string;
}

/**
 * Simple key-value config backed by the `config` table (MySQL).
 * Values are cached in memory; call refreshConfig() to reload.
 */
const cache = new Map<string, string>();

function defaultUploadRoot(): string {
  // Files are stored in a sibling `product` directory of the project.
  // e.g. project at /opt/ygtq/ygtq_yuquest  ->  uploads at /opt/ygtq/product
  const projectRoot = process.env.COZE_WORKSPACE_PATH || process.cwd();
  return path.resolve(projectRoot, '..', 'product');
}

/**
 * Read a config value by key. Resolution order:
 *   1. UPLOAD_ROOT_DIR environment variable (for this specific key)
 *   2. `config` table in MySQL
 *   3. `fallback` argument
 */
export async function getConfig(key: string, fallback = ''): Promise<string> {
  if (cache.has(key)) return cache.get(key) as string;

  // Environment variable override (deployment-friendly, no DB needed).
  if (key === 'upload_root_dir' && process.env.UPLOAD_ROOT_DIR) {
    cache.set(key, process.env.UPLOAD_ROOT_DIR);
    return process.env.UPLOAD_ROOT_DIR;
  }

  try {
    const rows = await query<ConfigRow[]>(
      'SELECT `value` FROM config WHERE config_key = ? LIMIT 1',
      [key]
    );
    const value = rows.length > 0 ? rows[0].value : fallback;
    cache.set(key, value);
    return value;
  } catch (err) {
    console.warn(`[config] failed to read "${key}" from DB:`, (err as Error).message);
    return fallback;
  }
}

/**
 * Root directory for locally uploaded product images.
 */
export async function getUploadRootDir(): Promise<string> {
  return getConfig('upload_root_dir', defaultUploadRoot());
}

/**
 * Clear the in-memory cache so the next read hits the database.
 */
export function refreshConfig(): void {
  cache.clear();
}
