import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

const PER_PAGE = 6;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');

    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      news,
      total,
      pages: Math.ceil(total / PER_PAGE),
      page,
    });
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки новостей' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, category, imageUrl, fileUrl, photoCount } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const newsItem = await prisma.news.create({
      data: {
        title,
        content,
        category,
        imageUrl,
        fileUrl,
        photoCount,
      },
    });

    return NextResponse.json({ news: newsItem }, { status: 201 });
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json({ error: 'Ошибка создания новости' }, { status: 500 });
  }
}
