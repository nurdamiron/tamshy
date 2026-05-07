import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        role: true,
        createdAt: true,
        projects: {
          where: { status: { in: ['APPROVED', 'WINNER'] } },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            region: true,
            schoolName: true,
            grade: true,
            studentName: true,
            createdAt: true,
            _count: { select: { votes: true } },
          },
        },
        _count: { select: { projects: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
