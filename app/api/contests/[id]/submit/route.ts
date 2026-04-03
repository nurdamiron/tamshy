import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { fullName, birthDate, email, phone, institution, region, fileUrl } = body;

    if (!fullName || !birthDate || !email || !phone || !institution || !region) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const contest = await prisma.contest.findUnique({
      where: { id: params.id },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Конкурс не найден' }, { status: 404 });
    }

    if (contest.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Конкурс завершён' }, { status: 400 });
    }

    if (new Date() > contest.deadline) {
      return NextResponse.json({ error: 'Срок подачи истёк' }, { status: 400 });
    }

    const submission = await prisma.contestSubmission.create({
      data: {
        contestId: params.id,
        fullName,
        birthDate,
        email,
        phone,
        institution,
        region,
        fileUrl,
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error('Submit contest error:', error);
    return NextResponse.json({ error: 'Ошибка подачи заявки' }, { status: 500 });
  }
}
