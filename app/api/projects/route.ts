import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  projectSchema,
  waterBasinValues,
  waterProblemValues,
  sourceSystemValues,
} from '@/lib/validators';
import { getTokenPayload, getAuthUser } from '@/lib/auth';
import { PROJECTS_PER_PAGE } from '@/lib/constants';
import { createProject } from '@/lib/services/project';
import { ServiceError, HTTP_STATUS } from '@/lib/services/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type');
    const region = searchParams.get('region');
    const sort = searchParams.get('sort') || 'new';
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const basin = searchParams.get('basin');
    const problem = searchParams.get('problem');
    const waterObject = searchParams.get('water_object');
    const source = searchParams.get('source');

    const where: Record<string, unknown> = {};

    if (type && type !== 'all') where.type = type;
    if (region && region !== 'all') where.region = region;

    // Qazsu-фильтры (валидируем по enum-спискам, чтобы не пропустить мусор в Prisma)
    if (basin && (waterBasinValues as readonly string[]).includes(basin)) {
      where.basin = basin;
    }
    if (problem && (waterProblemValues as readonly string[]).includes(problem)) {
      where.problemType = problem;
    }
    if (waterObject) where.waterObjectId = waterObject;
    if (source && (sourceSystemValues as readonly string[]).includes(source)) {
      where.sourceSystem = source;
    }

    const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'WINNER'];
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Некорректный статус' }, { status: 400 });
    }

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

    if (search) where.title = { contains: search, mode: 'insensitive' };

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
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    );
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки проектов' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await req.json();
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { students, ...rest } = result.data;
    const lead = students[0];
    const extra = students.slice(1);

    // sourceSystem можно прокинуть из клиента; если не пришёл — определяем по qazsuRefUrl.
    const inferredSource =
      rest.sourceSystem ?? (rest.qazsuRefUrl ? 'QAZSU' : 'DIRECT');

    const project = await createProject(user.id, {
      ...rest,
      sourceSystem: inferredSource,
      studentName: lead.name,
      grade: lead.grade,
      teamMembers: extra.length > 0 ? extra : undefined,
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: HTTP_STATUS[error.code] });
    }
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Ошибка создания проекта' }, { status: 500 });
  }
}
