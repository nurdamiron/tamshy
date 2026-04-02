import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getTokenPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    // Check project exists and is approved
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404 });
    }

    if (project.status !== 'APPROVED' && project.status !== 'WINNER') {
      return NextResponse.json({ error: 'Голосование недоступно' }, { status: 400 });
    }

    // Can't vote for own project
    if (project.authorId === payload.userId) {
      return NextResponse.json({ error: 'Нельзя голосовать за свой проект' }, { status: 400 });
    }

    // Check if already voted
    const existing = await prisma.vote.findUnique({
      where: {
        projectId_userId: {
          projectId: params.id,
          userId: payload.userId,
        },
      },
    });

    if (existing) {
      // Remove vote (toggle)
      await prisma.vote.delete({ where: { id: existing.id } });
      const count = await prisma.vote.count({ where: { projectId: params.id } });
      return NextResponse.json({ voted: false, count });
    }

    // Create vote
    await prisma.vote.create({
      data: {
        projectId: params.id,
        userId: payload.userId,
      },
    });

    const count = await prisma.vote.count({ where: { projectId: params.id } });
    return NextResponse.json({ voted: true, count });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Ошибка голосования' }, { status: 500 });
  }
}
