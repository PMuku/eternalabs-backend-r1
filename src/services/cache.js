import Redis from "ioredis";
import LRU from "lru-cache";
import config from "../config.js";

let redis = null;
if (config.REDIS_URL) {
  redis = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 3,
  });

  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });
}

// In-memory fallback cache using LRU
const memoryCache = new LRU({
  max: 5000,
  ttl: config.CACHE_TTL_MS,
  allowStale: false,
});

export async function getCache(key) {
  if (redis) {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  return memoryCache.get(key) || null;
}

export async function setCache(key, value, ttl = config.CACHE_TTL_MS) {
  if (redis) {
    const ttl_s = Math.ceil(ttl / 1000);
    await redis.set(key, JSON.stringify(value), "EX", ttl_s);
  } else {
    memoryCache.set(key, value, { ttl });
  }
}
