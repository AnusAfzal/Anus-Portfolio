import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey !== "your-supabase-anon-key-here" &&
    !supabaseUrl.includes("placeholder")
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info(
    "[Supabase] Environment variables VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing or set to placeholders. The portfolio is operating in resilient fallback mode (using static portfolio data and mailto fallback)."
  );
}

// Fallback to valid placeholder URL if not yet configured, preventing createClient crash
const safeUrl = isSupabaseConfigured
  ? supabaseUrl
  : "https://placeholder-project.supabase.co";
const safeAnonKey = isSupabaseConfigured
  ? supabaseAnonKey
  : "placeholder-anon-key-valid-token";

export const supabase = createClient(safeUrl, safeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Returns the full URL to invoke a Supabase Edge Function
 * @param {string} functionName
 * @returns {string}
 */
export function getEdgeFunctionUrl(functionName) {
  if (import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL && functionName === "submit-contact") {
    return import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL;
  }
  const base = isSupabaseConfigured ? supabaseUrl : "https://placeholder-project.supabase.co";
  return `${base.replace(/\/$/, "")}/functions/v1/${functionName}`;
}
