/**
 * ApiCacheStore — in-memory cache với TTL cho API responses.
 * Tương đương ApiCacheStore trong Flutter.
 */

interface CacheItem {
  data: unknown;
  expiresAt?: number; // unix ms, undefined = no expiry
}

export class ApiCacheStore {
  private static _instance: ApiCacheStore;
  private _cache = new Map<string, CacheItem>();

  private constructor() {}

  static get instance(): ApiCacheStore {
    if (!ApiCacheStore._instance) {
      ApiCacheStore._instance = new ApiCacheStore();
    }
    return ApiCacheStore._instance;
  }

  generateKey(
    method: string,
    path: string,
    params?: Record<string, unknown>,
    body?: unknown,
  ): string {
    const queryStr = params
      ? Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
      : '';
    const bodyStr = body ? JSON.stringify(body) : '';
    return `${method}:${path}?${queryStr}|${bodyStr}`;
  }

  set(key: string, data: unknown, ttl?: number): void {
    this._cache.set(key, {
      data,
      expiresAt: ttl ? Date.now() + ttl : undefined,
    });
  }

  get(key: string): unknown | undefined {
    const item = this._cache.get(key);
    if (!item) return undefined;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this._cache.delete(key); // auto-evict
      return undefined;
    }
    return item.data;
  }

  remove(key: string): void {
    this._cache.delete(key);
  }

  clear(): void {
    this._cache.clear();
  }

  /** Evict tất cả entries đã hết hạn */
  evictExpired(): void {
    const now = Date.now();
    this._cache.forEach((item, key) => {
      if (item.expiresAt && now > item.expiresAt) {
        this._cache.delete(key);
      }
    });
  }
}
