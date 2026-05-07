import { NextRequest, NextResponse } from 'next/server';
import { emailAuthSchema, otpSchema } from '@/lib/validators';
import { verifyOTP } from '@/lib/email';
import { createToken, setAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, otpLimiter } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const blocked = await checkRateLimit(req, otpLimiter);
    if (blocked) return blocked;

    const body = await req.json();

    const emailResult = emailAuthSchema.safeParse(body.email);
    const otpResult = otpSchema.safeParse(body.code);
    const consentPd = body.consentPd === true;
    const consentEmail = body.consentEmail === true;
    // body.isTeacher (опциональный флаг от submit-формы) сейчас не используется —
    // проверка role/teacher делается ниже по другим полям. Оставлено в API на будущее.


    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.error.issues[0].message }, { status: 400 });
    }
    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.error.issues[0].message }, { status: 400 });
    }

    const valid = await verifyOTP(emailResult.data, otpResult.data);
    if (!valid) {
      return NextResponse.json({ error: 'Неверный или просроченный код' }, { status: 401 });
    }

    const now = new Date();

    const user = await prisma.user.upsert({
      where: { email: emailResult.data },
      update: {
        ...(consentPd && { consentPd: true, consentPdAt: now }),
        ...(consentEmail && { consentEmail: true, consentEmailAt: now }),
      },
      create: {
        email: emailResult.data,
        // Все новые аккаунты — учителя. JURY и ADMIN назначает администратор.
        role: 'TEACHER',
        consentPd,
        consentPdAt: consentPd ? now : null,
        consentEmail,
        consentEmailAt: consentEmail ? now : null,
      },
    });

    const token = await createToken({
      userId: user.id,
      email: user.email!,
      role: user.role,
      tv: user.tokenVersion,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error({ err: String(error) }, 'Verify OTP error');
    return NextResponse.json({ error: 'Ошибка верификации' }, { status: 500 });
  }
}
