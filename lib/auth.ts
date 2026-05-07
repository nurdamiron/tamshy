import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const rawSecret = process.env.JWT_SECRET?.trim();
if (!rawSecret || rawSecret.length < 32) {
  throw new Error(
    '[FATAL] JWT_SECRET не задан или короче 32 символов. ' +
    'Установите переменную окружения JWT_SECRET длиной минимум 32 символа.'
  );
}
const JWT_SECRET = new TextEncoder().encode(rawSecret);
const TOKEN_NAME = 'tamshy-token';
const EXPIRY = '7d';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  tv: number; // tokenVersion — для инвалидации при смене роли
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(EXPIRY)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  return user;
}

export async function getTokenPayload(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Возвращает payload с проверкой tokenVersion из БД.
 * Использовать в маршрутах, критичных к актуальности роли (jury scoring, admin).
 * Если роль пользователя была изменена — токен отклоняется.
 * Legacy-токены (без поля tv) принимаются как tv=0.
 */
export async function getVerifiedPayload(): Promise<TokenPayload | null> {
  const payload = await getTokenPayload();
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { tokenVersion: true, role: true },
  });

  if (!user) return null;

  const tokenVersion = (payload as { tv?: number }).tv ?? 0;
  if (user.tokenVersion !== tokenVersion) return null;

  // Возвращаем payload с актуальной ролью из БД
  return { ...payload, role: user.role };
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}
