import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // DB-запрос — гарантируем что пользователь ещё существует в БД
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404 });
    }

    if (project.status !== 'APPROVED' && project.status !== 'WINNER') {
      return NextResponse.json({ error: 'Голосование недоступно' }, { status: 400 });
    }

    if (project.authorId === user.id) {
      return NextResponse.json({ error: 'Нельзя голосовать за свой проект' }, { status: 400 });
    }

    const existing = await prisma.vote.findUnique({
      where: {
        projectId_userId: { projectId: params.id, userId: user.id },
      },
    });

    if (existing) {
      const [, count] = await prisma.$transaction([
        prisma.vote.delete({ where: { id: existing.id } }),
        prisma.vote.count({ where: { projectId: params.id } }),
      ]);
      return NextResponse.json({ voted: false, count });
    }

    const [, count] = await prisma.$transaction([
      prisma.vote.create({ data: { projectId: params.id, userId: user.id } }),
      prisma.vote.count({ where: { projectId: params.id } }),
    ]);
    return NextResponse.json({ voted: true, count });
  } catch (error) {
    logger.error({ err: String(error), projectId: params.id }, 'Vote error');
    return NextResponse.json({ error: 'Ошибка голосования' }, { status: 500 });
  }
}
