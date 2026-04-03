import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenPayload } from '@/lib/auth';
import { checkRateLimit, formLimiter } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    const blocked = await checkRateLimit(req, formLimiter);
    if (blocked) return blocked;
    const body = await req.json();
    const { name, email, topic, message, fileUrl } = body;

    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        topic,
        message,
        fileUrl,
      },
    });

    return NextResponse.json({ message: contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Create contact message error:', error);
    return NextResponse.json({ error: 'Ошибка отправки сообщения' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payload = await getTokenPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get contact messages error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки сообщений' }, { status: 500 });
  }
}
