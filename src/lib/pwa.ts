/**
 * PWA utilities — service worker registration, IndexedDB API cache,
 * and online/offline detection helpers shared across the app.
 */

const IDB_NAME = 'kk-api-cache';
const IDB_STORE = 'responses';
const IDB_VERSION = 1;

type CacheEntry = {
  url: string;
  body: string;
  status: number;
  headers: { 'content-type': string };
  timestamp: number;
};

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'url' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedJSON<T>(url: string): Promise<T | null> {
  try {
    const db = await openIDB();
    return await new Promise<T | null>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(url);
      req.onsuccess = () => {
        const entry = req.result as CacheEntry | undefined;
        if (entry?.body) {
          try { resolve(JSON.parse(entry.body) as T); } catch { resolve(null); }
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function putCachedJSON(url: string, data: unknown): Promise<void> {
  try {
    const db = await openIDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({
        url,
        body: JSON.stringify(data),
        status: 200,
        headers: { 'content-type': 'application/json' },
        timestamp: Date.now(),
      } as CacheEntry);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* ignore — caching is best-effort */
  }
}

/**
 * Cache-First fetch: try IndexedDB cache first, then network.
 * If network succeeds, store the fresh response in IndexedDB.
 * Falls back to stale cache when offline.
 */
export async function cacheFirstFetch<T>(url: string): Promise<T | null> {
  const cached = await getCachedJSON<T>(url);
  if (cached && !navigator.onLine) return cached;

  if (navigator.onLine) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as T;
        await putCachedJSON(url, data);
        return data;
      }
    } catch {
      /* fall through to cache */
    }
  }
  return cached;
}

let updateAvailable = false;

export function isUpdateAvailable() {
  return updateAvailable;
}

export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  // In development mode on localhost, unregister any active service worker to prevent Vite HMR / chunk conflicts
  if (
    import.meta.env.DEV ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    } catch {
      // ignore
    }
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          updateAvailable = true;
          window.dispatchEvent(new CustomEvent('sw-update-available'));
        }
      });
    });

    if (!navigator.serviceWorker.controller && reg.active) {
      window.dispatchEvent(new CustomEvent('sw-first-install'));
    }
  } catch {
    /* SW registration failed — app still works as normal website */
  }
}

export function applyServiceWorkerUpdate(): void {
  navigator.serviceWorker?.controller?.postMessage({ type: 'SKIP_WAITING' });
  window.location.reload();
}

export function isOnline(): boolean {
  return navigator.onLine;
}
