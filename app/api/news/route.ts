import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { newsSchema } from '@/lib/validators';
import { NEWS_PER_PAGE } from '@/lib/constants';

/** UI tabs → Prisma NewsCategory */
const TAB_TO_CATEGORY: Record<string, 'NEWS' | 'REPORT' | 'PHOTO' | 'VIDEO'> = {
  news: 'NEWS',
  reports: 'REPORT',
  photos: 'PHOTO',
  videos: 'VIDEO',
};

const VALID_CATEGORIES = ['NEWS', 'REPORT', 'PHOTO', 'VIDEO'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const where: Record<string, unknown> = {};

    if (category) {
      const mapped = TAB_TO_CATEGORY[category] ?? (VALID_CATEGORIES.includes(category) ? category : null);
      if (!mapped) {
        return NextResponse.json({ error: 'Некорректная категория' }, { status: 400 });
      }
      where.category = mapped;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * NEWS_PER_PAGE,
        take: NEWS_PER_PAGE,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json(
      { news, total, pages: Math.ceil(total / NEWS_PER_PAGE), page },
      {
        headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' },
      }
    );
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки новостей' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const result = newsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const newsItem = await prisma.news.create({ data: result.data });

    return NextResponse.json({ news: newsItem }, { status: 201 });
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json({ error: 'Ошибка создания новости' }, { status: 500 });
  }
}
