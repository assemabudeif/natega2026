interface RateLimitEntry {
  tokens: number;
  lastReset: number;
}

const tracker = new Map<string, RateLimitEntry>();

/**
 * In-memory token bucket / sliding window rate limiter.
 * @param ip - Client identifier (IP or headers)
 * @param limit - Maximum allowed requests per window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(ip: string, limit: number = 60, windowMs: number = 60000): { success: boolean; limit: number; remaining: number } {
  const now = Date.now();
  const entry = tracker.get(ip);

  if (!entry || now - entry.lastReset > windowMs) {
    tracker.set(ip, { tokens: limit - 1, lastReset: now });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    return { success: true, limit, remaining: entry.tokens };
  }

  return { success: false, limit, remaining: 0 };
}
