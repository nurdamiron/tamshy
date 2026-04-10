import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/validators';
import { getTokenPayload, getAuthUser } from '@/lib/auth';
import { PROJECTS_PER_PAGE } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type');
    const region = searchParams.get('region');
    const sort = searchParams.get('sort') || 'new';
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};

    if (type && type !== 'all') where.type = type;
    if (region && region !== 'all') where.region = region;

    // PENDING и REJECTED видят только JURY и ADMIN
    const PRIVILEGED_STATUSES = ['PENDING', 'REJECTED'];
    if (status && PRIVILEGED_STATUSES.includes(status)) {
      const payload = await getTokenPayload();
      if (!payload || !['JURY', 'ADMIN'].includes(payload.role)) {
        return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
      }
      where.status = status;
    } else if (status) {
      where.status = status;
    } else {
      where.status = { in: ['APPROVED', 'WINNER'] };
    }
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      sort === 'popular'
        ? { votes: { _count: 'desc' } }
        : sort === 'winner'
          ? { juryScore: 'desc' }
          : { createdAt: 'desc' };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip: (page - 1) * PROJECTS_PER_PAGE,
        take: PROJECTS_PER_PAGE,
        include: {
          author: { select: { id: true, name: true } },
          _count: { select: { votes: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json(
      { projects, total, pages: Math.ceil(total / PROJECTS_PER_PAGE), page },
      {
        headers: {
          // Публичный кеш: 60 с свежие, 5 мин stale пока обновляется
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки проектов' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // getAuthUser делает DB-запрос — гарантируем что пользователь ещё существует в БД
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await req.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        ...result.data,
        authorId: user.id,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Ошибка создания проекта' }, { status: 500 });
  }
}
