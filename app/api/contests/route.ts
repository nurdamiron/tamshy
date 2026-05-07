import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { contestSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const VALID_STATUSES = ['ACTIVE', 'COMPLETED'];
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Некорректный статус' }, { status: 400 });
    }

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const contests = await prisma.contest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        documents: true,
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json(
      { contests },
      {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      }
    );
  } catch (error) {
    console.error('Get contests error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки конкурсов' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const result = contestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { title, type, description, rules, deadline, imageUrl, documents } = result.data;

    const contest = await prisma.contest.create({
      data: {
        title,
        type,
        description,
        rules,
        deadline: new Date(deadline),
        imageUrl,
        documents: {
          create: documents ?? [],
        },
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json({ contest }, { status: 201 });
  } catch (error) {
    console.error('Create contest error:', error);
    return NextResponse.json({ error: 'Ошибка создания конкурса' }, { status: 500 });
  }
}
