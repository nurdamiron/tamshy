import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailAuthSchema } from '@/lib/validators';
import { sendOTP } from '@/lib/email';
import { checkRateLimit, otpLimiter } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';

const OTP_EXPIRY_MINUTES = 10;
const OTP_COOLDOWN_SECONDS = 30;

export async function POST(req: NextRequest) {
  try {
    const blocked = await checkRateLimit(req, otpLimiter);
    if (blocked) return blocked;

    const body = await req.json();
    const result = emailAuthSchema.safeParse(body.email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const email = result.data;

    // Cooldown: не позволяем запрашивать OTP чаще раза в 30 с на один email
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { otpExpiry: true },
    });

    if (existing?.otpExpiry) {
      const otpCreatedAt = new Date(existing.otpExpiry.getTime() - OTP_EXPIRY_MINUTES * 60 * 1000);
      const secondsSinceCreated = (Date.now() - otpCreatedAt.getTime()) / 1000;
      if (secondsSinceCreated < OTP_COOLDOWN_SECONDS) {
        const remaining = Math.ceil(OTP_COOLDOWN_SECONDS - secondsSinceCreated);
        return NextResponse.json(
          { error: `Повторный запрос доступен через ${remaining} с` },
          { status: 429 }
        );
      }
    }

    await sendOTP(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ err: String(error) }, 'Send OTP error');
    return NextResponse.json(
      { error: 'Не удалось отправить письмо' },
      { status: 500 }
    );
  }
}
