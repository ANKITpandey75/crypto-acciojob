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
          // Public market-data APIs can briefly rate-limit one coin while the
          // other coin's request succeeds. Give transient failures a few
          // chances before returning a partial comparison chart.
          if (!retryable || attempt >= 3) throw error;

          const retryAfterHeader = error.response?.headers?.['retry-after'];
          const retryAfterSeconds = Number(retryAfterHeader);
          const retryAfterDate = Date.parse(retryAfterHeader);
          const retryAfterMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
            ? retryAfterSeconds * 1000
            : (Number.isFinite(retryAfterDate) ? Math.max(0, retryAfterDate - Date.now()) : 0);
          const backoffMs = [1_000, 2_500, 5_000][attempt];
          const waitMs = status === 429 && retryAfterMs > 0
            ? retryAfterMs
            : backoffMs;
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
