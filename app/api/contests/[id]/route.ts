import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { contestUpdateSchema } from '@/lib/validators';

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
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const result = contestUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data: Record<string, unknown> = { ...result.data };
    if (result.data.deadline !== undefined) {
      data.deadline = new Date(result.data.deadline);
    }

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
    const payload = await getVerifiedPayload();
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
