import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';

const SUBMISSIONS_PER_PAGE = 20;

export async function GET(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const contestId = searchParams.get('contestId');
    const status = searchParams.get('status');

    const VALID_STATUSES = ['NEW', 'REVIEWING', 'ACCEPTED', 'REJECTED'];
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Некорректный статус' }, { status: 400 });
    }

    const where: Record<string, unknown> = {};
    if (contestId) where.contestId = contestId;
    if (status) where.status = status;

    const [submissions, total] = await Promise.all([
      prisma.contestSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * SUBMISSIONS_PER_PAGE,
        take: SUBMISSIONS_PER_PAGE,
        include: {
          contest: { select: { title: true } },
        },
      }),
      prisma.contestSubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      total,
      pages: Math.ceil(total / SUBMISSIONS_PER_PAGE),
      page,
    });
  } catch (error) {
    console.error('Admin submissions error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки заявок' }, { status: 500 });
  }
}
