import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';

const VALID_STATUSES = ['NEW', 'REVIEWING', 'ACCEPTED', 'REJECTED'];

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
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Некорректный статус' }, { status: 400 });
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
