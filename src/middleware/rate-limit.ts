import { Context, Next } from 'hono';

const ipMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 100; // Requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

export const rateLimit = () => {
  return async (c: Context, next: Next) => {
    // Cloudflare specific: get client IP from cf-connecting-ip header
    const ip = c.req.header('cf-connecting-ip') || 'unknown';
    const now = Date.now();

    let entry = ipMap.get(ip);
    
    if (!entry || now - entry.lastReset > WINDOW_MS) {
      entry = { count: 0, lastReset: now };
    }

    entry.count++;
    ipMap.set(ip, entry);

    if (entry.count > LIMIT) {
      return c.json({
        error: "Too many requests",
        code: "RATE_LIMIT_EXCEEDED"
      }, 429);
    }

    await next();
  };
};
