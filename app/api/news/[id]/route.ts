import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsItem = await prisma.news.update({
      where: { id: params.id },
      data: {
        viewCount: { increment: 1 },
      },
    });

    if (!newsItem) {
      return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 });
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
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, category, imageUrl, fileUrl, photoCount } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (category !== undefined) data.category = category;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (fileUrl !== undefined) data.fileUrl = fileUrl;
    if (photoCount !== undefined) data.photoCount = photoCount;

    const newsItem = await prisma.news.update({
      where: { id: params.id },
      data,
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
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.news.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete news error:', error);
    return NextResponse.json({ error: 'Ошибка удаления новости' }, { status: 500 });
  }
}
