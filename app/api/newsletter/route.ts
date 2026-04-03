import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Введите корректный email' },
        { status: 400 }
      );
    }

    await prisma.newsletterSub.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Ошибка подписки' }, { status: 500 });
  }
}
