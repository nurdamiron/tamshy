import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';
import { juryScoreSchema } from '@/lib/validators';
import { sendNotification } from '@/lib/sms';

const STATUS_SMS: Record<string, string> = {
  APPROVED: 'Ваш проект одобрен и допущен к голосованию на платформе Tamshy.kz 🎉',
  REJECTED: 'К сожалению, ваш проект был отклонён. Подробности — на Tamshy.kz',
  WINNER: '🏆 Поздравляем! Ваш проект признан победителем конкурса Tamshy! Подробности на Tamshy.kz',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true } }, // phone не возвращаем публично
        _count: { select: { votes: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getTokenPayload();
    if (!payload || (payload.role !== 'JURY' && payload.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();

    // JURY может только APPROVED/REJECTED; WINNER — только ADMIN
    const allowedStatuses =
      payload.role === 'ADMIN'
        ? (['APPROVED', 'REJECTED', 'WINNER'] as const)
        : (['APPROVED', 'REJECTED'] as const);

    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Недостаточно прав для установки этого статуса' },
        { status: 403 }
      );
    }

    const result = juryScoreSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({
      where: { id: params.id },
      include: { author: { select: { phone: true, consentSms: true } } },
    });

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        juryScore: result.data.score,
        juryComment: result.data.comment,
        status: result.data.status,
      },
    });

    // SMS-уведомление при смене статуса (только если учитель дал согласие)
    if (
      existing &&
      existing.status !== result.data.status &&
      existing.author.consentSms &&
      STATUS_SMS[result.data.status]
    ) {
      sendNotification(existing.author.phone, STATUS_SMS[result.data.status]).catch(() => {});
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}
