import redis from "../config/redis.config.js";

/**
 * Redis Cache Helper Utilities
 */

/**
 * Get cached data or execute callback and cache result
 */
export async function getOrSetCache(key, callback, ttlSeconds = 300) {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`🔵 Redis: Cache HIT for ${key}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error(`Redis GET error: ${err.message}`);
  }

  const data = await callback();
  await setCache(key, data, ttlSeconds);
  console.log(`🟢 Redis: Cache SET for ${key}`);
  return data;
}

/**
 * Set a value in cache with optional TTL
 */
export async function setCache(key, value, ttlSeconds = 300) {
  try {
     await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.error(`Redis SET error: ${err.message}`);
  }
}
//SET + EXPIRE =It stores a value and sets an expiration time in one command.


/**
 * Get value from cache
 */
export async function getCache(key) {
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error(`Redis GET error: ${err.message}`);
    return null;
  }
}

/**
 * Delete a specific key
 */
export async function deleteCache(key) {
  try {
    await redis.del(key);
      
  } catch (err) {
    console.error(`Redis DEL error: ${err.message}`);
  }
}

/**
 * Delete keys matching a pattern
 */
export async function deleteCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️  Redis: Deleted ${keys.length} keys matching "${pattern}"`);
    }
  } catch (err) {
    console.error(`Redis DEL pattern error: ${err.message}`);
  }
}

/**
 * Session Management
 */
export async function setSession(userId, sessionData, ttlSeconds = 86400) {
  try {
    await redis.setex(`session:${userId}`, ttlSeconds, JSON.stringify(sessionData));
  } catch (err) {
    console.error(`Redis session SET error: ${err.message}`);
  }
}

export async function getSession(userId) {
  try {
    const session = await redis.get(`session:${userId}`);
    return session ? JSON.parse(session) : null;
  } catch (err) {
    console.error(`Redis session GET error: ${err.message}`);
    return null;
  }
}

export async function deleteSession(userId) {
  try {
    await redis.del(`session:${userId}`);
  } catch (err) {
    console.error(`Redis session DEL error: ${err.message}`);
  }
}

/**
 * Distributed Lock for appointment slot booking
 */
export async function acquireLock(key, ttlSeconds = 10) {
  try {
    const result = await redis.set(key, "1", "EX", ttlSeconds, "NX");
    return result === "OK";
  } catch (err) {
    console.error(`Redis lock error: ${err.message}`);
    return false;
  }
}//"EX" =Set an expiration time in seconds.
// "NX"= Only set if the key does NOT already exist.

export async function releaseLock(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Redis unlock error: ${err.message}`);
  }
}

export default redis;