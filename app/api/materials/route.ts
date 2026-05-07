import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { materialSchema } from '@/lib/validators';
import { MATERIALS_PER_PAGE } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const featuredOnly = searchParams.get('featured') === '1';
    const type = searchParams.get('type');
    const audience = searchParams.get('audience');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'new';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    if (featuredOnly) {
      const material = await prisma.material.findFirst({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({
        materials: material ? [material] : [],
        total: material ? 1 : 0,
        pages: 1,
        page: 1,
      });
    }

    const VALID_TYPES = ['METHODICAL', 'BOOKLET', 'PRESENTATION', 'VIDEO'];
    const VALID_AUDIENCES = ['SCHOOL', 'STUDENT', 'TEACHER'];

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Некорректный тип' }, { status: 400 });
    }
    if (audience && !VALID_AUDIENCES.includes(audience)) {
      return NextResponse.json({ error: 'Некорректная аудитория' }, { status: 400 });
    }

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (audience) where.audience = audience;
    if (year) where.year = parseInt(year);
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const orderBy: Prisma.MaterialOrderByWithRelationInput =
      sort === 'popular'
        ? { downloads: 'desc' }
        : sort === 'alpha'
          ? { title: 'asc' }
          : { createdAt: 'desc' };

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        orderBy,
        skip: (page - 1) * MATERIALS_PER_PAGE,
        take: MATERIALS_PER_PAGE,
      }),
      prisma.material.count({ where }),
    ]);

    return NextResponse.json(
      { materials, total, pages: Math.ceil(total / MATERIALS_PER_PAGE), page },
      {
        headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' },
      }
    );
  } catch (error) {
    console.error('Get materials error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки материалов' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const result = materialSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const material = await prisma.material.create({ data: result.data });

    return NextResponse.json({ material }, { status: 201 });
  } catch (error) {
    console.error('Create material error:', error);
    return NextResponse.json({ error: 'Ошибка создания материала' }, { status: 500 });
  }
}
