const CACHE_PREFIX = 'crypto-tracker-cache:';
const memoryCache = new Map();
const pendingRequests = new Map();

const readCache = (key) => {
  const inMemory = memoryCache.get(key);
  if (inMemory) return inMemory;

  try {
    const saved = window.localStorage.getItem(CACHE_PREFIX + key);
    if (saved) {
      const entry = JSON.parse(saved);
      if (entry && Object.prototype.hasOwnProperty.call(entry, 'data')) {
        memoryCache.set(key, entry);
        return entry;
      }
    }
  } catch (error) {
    // Storage can be unavailable in private browsing; in-memory caching still works.
  }
  return null;
};

export const getCachedApiData = async (key, request, maxAgeMs, isValid = () => true) => {
  const storedEntry = readCache(key);
  const cached = storedEntry && isValid(storedEntry.data) ? storedEntry : null;
  if (cached && Date.now() - cached.savedAt < maxAgeMs) return cached.data;
  if (pendingRequests.has(key)) return pendingRequests.get(key);

  const pending = (async () => {
    try {
      let data;
      for (let attempt = 0; ; attempt += 1) {
        try {
          data = await request();
          if (!isValid(data)) throw new Error(`The API returned invalid or empty data for ${key}.`);
          break;
        } catch (error) {
          const status = error.response?.status;
          const retryable = !status || status === 429 || status >= 500;
          if (!retryable || attempt >= 1) throw error;

          const retryAfter = Number(error.response?.headers?.['retry-after']);
          const waitMs = status === 429 && Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.min(retryAfter * 1000, 10_000)
            : 1_000;
          await new Promise((resolve) => window.setTimeout(resolve, waitMs));
        }
      }
      const entry = { savedAt: Date.now(), data };
      memoryCache.set(key, entry);
      try {
        window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch (error) {
        // The API response remains available from memory when storage is full or blocked.
      }
      return data;
    } catch (error) {
      console.error(`API request failed (${key}):`, error);
      if (cached) return cached.data;
      throw error;
    } finally {
      pendingRequests.delete(key);
    }
  })();

  pendingRequests.set(key, pending);
  return pending;
};
