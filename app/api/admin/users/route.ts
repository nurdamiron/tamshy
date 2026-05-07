import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVerifiedPayload } from '@/lib/auth';
import { ADMIN_USERS_PER_PAGE } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = ADMIN_USERS_PER_PAGE;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          _count: { select: { projects: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / perPage),
      page,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки пользователей' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getVerifiedPayload();
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: 'Укажите userId и role' }, { status: 400 });
    }

    if (!['STUDENT', 'TEACHER', 'JURY', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Некорректная роль' }, { status: 400 });
    }

    // Нельзя менять роль самому себе
    if (userId === payload.userId) {
      return NextResponse.json({ error: 'Нельзя изменить свою собственную роль' }, { status: 400 });
    }

    // Нельзя понижать последнего ADMIN
    if (role !== 'ADMIN') {
      const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (targetUser?.role === 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
          return NextResponse.json(
            { error: 'Нельзя понизить последнего администратора системы' },
            { status: 400 }
          );
        }
      }
    }

    // Инкрементируем tokenVersion — invalidates все активные сессии пользователя
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role, tokenVersion: { increment: 1 } },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json({ error: 'Ошибка обновления роли' }, { status: 500 });
  }
}
