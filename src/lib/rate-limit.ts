import { kv } from "@vercel/kv";

const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute

export async function checkRateLimit(ip: string): Promise<{ success: boolean; reset: number; remaining: number }> {
    // Support both Vercel KV and standard Upstash env vars
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.warn("KV/Upstash Access not configured, rate limiting disabled (fallback to basic)");
        return { success: true, reset: 0, remaining: 100 };
    }

    const key = `rate_limit:${ip}`;

    try {
        const requests = await kv.incr(key);

        if (requests === 1) {
            await kv.expire(key, RATE_LIMIT_WINDOW);
        }

        const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - requests);
        const ttl = await kv.ttl(key);

        return {
            success: requests <= RATE_LIMIT_MAX_REQUESTS,
            remaining,
            reset: Date.now() + (ttl * 1000)
        };
    } catch (error) {
        console.error("Rate limit error:", error);
        // Fail open if KV is down, but log it
        return { success: true, reset: 0, remaining: 1 };
    }
}
