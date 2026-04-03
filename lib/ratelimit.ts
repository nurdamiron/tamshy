import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Graceful: if Upstash not configured, skip rate limiting
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function createLimiter(requests: number, window: `${number} s` | `${number} m` | `${number} h` | `${number} d`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
  });
}

// Preset limiters
export const otpLimiter = createLimiter(5, '60 s');
export const formLimiter = createLimiter(10, '60 s');
export const uploadLimiter = createLimiter(3, '60 s');

export async function checkRateLimit(
  req: NextRequest,
  limiter: Ratelimit | null
): Promise<NextResponse | null> {
  if (!limiter) return null; // skip if not configured

  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';

  try {
    const { success, remaining, reset } = await limiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(reset),
          },
        }
      );
    }
  } catch {
    // If Redis fails, allow the request through
  }

  return null;
}
