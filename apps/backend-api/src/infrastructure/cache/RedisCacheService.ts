import { redis } from '../../config/redis';
import type { ICacheService } from '../../domain/ports/services/ICacheService';

// ============================================================
// RedisCacheService
// Concrete adapter implementing ICacheService using ioredis
// ============================================================

export class RedisCacheService implements ICacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const data = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.set(key, data, 'EX', ttlSeconds);
      } else {
        await redis.set(key, data);
      }
    } catch {
      // Fail silently for cache writes to maintain primary flow stability
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch {}
  }

  async deleteByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {}
  }
}
