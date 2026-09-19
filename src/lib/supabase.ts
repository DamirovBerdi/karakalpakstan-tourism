import { createClient } from '@supabase/supabase-js';

const ACTIVE_SUPABASE_URL = 'https://ythdfltgdvfjllgyutnz.supabase.co';
const ACTIVE_SUPABASE_ANON_KEY = 'sb_publishable_1cvvhxJMGg3E-vtqjeW04w_J1NIsNOg';

let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
let supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

// Fallback protection: if env is missing or points to decommissioned project (rjstejbrmnjtvgsrinif)
if (!supabaseUrl || supabaseUrl.includes('rjstejbrmnjtvgsrinif')) {
  supabaseUrl = ACTIVE_SUPABASE_URL;
}

if (!supabaseAnonKey || (supabaseUrl === ACTIVE_SUPABASE_URL && !supabaseAnonKey.startsWith('sb_publishable_'))) {
  supabaseAnonKey = ACTIVE_SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
