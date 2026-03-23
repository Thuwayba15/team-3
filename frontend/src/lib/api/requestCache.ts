interface ICacheEntry<TValue> {
    expiresAt: number;
    value: TValue;
}

const responseCache = new Map<string, ICacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();
let cacheGeneration = 0;

/**
 * Reuses in-flight requests and short-lived responses to avoid duplicate page-load fetches.
 */
export async function getCachedResource<TValue>(
    key: string,
    loader: () => Promise<TValue>,
    ttlMs: number = 30000
): Promise<TValue> {
    const activeGeneration = cacheGeneration;
    const now = Date.now();
    const cachedEntry = responseCache.get(key);

    if (cachedEntry && cachedEntry.expiresAt > now) {
        return cachedEntry.value as TValue;
    }

    const inFlightRequest = inFlightRequests.get(key);
    if (inFlightRequest) {
        return inFlightRequest as Promise<TValue>;
    }

    const request = loader()
        .then((value) => {
            if (ttlMs > 0 && activeGeneration === cacheGeneration) {
                responseCache.set(key, {
                    expiresAt: Date.now() + ttlMs,
                    value,
                });
            }

            return value;
        })
        .finally(() => {
            inFlightRequests.delete(key);
        });

    inFlightRequests.set(key, request);
    return request;
}

/**
 * Clears cached values for a resource group after a mutation changes the source data.
 */
export function invalidateCachedResource(prefix: string): void {
    for (const key of responseCache.keys()) {
        if (key.startsWith(prefix)) {
            responseCache.delete(key);
        }
    }
}

/**
 * Clears all cached responses and prevents older in-flight requests from repopulating stale data.
 */
export function clearCachedResources(): void {
    cacheGeneration += 1;
    responseCache.clear();
    inFlightRequests.clear();
}
