type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const store: RateLimitStore = new Map();

const RATE_LIMITS = {
    LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
    REGISTER: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
} as const;

export async function checkRateLimit(
    identifier: string,
    type: keyof typeof RATE_LIMITS
): Promise<{ success: boolean; remaining: number }> {
    const config = RATE_LIMITS[type];
    const now = Date.now();
    const key = `${type}:${identifier}`;

    const record = store.get(key);

    if (!record || now > record.resetTime) {
        store.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return { success: true, remaining: config.maxAttempts - 1 };
    }

    if (record.count >= config.maxAttempts) {
        return { success: false, remaining: 0 };
    }

    record.count++;
    return { success: true, remaining: config.maxAttempts - record.count };
}

export function clearRateLimit(identifier: string, type: keyof typeof RATE_LIMITS): void {
    const key = `${type}:${identifier}`;
    store.delete(key);
}

setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
        if (now > record.resetTime) {
            store.delete(key);
        }
    }
}, 60 * 1000);
