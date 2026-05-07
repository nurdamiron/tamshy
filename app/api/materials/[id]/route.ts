import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { materialUpdateSchema } from '@/lib/validators';

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
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const result = materialUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const material = await prisma.material.update({
      where: { id: params.id },
      data: result.data,
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
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    await prisma.material.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete material error:', error);
    return NextResponse.json({ error: 'Ошибка удаления материала' }, { status: 500 });
  }
}
