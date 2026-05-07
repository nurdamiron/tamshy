import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { newsUpdateSchema } from '@/lib/validators';
import { checkRateLimit, formLimiter } from '@/lib/ratelimit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsItem = await prisma.news.findUnique({ where: { id: params.id } });
    if (!newsItem) {
      return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 });
    }

    // Rate limit на инкремент просмотров — защита от накрутки ботами
    const blocked = await checkRateLimit(req, formLimiter);
    if (!blocked) {
      await prisma.news.update({
        where: { id: params.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ news: newsItem });
  } catch (error) {
    console.error('Get news error:', error);
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
    const result = newsUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const newsItem = await prisma.news.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ news: newsItem });
  } catch (error) {
    console.error('Update news error:', error);
    return NextResponse.json({ error: 'Ошибка обновления новости' }, { status: 500 });
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

    await prisma.news.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete news error:', error);
    return NextResponse.json({ error: 'Ошибка удаления новости' }, { status: 500 });
  }
}
