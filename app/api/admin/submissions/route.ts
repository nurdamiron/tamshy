import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

export async function GET() {
  try {
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const submissions = await prisma.contestSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contest: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Admin submissions error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки заявок' }, { status: 500 });
  }
}
