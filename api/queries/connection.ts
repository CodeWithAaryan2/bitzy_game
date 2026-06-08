import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "../lib/env";

let instance: SupabaseClient | null = null;

function createDbClient(): SupabaseClient {
  const opts: any = {
    auth: { autoRefreshToken: false, persistSession: false },
  };

  // Node.js < 22 needs explicit WebSocket implementation
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require("ws");
    if (ws) {
      opts.realtime = { transport: ws };
    }
  } catch {
    // Browser or ws not available — native WebSocket will be used
  }

  return createClient(env.supabaseUrl, env.supabaseKey, opts);
}

export function getDb(): SupabaseClient {
  if (!instance) {
    instance = createDbClient();
  }
  return instance;
}

export function result<T>({ data, error }: { data: T | null; error: Error | null }): T {
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");
  return data;
}

export function resultMaybe<T>({ data, error }: { data: T | null; error: Error | null }): T | null {
  if (error) return null;
  return data;
}
