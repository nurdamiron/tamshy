import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exists = await prisma.material.findUnique({ where: { id: params.id } });
    if (!exists) {
      return NextResponse.json({ error: 'Материал не найден' }, { status: 404 });
    }

    await prisma.material.update({
      where: { id: params.id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track download error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
