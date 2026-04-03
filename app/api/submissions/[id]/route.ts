import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';

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
    const { status } = body;

    if (!status || !['NEW', 'REVIEWING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Некорректный статус' },
        { status: 400 }
      );
    }

    const submission = await prisma.contestSubmission.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json({ error: 'Ошибка обновления заявки' }, { status: 500 });
  }
}
