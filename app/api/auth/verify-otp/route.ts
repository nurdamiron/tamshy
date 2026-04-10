import { NextRequest, NextResponse } from 'next/server';
import { phoneSchema, otpSchema } from '@/lib/validators';
import { verifyOTP } from '@/lib/sms';
import { createToken, setAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, otpLimiter } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const blocked = await checkRateLimit(req, otpLimiter);
    if (blocked) return blocked;

    const body = await req.json();

    const phoneResult = phoneSchema.safeParse(body.phone);
    const otpResult = otpSchema.safeParse(body.code);
    const consentPd = body.consentPd === true;
    const consentSms = body.consentSms === true;

    if (!phoneResult.success) {
      return NextResponse.json({ error: phoneResult.error.issues[0].message }, { status: 400 });
    }
    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.error.issues[0].message }, { status: 400 });
    }

    const valid = await verifyOTP(phoneResult.data, otpResult.data);
    if (!valid) {
      return NextResponse.json({ error: 'Неверный или просроченный код' }, { status: 401 });
    }

    const now = new Date();

    // Upsert user: create if not exists, update consent timestamps on every verify
    const user = await prisma.user.upsert({
      where: { phone: phoneResult.data },
      update: {
        ...(consentPd && { consentPd: true, consentPdAt: now }),
        ...(consentSms && { consentSms: true, consentSmsAt: now }),
      },
      create: {
        phone: phoneResult.data,
        consentPd,
        consentPdAt: consentPd ? now : null,
        consentSms,
        consentSmsAt: consentSms ? now : null,
      },
    });

    const token = await createToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error({ err: String(error) }, 'Verify OTP error');
    return NextResponse.json({ error: 'Ошибка верификации' }, { status: 500 });
  }
}
