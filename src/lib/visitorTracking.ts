const SESSION_KEY = 'kk_session_token';
const TRACKED_KEY = 'kk_tracked_pages';

function generateToken(): string {
  return 'sess-' + crypto.randomUUID() + '-' + Date.now().toString(36);
}

export function getSessionToken(): string {
  let token = localStorage.getItem(SESSION_KEY);
  if (!token) {
    token = generateToken();
    localStorage.setItem(SESSION_KEY, token);
  }
  return token;
}

interface TrackPageOptions {
  pagePath?: string;
  pageTitle?: string;
  serviceUsed?: string;
}

/**
 * Tracks a page view by calling the track-visitor edge function.
 * Captures the visitor's real IP address server-side.
 * Deduplicates: only tracks each unique (path) once per page load.
 */
export async function trackPageView(opts: TrackPageOptions = {}): Promise<void> {
  try {
    const sessionToken = getSessionToken();
    const pagePath = opts.pagePath ?? window.location.hash ?? '/';
    const pageTitle = opts.pageTitle ?? document.title ?? '';
    const serviceUsed = opts.serviceUsed ?? '';

    // Deduplicate within same page load
    const tracked = JSON.parse(sessionStorage.getItem(TRACKED_KEY) ?? '[]') as string[];
    const dedupeKey = `${pagePath}`;
    if (tracked.includes(dedupeKey)) return;
    tracked.push(dedupeKey);
    sessionStorage.setItem(TRACKED_KEY, JSON.stringify(tracked));

    const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
    const supabaseUrl = (!rawUrl || rawUrl.includes('rjstejbrmnjtvgsrinif'))
      ? 'https://ythdfltgdvfjllgyutnz.supabase.co'
      : rawUrl;
    const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aGRmbHRnZHZmamxsZ3l1dG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2Mjk1OTMsImV4cCI6MjEwNTIwNTU5M30.6iww9peFVE91jeI5wegtOAoAlhAwH2hPeEk-HfSrOdk';

    const apiUrl = `${supabaseUrl}/functions/v1/track-visitor`;
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ sessionToken, pagePath, pageTitle, serviceUsed }),
    });
  } catch {
    // Silently fail — tracking must not break the user experience
  }
}

/**
 * Tracks a specific service usage (e.g. when user opens the taxi or hotel booking form).
 * Always fires, even if the page was already tracked.
 */
export async function trackServiceUsage(service: string, detail?: string): Promise<void> {
  try {
    const sessionToken = getSessionToken();
    const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
    const supabaseUrl = (!rawUrl || rawUrl.includes('rjstejbrmnjtvgsrinif'))
      ? 'https://ythdfltgdvfjllgyutnz.supabase.co'
      : rawUrl;
    const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aGRmbHRnZHZmamxsZ3l1dG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2Mjk1OTMsImV4cCI6MjEwNTIwNTU5M30.6iww9peFVE91jeI5wegtOAoAlhAwH2hPeEk-HfSrOdk';

    const apiUrl = `${supabaseUrl}/functions/v1/track-visitor`;
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        sessionToken,
        pagePath: window.location.hash || '/',
        pageTitle: detail ? `${service} — ${detail}` : service,
        serviceUsed: service,
      }),
    });
  } catch {
    // Silently fail
  }
}

/**
 * Initialize visitor tracking on app load.
 * Tracks the initial page view and sets up hash-change listener.
 */
export function initVisitorTracking(): void {
  // Track initial page view
  trackPageView({
    pagePath: window.location.hash || '/',
    pageTitle: document.title,
    serviceUsed: 'home',
  });

  // Track on hash/route changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '/';
    const serviceMap: Record<string, string> = {
      '#taxi': 'taxi',
      '#hotels': 'hotel',
      '#heritage': 'heritage',
      '#aral': 'aral',
      '#plan': 'plan',
      '#muslim-travel': 'muslim',
      '#community': 'community',
      '#guides': 'guides',
      '#profile': 'profile',
    };
    trackPageView({
      pagePath: hash,
      pageTitle: document.title,
      serviceUsed: serviceMap[hash] ?? 'page',
    });
  });
}
