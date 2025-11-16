import config from "../config.js";
import Redis from "ioredis";

let redis = null;
if (config.REDIS_URL) redis = new Redis(config.REDIS_URL);

globalThis.MEMORY_CACHE_KEYS = globalThis.MEMORY_CACHE_KEYS || new Set();
const memoryKeys = globalThis.MEMORY_CACHE_KEYS;

export function trackMemoryKey(key) {
  memoryKeys.add(key);
}

export async function getRedisKeys(pattern = "token:*") {
  if (redis) {
    return await redis.keys(pattern);
  } else {
    return [...memoryKeys].filter((k) => k.startsWith("token:"));
  }
}
