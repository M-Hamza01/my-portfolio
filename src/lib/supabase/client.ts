import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Safe to import in client components.
 * Reads the two public env vars — see .env.example.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
