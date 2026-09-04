import path from 'path';
import { getDb } from './supabase';

/**
 * Simple key-value config backed by the `config` table.
 * Values are cached in memory; call refreshConfig() to reload.
 */
const cache = new Map<string, string>();

function defaultUploadRoot(): string {
  // Project root is COZE_WORKSPACE_PATH (fallback to cwd). Files are stored
  // in a sibling `product` directory, i.e. /workspace/product.
  const workspace = process.env.COZE_WORKSPACE_PATH || process.cwd();
  return path.resolve(workspace, '..', 'product');
}

/**
 * Read a config value by key. Falls back to `fallback` if not found or on error.
 */
export async function getConfig(key: string, fallback = ''): Promise<string> {
  if (cache.has(key)) return cache.get(key) as string;
  try {
    const { data, error } = await getDb()
      .from('config')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error) {
      console.warn(`[config] failed to read "${key}":`, error.message);
      return fallback;
    }
    const value = data?.value ?? fallback;
    cache.set(key, value);
    return value;
  } catch (err) {
    console.warn(`[config] exception reading "${key}":`, err);
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
export function clearConfigCache(): void {
  cache.clear();
}

/**
 * Reload config from the database.
 */
export async function refreshConfig(): Promise<void> {
  cache.clear();
  await getUploadRootDir();
}
