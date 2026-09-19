import { createClient } from '@supabase/supabase-js';

const ACTIVE_SUPABASE_URL = 'https://ythdfltgdvfjllgyutnz.supabase.co';
const ACTIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aGRmbHRnZHZmamxsZ3l1dG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2Mjk1OTMsImV4cCI6MjEwNTIwNTU5M30.6iww9peFVE91jeI5wegtOAoAlhAwH2hPeEk-HfSrOdk';

let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
let supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

// Fallback protection: if env is missing or points to decommissioned project (rjstejbrmnjtvgsrinif)
if (!supabaseUrl || supabaseUrl.includes('rjstejbrmnjtvgsrinif')) {
  supabaseUrl = ACTIVE_SUPABASE_URL;
}

if (!supabaseAnonKey || (supabaseUrl === ACTIVE_SUPABASE_URL && !supabaseAnonKey.startsWith('eyJ'))) {
  supabaseAnonKey = ACTIVE_SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
