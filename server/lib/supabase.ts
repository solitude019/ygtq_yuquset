import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

let envLoaded = false;

function loadEnv(): void {
  if (envLoaded || (process.env.COZE_SUPABASE_URL && process.env.COZE_SUPABASE_ANON_KEY)) {
    envLoaded = true;
    return;
  }

  try {
    const pythonCode = `
import os, sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for ev in env_vars:
        print(f"{ev.key}={ev.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;
    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    for (const line of output.trim().split('\n')) {
      if (line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.substring(0, eqIdx);
        let value = line.substring(eqIdx + 1);
        if ((value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    envLoaded = true;
  } catch {
    // Silently fail
  }
}

// Server-side client (uses service_role_key to bypass RLS)
function createServerClient(): SupabaseClient {
  loadEnv();

  const url = process.env.COZE_SUPABASE_URL;
  if (!url) throw new Error('COZE_SUPABASE_URL is not set');

  // Prefer service_role_key for server-side operations
  const serviceKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.COZE_SUPABASE_ANON_KEY;
  const key = serviceKey ?? anonKey;
  if (!key) throw new Error('No Supabase key available');

  return createClient(url, key);
}

// Singleton client
let _client: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (!_client) {
    _client = createServerClient();
  }
  return _client;
}
