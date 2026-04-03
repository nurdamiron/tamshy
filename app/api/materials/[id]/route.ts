import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
    });

    if (!material) {
      return NextResponse.json({ error: 'Материал не найден' }, { status: 404 });
    }

    return NextResponse.json({ material });
  } catch (error) {
    console.error('Get material error:', error);
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
    const { title, description, format, fileUrl, fileSize, type, audience, year, featured } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (format !== undefined) data.format = format;
    if (fileUrl !== undefined) data.fileUrl = fileUrl;
    if (fileSize !== undefined) data.fileSize = fileSize;
    if (type !== undefined) data.type = type;
    if (audience !== undefined) data.audience = audience;
    if (year !== undefined) data.year = parseInt(year);
    if (featured !== undefined) data.featured = featured;

    const material = await prisma.material.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ material });
  } catch (error) {
    console.error('Update material error:', error);
    return NextResponse.json({ error: 'Ошибка обновления материала' }, { status: 500 });
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

    await prisma.material.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete material error:', error);
    return NextResponse.json({ error: 'Ошибка удаления материала' }, { status: 500 });
  }
}
