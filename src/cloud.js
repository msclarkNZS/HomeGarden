import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabaseConfig.js";

// Only treat cloud as configured if the placeholders have been replaced.
export const cloudConfigured =
  !!SUPABASE_URL && !SUPABASE_URL.includes("YOUR-PROJECT") &&
  !!SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("YOUR-ANON");

export const supabase = cloudConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

const TABLE = "gardens";

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { ...data, error };
}
export async function signOut() { return supabase.auth.signOut(); }

export function onAuth(cb) {
  // fire current session, then subscribe to changes
  supabase.auth.getSession().then(({ data }) => cb(data.session));
  const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => cb(session));
  return () => sub.subscription.unsubscribe();
}

// returns { data, updatedAt } | null
export async function pull() {
  const { data: u } = await supabase.auth.getUser();
  const uid = u?.user?.id; if (!uid) return null;
  const { data, error } = await supabase.from(TABLE).select("data").eq("user_id", uid).maybeSingle();
  if (error) throw error;
  if (!data || !data.data) return null;
  return { data: data.data, updatedAt: data.data.updatedAt || 0 };
}

export async function push(payload) {
  const { data: u } = await supabase.auth.getUser();
  const uid = u?.user?.id; if (!uid) return;
  const { error } = await supabase.from(TABLE).upsert(
    { user_id: uid, data: payload, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}
