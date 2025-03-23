import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheAppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  callingMaps: Map<string, Promise<unknown>> = new Map();

  async getOrSet<T>(key: string, getData: () => Promise<T>, ttl: number) {
    let value: T = (await this.cacheManager.get(key)) as T;
    if (value === null) {
      if (this.callingMaps.has(key)) {
        return this.callingMaps.get(key) as Promise<T>;
      }

      try {
        const promise = getData();
        this.callingMaps.set(key, promise);
        value = await promise;
      } finally {
        this.callingMaps.delete(key);
      }
    }
    if (ttl > 0) {
      await this.cacheManager.set(key, value, ttl * 10 * 10 * 10);
    } else {
      await this.cacheManager.set(key, value);
    }
    return value;
  }
}
