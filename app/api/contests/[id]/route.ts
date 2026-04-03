import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: params.id },
      include: {
        documents: true,
        _count: { select: { submissions: true } },
      },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Конкурс не найден' }, { status: 404 });
    }

    return NextResponse.json({ contest });
  } catch (error) {
    console.error('Get contest error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const { title, type, description, rules, status, deadline } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (type !== undefined) data.type = type;
    if (description !== undefined) data.description = description;
    if (rules !== undefined) data.rules = rules;
    if (status !== undefined) data.status = status;
    if (deadline !== undefined) data.deadline = new Date(deadline);

    const contest = await prisma.contest.update({
      where: { id: params.id },
      data,
      include: {
        documents: true,
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json({ contest });
  } catch (error) {
    console.error('Update contest error:', error);
    return NextResponse.json({ error: 'Ошибка обновления конкурса' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    await prisma.contest.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete contest error:', error);
    return NextResponse.json({ error: 'Ошибка удаления конкурса' }, { status: 500 });
  }
}
