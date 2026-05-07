import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, formLimiter } from '@/lib/ratelimit';
import { newsletterSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const blocked = await checkRateLimit(req, formLimiter);
    if (blocked) return blocked;

    const body = await req.json();
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    await prisma.newsletterSub.upsert({
      where: { email: result.data.email },
      update: {},
      create: { email: result.data.email },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Ошибка подписки' }, { status: 500 });
  }
}
