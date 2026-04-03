import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

const PER_PAGE = 6;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type');
    const audience = searchParams.get('audience');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'new';
    const page = parseInt(searchParams.get('page') || '1');

    const where: Record<string, unknown> = {};

    if (type) where.type = type;
    if (audience) where.audience = audience;
    if (year) where.year = parseInt(year);
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any =
      sort === 'popular'
        ? { downloads: 'desc' }
        : sort === 'alpha'
          ? { title: 'asc' }
          : { createdAt: 'desc' };

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        orderBy,
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.material.count({ where }),
    ]);

    return NextResponse.json({
      materials,
      total,
      pages: Math.ceil(total / PER_PAGE),
      page,
    });
  } catch (error) {
    console.error('Get materials error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки материалов' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, format, fileUrl, fileSize, type, audience, year, featured } = body;

    if (!title || !description || !format || !fileUrl || !fileSize || !type || !audience || !year) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const material = await prisma.material.create({
      data: {
        title,
        description,
        format,
        fileUrl,
        fileSize,
        type,
        audience,
        year: parseInt(year),
        featured: featured || false,
      },
    });

    return NextResponse.json({ material }, { status: 201 });
  } catch (error) {
    console.error('Create material error:', error);
    return NextResponse.json({ error: 'Ошибка создания материала' }, { status: 500 });
  }
}
