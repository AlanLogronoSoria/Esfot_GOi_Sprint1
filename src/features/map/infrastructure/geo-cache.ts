import type { GeoBoundingBox } from '../domain/coordinates';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export class GeoCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data;
  }

  set<T>(key: string, data: T, ttlMs: number = 30_000): void {
    if (this.store.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      hits: 1,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  buildViewportKey(box: GeoBoundingBox, prefix: string): string {
    return `${prefix}:${box.southwest.latitude.toFixed(5)},${box.southwest.longitude.toFixed(5)}-${box.northeast.latitude.toFixed(5)},${box.northeast.longitude.toFixed(5)}`;
  }

  private evictLeastUsed(): void {
    let minHits = Infinity;
    let minKey: string | null = null;

    for (const [key, entry] of this.store) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        minKey = key;
      }
    }

    if (minKey) this.store.delete(minKey);
  }
}

export const geoCache = new GeoCache(50);
