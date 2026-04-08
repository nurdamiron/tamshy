import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const counts = await prisma.project.groupBy({
      by: ['region'],
      where: { status: 'APPROVED' },
      _count: { _all: true },
    });
    return NextResponse.json({ regions: counts });
  } catch (error) {
    console.error('Stats regions error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки статистики' }, { status: 500 });
  }
}
