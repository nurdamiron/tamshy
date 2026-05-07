import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { checkRateLimit, formLimiter } from '@/lib/ratelimit';
import { contactSchema } from '@/lib/validators';
import { sendContactNotification } from '@/lib/email';

const CONTACTS_PER_PAGE = 20;

export async function POST(req: NextRequest) {
  try {
    const blocked = await checkRateLimit(req, formLimiter);
    if (blocked) return blocked;

    const body = await req.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, topic, message, fileUrl } = result.data;
    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, topic, message, fileUrl },
    });

    // Отправляем email асинхронно — не блокируем ответ при сбое
    sendContactNotification({ name, email, topic, message, fileUrl }).catch((err) =>
      console.error('[email] sendContactNotification failed:', err)
    );

    return NextResponse.json({ message: contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Create contact message error:', error);
    return NextResponse.json({ error: 'Ошибка отправки сообщения' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * CONTACTS_PER_PAGE,
        take: CONTACTS_PER_PAGE,
      }),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({
      messages,
      total,
      pages: Math.ceil(total / CONTACTS_PER_PAGE),
      page,
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки сообщений' }, { status: 500 });
  }
}
