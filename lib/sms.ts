import { randomInt, createHmac } from 'crypto';
import { prisma } from './prisma';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;
const DEV_OTP = '000000';

/** Криптографически стойкая генерация OTP */
function generateOTP(): string {
  return Array.from({ length: OTP_LENGTH }, () => randomInt(0, 10)).join('');
}

/**
 * Хешируем OTP через HMAC-SHA256 перед сохранением в БД.
 * Если база скомпрометирована — коды не утекают в открытом виде.
 */
function hashOTP(code: string): string {
  const salt = process.env.JWT_SECRET ?? 'fallback-otp-salt';
  return createHmac('sha256', salt).update(code).digest('hex');
}

export async function sendOTP(phone: string): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development' || !process.env.MOBIZON_API_KEY;
  const code = isDev ? DEV_OTP : generateOTP();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.upsert({
    where: { phone },
    update: { otpCode: hashOTP(code), otpExpiry: expiry },
    create: { phone, otpCode: hashOTP(code), otpExpiry: expiry },
  });

  if (isDev) {
    console.log(`[DEV] OTP for ${phone}: ${code}`);
    return;
  }

  await fetch('https://api.mobizon.kz/service/Message/SendSmsMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.MOBIZON_API_KEY,
      recipient: phone,
      text: `Ваш код для Тамшы: ${code}. Действителен ${OTP_EXPIRY_MINUTES} минут.`,
    }),
  });
}

export async function sendNotification(phone: string, text: string): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development' || !process.env.MOBIZON_API_KEY;
  if (isDev) {
    console.log(`[DEV SMS] → ${phone}: ${text}`);
    return;
  }
  try {
    await fetch('https://api.mobizon.kz/service/Message/SendSmsMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.MOBIZON_API_KEY,
        recipient: phone,
        text,
      }),
    });
  } catch {
    console.error('[SMS] Failed to send notification to', phone);
  }
}

export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user || !user.otpCode || !user.otpExpiry) return false;
  if (user.otpCode !== hashOTP(code)) return false;
  if (new Date() > user.otpExpiry) return false;

  await prisma.user.update({
    where: { phone },
    data: { otpCode: null, otpExpiry: null },
  });

  return true;
}
