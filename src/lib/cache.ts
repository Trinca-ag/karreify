type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

class AppCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidateByPrefix(prefix: string): void {
    const keysToDelete: string[] = [];
    this.store.forEach((_val, key) => {
      if (key.startsWith(prefix)) keysToDelete.push(key);
    });
    keysToDelete.forEach((key) => this.store.delete(key));
  }

  clear(): void {
    this.store.clear();
  }
}

export const cache = new AppCache();

// ── Keys ──────────────────────────────────────────────
export const CK: Record<string, (...args: string[]) => string> = {
  userData: (uid: string) => `user:${uid}`,
  credits: (uid: string) => `credits:${uid}`,
  deviceTrust: (uid: string, did: string) => `dtrust:${uid}:${did}`,
  deviceList: (uid: string) => `dlist:${uid}`,
  resume: (hash: string) => `resume:${hash}`,
  savedItems: (uid: string) => `saved:${uid}`,
};

// ── TTLs (milliseconds) ──────────────────────────────
export const TTL: Record<string, number> = {
  userData: 5 * 60 * 1000,     // 5 min
  credits: 30 * 1000,          // 30 sec
  deviceTrust: 60 * 60 * 1000, // 1 hour
  deviceList: 2 * 60 * 1000,   // 2 min
  resume: 24 * 60 * 60 * 1000, // 24 hours
  savedItems: 5 * 60 * 1000,   // 5 min
};

// ── Invalidation helpers ─────────────────────────────
export function invalidateUser(uid: string): void {
  cache.invalidate(CK.userData(uid));
  cache.invalidate(CK.credits(uid));
}

export function invalidateDevices(uid: string): void {
  cache.invalidateByPrefix(`dtrust:${uid}:`);
  cache.invalidate(CK.deviceList(uid));
}

export function invalidateSavedItems(uid: string): void {
  cache.invalidate(CK.savedItems(uid));
}

export function invalidateAll(): void {
  cache.clear();
}
