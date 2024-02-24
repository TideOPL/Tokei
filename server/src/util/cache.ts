import { redis } from '../app';

// Default expiration time for cached data (2 hours)
const DEFAULT_EXPIRATION = 7200; // en seconds

// Function to get or set cache
export function getOrSetCache(key: string, cb: () => any) {
  return new Promise(async (resolve, reject) => {
    // Try to get data from Redis using the provided key
    const data = await redis.get(key)
      .catch(error => {
        console.warn(error);
        return reject(error);
      });

    // If data exists in cache, parse and return it
    if (data) return resolve(JSON.parse(data));

    // If data doesn't exist in cache, invoke the callback function (cb) to fetch fresh data
    const freshData = await cb();

    // Store the fresh data in Redis cache with the specified key and expiration time
    redis.set(key, JSON.stringify(freshData), 'EX', DEFAULT_EXPIRATION);

    // Resolve the promise with the fresh data
    resolve(freshData);
  });
}

// Function to clear the entire cache
export async function clearCache() {
  console.warn('cache cleared');
  // Flush all keys from the Redis cache
  await redis.flushall();
}

export const deleteCachedValue = async (keys: string[]) => {
  try {
    keys.map(async (key) => (redis.del(key)));
  } catch (err) {
    console.warn(err);
  }  
};