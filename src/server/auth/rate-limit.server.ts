const rateLimits = new Map<string, { count: number; expiresAt: number }>();
const MAX_RATE_LIMIT_ENTRIES = 10000;

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Bounded map protection: if map grows too large, run cleanup
  if (rateLimits.size > MAX_RATE_LIMIT_ENTRIES) {
    cleanupRateLimits();
  }

  const record = rateLimits.get(key);

  if (!record || record.expiresAt < now) {
    rateLimits.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export function resetRateLimitKey(key: string): void {
  rateLimits.delete(key);
}

// Clean up expired rate limits
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (record.expiresAt < now) {
      rateLimits.delete(key);
    }
  }
}
